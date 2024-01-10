import { Box, Heading, Image, Input, InputGroup, InputLeftElement, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import Navigationadmin from "../components/Navigationadmin";
import Sidebar from "../components/Sidebar";
import { SearchIcon } from "@chakra-ui/icons";
import { useCallback, useEffect, useState } from "react";
import useDebounceValue from "../hooks/useDebounceValue";
import getAllMutations from "../api/mutation/getAllMutations";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import getWarehouses from "../api/warehouse/getWarehouses";
import { useSelector } from "react-redux";
import getWarehouseByAdmin from "../api/warehouse/getWarehouseByAdmin";
import getSingleAdmin from "../api/users/getSingleAdmin";
import { SummaryStock } from "../components/SummaryStock";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const Stock = () => {
  const isWarehouseAdmin = useSelector((state) => state?.account?.isWarehouseAdmin);
  const adminData = useSelector((state) => state?.account?.adminProfile?.data?.profile);
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState("");
  const [order, setOrder] = useState("");
  const [page, setPage] = useState(1);
  const [mutations, setMutations] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [warehouseId, setWarehouseId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  console.log(mutations);

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
  const size = 5;
  const debouncedSearchInput = useDebounceValue(searchInput, 300);
  const navigate = useNavigate();

  const handleSearchInputChange = (e) => setSearchInput(e.target.value);

  const fetchMutations = useCallback(async () => {
    try {
      let warehouseIdValue = warehouseId;
      let selectedMonthValue = selectedMonth;

      if (warehouseId === "" || warehouseId === null) {
        warehouseIdValue = "";
      }

      if (selectedMonth === "" || selectedMonth === null) {
        selectedMonthValue = "";
      }
      const response = await getAllMutations({
        page,
        size,
        sort,
        order,
        search: debouncedSearchInput,
        warehouseId: warehouseIdValue,
        month: selectedMonthValue,
        year: selectedYear,
      });

      setMutations(response.detail);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error(error.response.data.message, {
          description: error.response.data.detail,
        });
        console.error(error);
      } else if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        toast.error(error.response.data.message, {
          description: error.response.data.detail,
        });
        navigate("/adminlogin");
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, sort, order, warehouseId, selectedMonth, selectedYear, debouncedSearchInput]);

  const fetchWarehouse = useCallback(async () => {
    try {
      const response = await getWarehouses();
      if (response.ok) {
        setWarehouseList(response.data);
      }
    } catch (error) {
      if (error.response && (error.response.status === 404 || error.response.status === 500)) {
        toast.error(error.response.data.message);
        if (error.response.status === 500) console.error(error.response.data.detail);
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

        const response2 = await getWarehouseByAdmin({ adminId: adminIdFromResponse });

        if (response2.ok) {
          const warehouseIdFromResponse = response2.detail.id;
          setWarehouseList(response2.detail);
          setWarehouseId(warehouseIdFromResponse);
          fetchMutations();
        }
      }
    } catch (error) {
      if (error.response && (error.response.status === 404 || error.response.status === 401 || error.response.status === 403 || error.response.status === 500)) {
        toast.error(error.response.data.message);
        if (error.response.status === 500) console.error(error);
        if (error.response.status === 401 || error.response.status === 403) {
          navigate("/adminlogin");
        }
      }
    }
  };

  useEffect(() => {
    if (isWarehouseAdmin) {
      fetchAdminWarehouseData();
    } else {
      fetchWarehouse();
      fetchMutations();
    }
  }, [fetchMutations]);

  return (
    <div className="flex flex-row justify-between h-screen">
      <Sidebar />
      <div className="w-[82vw] lg:w-[84vw] bg-[#f0f0f0] overflow-hidden flex flex-col">
        <div className="shadow-md fixed top-0 left-[18vw] lg:left-[16vw] right-0 z-50 bg-white">
          <Navigationadmin />
        </div>

        <div className="flex mt-16 pt-8 pb-4 px-4 lg:px-8">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="#40403F" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Find product id or mutation type"
              value={searchInput}
              onChange={handleSearchInputChange}
              bgColor={"white"}
              borderColor={"#40403F"}
              w={{ base: "90%", md: "300px" }}
              _hover={{ borderColor: "#40403F" }}
            />
          </InputGroup>

          <div className="flex gap-2 w-[38vw]">
            <select
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#40403F] focus:border-[#40403F] block w-full p-2.5 cursor-pointer">
              {isWarehouseAdmin ? (
                <option value={warehouseId}>{warehouseList.name}</option>
              ) : (
                <>
                  <option value={""}>All Warehouse</option>
                  {warehouseList.map((warehouse, index) => (
                    <option key={index} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </>
              )}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
              }}
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
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col px-4 md:px-8 min-h-[50vh] md:h-[67vh] overflow-y-auto scrollbar-hide w-full">
            <Skeleton height="100px" />
            <TableContainer bgColor={"white"} borderBottomRadius={"md"} overflowY={"auto"} h={"full"} mt={5}>
              <Table variant="striped" colorScheme="blackAlpha">
                <Thead>
                  <Tr textColor={"#40403F"} fontWeight={"bold"}>
                    <Th>ID</Th>
                    <Th>Product</Th>
                    <Th>Category</Th>
                    <Th>Warehouse</Th>
                    <Th>Date</Th>
                    <Th>
                      Mutation <br /> Type
                    </Th>
                    <Th>
                      Previous <br /> Stock
                    </Th>
                    <Th>
                      Inventory
                      <br />
                      Change
                    </Th>
                    <Th>
                      Total <br /> Stock
                    </Th>
                    <Th>Status</Th>
                    <Th>Description</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Tr key={index}>
                      {Array.from({ length: 11 }).map((_, index) => (
                        <Td key={index}>
                          <Skeleton height="40px" width="100%" />
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        ) : mutations.length > 0 ? (
          <>
            <div className="flex flex-col px-4 md:px-8 min-h-[50vh] md:h-[67vh] overflow-y-auto scrollbar-hide w-full">
              <SummaryStock selectedMonth={selectedMonth} warehouseId={warehouseId} selectedYear={selectedYear} />
              <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} py={3} px={5} bgColor={"white"} borderTopRadius={"md"}>
                <Heading size="md">Stock History</Heading>

                <div className="flex gap-2">
                  <select value={order} onChange={(e) => setOrder(e.target.value)} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#40403F] focus:border-[#40403F] block w-full p-2.5 cursor-pointer">
                    <option value="">Order</option>
                    <option value="ASC">Ascending</option>
                    <option value="DESC">Descending</option>
                  </select>
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#40403F] focus:border-[#40403F] block w-full p-2.5 cursor-pointer">
                    <option value="">Sort by</option>
                    <option value="createdAt">Created at</option>
                    <option value="stock">Stock</option>
                  </select>
                </div>
              </Box>
              <TableContainer bgColor={"white"} borderBottomRadius={"md"} overflowY={"auto"} h={"full"}>
                <Table variant="striped" colorScheme="blackAlpha">
                  <Thead>
                    <Tr textColor={"#40403F"} fontWeight={"bold"}>
                      <Th>ID</Th>
                      <Th>Product</Th>
                      <Th>Category</Th>
                      <Th>Warehouse</Th>
                      <Th>Date</Th>
                      <Th>
                        Mutation <br /> Type
                      </Th>
                      <Th>
                        Previous <br /> Stock
                      </Th>
                      <Th>
                        Inventory
                        <br />
                        Change
                      </Th>
                      <Th>
                        Total <br /> Stock
                      </Th>
                      <Th>Status</Th>
                      <Th>Description</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {mutations.map((mutation, index) => (
                      <Tr key={index}>
                        <Td>{mutation.productId}</Td>
                        <Td display={"flex"} gap={2} alignItems={"center"}>
                          <Image src={`http://localhost:8000/public/${mutation?.Product?.productImages[0]?.imageUrl}` ? `http://localhost:8000/public/${mutation?.Product?.productImages[0]?.imageUrl}` : "https://via.placeholder.com/50"} alt={mutation?.Product?.name} width={50} height={50} />
                          {mutation.Product?.name}
                        </Td>
                        <Td>{mutation?.Product?.Categories[0]?.name ? mutation.Product?.Categories[0]?.name : "-"}</Td>
                        <Td>{mutation?.Warehouse?.name ? mutation.Warehouse?.name : "-"}</Td>
                        <Td>{mutation?.createdAt.slice(0, 10) ? mutation.createdAt.slice(0, 10) : "-"}</Td>
                        <Td>{mutation?.mutationType ? mutation.mutationType : "-"}</Td>
                        <Td>{mutation?.previousStock}</Td>
                        <Td color={mutation.status === "processing" || mutation.status === "pending" ? "orange" : mutation.status === "cancelled" || mutation.status === "failed" ? "red" : "green"}>
                          {mutation?.mutationType === "add" ? "+" : "-"}
                          {mutation?.mutationQuantity}
                        </Td>
                        <Td color={mutation.status === "processing" || mutation.status === "pending" ? "orange" : mutation.status === "cancelled" || mutation.status === "failed" ? "red" : "green"}>{mutation.stock}</Td>
                        <Td color={mutation.status === "processing" || mutation.status === "pending" ? "orange" : mutation.status === "cancelled" || mutation.status === "failed" ? "red" : "green"}>
                          {mutation?.status ? mutation.status : "-"}
                        </Td>
                        <Td>{mutation?.description}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </div>
          </>
        ) : (
          <div className="flex flex-col mt-16 py-8 px-4 md:p-8 gap-2 h-[55vh]">
            <h1 className="text-3xl font-semibold italic text-center">No data matches</h1>
          </div>
        )}
        <div className="flex justify-between items-center px-8 mt-3 mb-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="bg-[#40403F] text-white py-2 px-4 rounded-md font-bold">
            Prev
          </button>
          <span className="text-[#40403F] font-bold">Page {page}</span>
          <button disabled={mutations.length < size} onClick={() => setPage(page + 1)} className="bg-[#40403F] text-white py-2 px-4 rounded-md font-bold">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
