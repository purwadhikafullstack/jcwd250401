import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import Navigationadmin from "../components/Navigationadmin";
import Sidebar from "../components/Sidebar";
import { useCallback, useEffect, useRef, useState } from "react";
import { RequestStockModal } from "../components/RequestStockModal";
import { useSelector } from "react-redux";
import { SearchIcon } from "@chakra-ui/icons";
import getWarehouses from "../api/warehouse/getWarehouses";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import getAllMutationsJournal from "../api/mutation/getAllMutationsJournal";
import useDebounceValue from "../hooks/useDebounceValue";
import { ProcessStockModal } from "../components/ProcessStockModal";
import getWarehouseByAdmin from "../api/warehouse/getWarehouseByAdmin";
import getSingleAdmin from "../api/users/getSingleAdmin";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const WarehouseOrder = () => {
  const navList = ["All Order", "Pending", "Success", "Cancelled"];
  const isWarehouseAdmin = useSelector((state) => state?.account?.isWarehouseAdmin);
  const adminData = useSelector((state) => state?.account?.adminProfile?.data?.profile);
  const [adminId, setAdminId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [mutations, setMutations] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [warehouseId, setWarehouseId] = useState(null);
  const [destinationWarehouseId, setDestinationWarehouseId] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState("All Order");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedOrderData, setSelectedOrderData] = useState(null);
  const [requestStockModal, setRequestStockModal] = useState(false);
  const [confirmStockModal, setConfirmStockModal] = useState(false);
  const [rejectStockModal, setRejectStockModal] = useState(false);
  const [pillWidth, setPillWidth] = useState(0); // State to store the width of the pill
  const [sort, setSort] = useState(null);
  const [order, setOrder] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);

  const generateYears = (startYear, endYear) => {
    const years = [];
    for (let i = startYear; i >= endYear; i--) {
      years.push(i.toString());
    }
    return years;
  };

  const currentYear = new Date().getFullYear();
  const yearsArray = generateYears(currentYear, currentYear - 4);

  const months = [
    {
      id: 1,
      name: "January",
    },
    {
      id: 2,
      name: "February",
    },
    {
      id: 3,
      name: "March",
    },
    {
      id: 4,
      name: "April",
    },
    {
      id: 5,
      name: "May",
    },
    {
      id: 6,
      name: "June",
    },
    {
      id: 7,
      name: "July",
    },
    {
      id: 8,
      name: "August",
    },
    {
      id: 9,
      name: "September",
    },
    {
      id: 10,
      name: "October",
    },
    {
      id: 11,
      name: "November",
    },
    {
      id: 12,
      name: "December",
    },
  ];

  const navRefs = useRef([]); // Refs to store references to each navigation item
  const navigate = useNavigate();
  const size = 2;
  const debouncedSearchInput = useDebounceValue(searchInput, 500);

  const handleSearchInputChange = (e) => setSearchInput(e.target.value);
  const handleSelectComponent = (nav) => {
    setSelectedComponent(nav);
    setSelectedStatus(nav.toLowerCase());
  };

  const handleCloseRejectStockModal = () => {
    setSelectedOrderData(null);
    setRejectStockModal(false);
    fetchMuntationsJournal();
  };

  const handleCloseConfirmStockModal = () => {
    setSelectedOrderData(null);
    setConfirmStockModal(false);
    fetchMuntationsJournal();
  };

  const handleCloseRequestStockModal = () => {
    setSelectedOrderData(null);
    setRequestStockModal(false);
    fetchMuntationsJournal();
  };

  const fetchWarehouses = useCallback(async () => {
    try {
      const response = await getWarehouses();
      setWarehouseList(response.data);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 404 || error.response.status === 500)) {
        toast.error(error.response.data.message);
        if (error.response.status === 401 || error.response.status === 403) navigate("/adminlogin");
        if (error.response.status === 500) console.error(error);
      }
    }
  }, []);

  const fetchAdminWarehouseData = async () => {
    try {
      const response = await getSingleAdmin({
        username: adminData?.username,
        email: adminData?.email,
      });
      if (response.ok) {
        const adminIdFromResponse = response.detail.id;
        setAdminId(adminIdFromResponse);

        const response2 = await getWarehouseByAdmin({ adminId: adminIdFromResponse });
        if (response2.ok) {
          const warehouseIdFromResponse = response2.detail.id;
          setWarehouseId(warehouseIdFromResponse);
        }
      }
    } catch (error) {
      if (error.response && (error.response.status === 404 || error.response.status === 500)) {
        toast.error(error.response.data.message);
        if (error.response.status === 500) console.error(error);
      }
    }
  };

  const fetchMuntationsJournal = useCallback(async () => {
    try {
      let selectedStatusValue = selectedStatus;
      if (selectedStatus === "all order") {
        selectedStatusValue = "";
      }

      const response = await getAllMutationsJournal({
        page,
        size,
        sort,
        order,
        warehouseId,
        destinationWarehouseId,
        search: debouncedSearchInput,
        month: selectedMonth,
        status: selectedStatusValue,
        year: selectedYear,
      });
      setMutations(response.detail.data);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error(error.response.data.message);
        if (error.response.status === 500) console.error(error);
      } else if (error.response && error.response.status === 404) {
        setMutations([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, size, sort, order, warehouseId, destinationWarehouseId, debouncedSearchInput, selectedMonth, selectedYear, selectedStatus]);

  useEffect(() => {
    fetchWarehouses();
    fetchMuntationsJournal();

    if (isWarehouseAdmin) {
      fetchAdminWarehouseData();
    }
  }, [fetchWarehouses, fetchMuntationsJournal]);

  useEffect(() => {
    // Calculate the width of the selected navigation item
    if (navRefs[selectedComponent]) {
      setPillWidth(navRefs[selectedComponent].offsetWidth);
    }
  }, [selectedComponent]);

  return (
    <div className="flex flex-row justify-between h-screen">
      <Sidebar />
      <div className="w-[82vw] lg:w-[84vw] bg-[#f0f0f0] overflow-hidden flex flex-col">
        <div className="shadow-md fixed top-0 left-[18vw] lg:left-[16vw] right-0 z-50 bg-white">
          <Navigationadmin />
        </div>

        <div className="flex flex-col mt-16 py-8 px-4 md:p-8 justify-between">
          <div className="flex flex-col lg:flex-row gap-2">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="#40403F" />
              </InputLeftElement>
              <Input type="number" placeholder="Find product id" value={searchInput} onChange={handleSearchInputChange} bgColor={"white"} borderColor={"#40403F"} w={{ base: "100%", xl: "300px" }} _hover={{ borderColor: "#40403F" }} />
            </InputGroup>
            <button className="text-white lg:w-[20vw] bg-[#40403F] p-2.5 rounded-lg hover:opacity-0.8 font-semibold" onClick={() => setRequestStockModal(!requestStockModal)}>
              Request Stock
            </button>
            <div className="flex gap-2 w-[100%] lg:w-[75vw]">
              {isWarehouseAdmin ? (
                ""
              ) : (
                <select
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#40403F] focus:border-[#40403F] block w-full p-2.5 cursor-pointer">
                  <option value={""}>Origin Warehouse</option>
                  {warehouseList.map((warehouse, index) => (
                    <option key={index} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              )}
              <select
                value={destinationWarehouseId}
                onChange={(e) => setDestinationWarehouseId(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#40403F] focus:border-[#40403F] block w-full p-2.5 cursor-pointer">
                <option value={""}>Destination Warehouse</option>
                {warehouseList.map((warehouse, index) => (
                  <option key={index} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#40403F] focus:border-[#40403F] block w-full p-2.5 cursor-pointer">
                <option value={""}>Month</option>
                {months.map((month, index) => (
                  <option key={index} value={month.id}>
                    {month.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#40403F] focus:border-[#40403F] block w-full p-2.5 cursor-pointer">
                <option value={""}>Year</option>
                {yearsArray.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select value={order} onChange={(e) => setOrder(e.target.value)} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#40403F] focus:border-[#40403F] block w-full p-2.5 cursor-pointer">
                <option value={""} disabled>
                  Order
                </option>
                <option value={"ASC"}>Ascending</option>
                <option value={"DESC"}>Descending</option>
              </select>

              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#40403F] focus:border-[#40403F] block w-full p-2.5 cursor-pointer">
                <option value={""}>Sort</option>
                <option value={"mutationQuantity"}>Mutation Quantity</option>
                <option value={"createdAt"}>Date</option>
              </select>
            </div>
          </div>

          <div className="flex items-center p-2 md:p-4 mt-4 bg-white rounded-lg shadow-lg">
            <div className="hidden md:flex flex-wrap gap-3 lg:gap-14 mx-4">
              {navList.map((nav, index) => (
                <span
                  key={index}
                  className={`text-sm font-bold ${selectedComponent === nav ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"} cursor-pointer hover:text-gray-700 relative 
                  }`}
                  onClick={() => handleSelectComponent(nav)}
                  ref={(ref) => (navRefs[nav] = ref)} // Save a reference to the navigation item
                >
                  {nav}
                  {selectedComponent === nav && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 pill-animation bg-black h-1 rounded-lg" style={{ width: `${pillWidth}px` }}></div>}
                </span>
              ))}
            </div>

            <div className=" ml-2 flex md:hidden flex-wrap">
              <select className="text-sm font-bold text-gray-900 dark:text-white cursor-pointer hover:text-gray-700 w-[150px] rounded-md" onChange={(e) => handleSelectComponent(e.target.value)}>
                {navList.map((nav, index) => (
                  <option key={index} value={nav}>
                    {nav}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-lg mt-4 h-[42vh] lg:h-[57vh] overflow-y-auto scrollbar-hide">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-lg w-[1000px] lg:w-[100%] mb-5 lg:mb-0">
                  <Skeleton height={100} width={100} />
                </div>
              ))
            ) : mutations.length > 0 ? (
              mutations.map((mutation, index) => {
                return (
                  <div key={index} className="p-4 bg-white rounded-lg shadow-lg w-[1000px] lg:w-[100%] mb-5 lg:mb-0">
                    <div className="flex items-center gap-2">
                      {mutation.status === "pending" && <span className="bg-[#d3820066] text-[#d38200cb] py-1 px-2 rounded-md font-bold">Pending</span>}
                      {mutation.status === "success" && <span className="bg-[#7AFFC766] text-[#15c079cb] py-1 px-2 rounded-md font-bold">Success</span>}
                      {mutation.status === "cancelled" && <span className="bg-[#92191966] text-[#921919cb] py-1 px-2 rounded-md font-bold">Cancelled</span>}
                      <p>
                        {mutation.createdAt.slice(0, 10)} / {mutation.Warehouse.name}
                      </p>
                    </div>
                    <hr className="my-2" />
                    <div className="flex mt-4">
                      <img src={`http://localhost:8000/public/${mutation.Product.productImages[0].imageUrl}`} alt={mutation.Product.name} className="w-20 h-20 object-cover" />
                      <div className="ml-2">
                        <p className="text-sm font-bold">{mutation.Product.name}</p>
                      </div>
                      <div className="ml-10">
                        <div>
                          <div>
                            <p className="font-bold">Sent From</p>
                            <p>{mutation.sourceWarehouseData.name}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="font-bold">Total Request</p>
                          <p>{mutation.mutationQuantity}</p>
                        </div>
                      </div>

                      <div className="ml-20">
                        <div>
                          <p className="font-bold">Sent To</p>
                          <p>{mutation.destinationWarehouseData.name}</p>
                        </div>

                        <div className="mt-4">
                          <p className="font-bold">Status</p>
                          <p>{mutation.status}</p>
                        </div>
                      </div>

                      <div className="ml-auto">
                        <p className="font-bold">Mutation Information</p>
                        <p className="text-sm w-[25vw]">{mutation.description}</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      {adminId === mutation.sourceWarehouseData.adminId && mutation.status === "pending" && (
                        <>
                          <button
                            onClick={() => {
                              setRejectStockModal(true);
                              setSelectedOrderData(mutation);
                            }}
                            className="border border-[#DF5050] text-[#DF5050] py-2 px-4 rounded-lg font-bold">
                            Reject Mutation
                          </button>

                          <button
                            onClick={() => {
                              setConfirmStockModal(true);
                              setSelectedOrderData(mutation);
                            }}
                            className="bg-[#40403F] text-white py-2 px-4 rounded-lg font-bold">
                            Confirm Mutation
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col mt-16 py-8 px-4 md:p-8 gap-2 h-[55vh]">
                <h1 className="text-3xl font-semibold italic text-center">No data matches</h1>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-3 mb-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="bg-[#40403F] text-white py-2 px-4 rounded-md font-bold">
              Prev
            </button>
            <span className="text-[#40403F] font-bold">Page {page}</span>
            <button disabled={mutations.length < size} onClick={() => setPage(page + 1)} className="bg-[#40403F] text-white py-2 px-4 rounded-md font-bold">
              Next
            </button>
          </div>
        </div>

        <ProcessStockModal isOpen={confirmStockModal} onClose={handleCloseConfirmStockModal} data={selectedOrderData} action={"process"} />
        <ProcessStockModal isOpen={rejectStockModal} onClose={handleCloseRejectStockModal} data={selectedOrderData} action={"cancel"} />
        <RequestStockModal isOpen={requestStockModal} onClose={handleCloseRequestStockModal} />
      </div>
    </div>
  );
};
