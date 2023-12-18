import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavPage } from "../components/NavPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { showLoginModal } from "../slices/authModalSlices";
import api from "../api";
import { toast } from "sonner";
import { PaymentProofModal } from "../components/PaymentProofModal";
import getProfile from "../api/profile/getProfile";
import getUserOrder from "../api/order/getUserOrder";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { PiCamera, PiUploadSimple, PiUploadSimpleBold } from "react-icons/pi";

export const Order = () => {
  let isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
  const listsMenu = ["Profile", "Address Book", "My Order", "Change Password"];
  const orderStatus = ["All", "Unpaid", "Waiting for Confirmation", "Processed", "On Delivery", "Delivered", "Cancelled"];
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedPaymentProof, setSelectedPaymentProof] = useState(null);
  const [selectedTotalPrice, setSelectedTotalPrice] = useState(null);
  const [openModalProof, setOpenModalProof] = useState(false);
  const [orderLists, setOrderLists] = useState([]);
  const [page, setPage] = useState(1);
  const size = 5;
  const [sort, setSort] = useState("date-desc");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [remainingTimes, setRemainingTimes] = useState({});

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(loadingTimeout); // Clear the timeout on component unmount
  }, [page, sort, selectedStatus]);

  useEffect(() => {
    // Scroll to the top when the component is first rendered
    window.scrollTo(0, 0);
  }, []);

  document.title = "RAINS - My Order";

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", newPage);

    navigate({
      pathname: location.pathname,
      search: queryParams.toString(),
    });
  };

  const [expandedOrders, setExpandedOrders] = useState([]);

  const toggleExpand = (index) => {
    const newExpandedOrders = [...expandedOrders];
    newExpandedOrders[index] = !newExpandedOrders[index];
    setExpandedOrders(newExpandedOrders);
  };

  const handleStatusChange = (status) => {
    setPage(1);

    const queryParams = new URLSearchParams(location.search);
    queryParams.set("status", status);

    setSelectedStatus(status);

    navigate({
      pathname: location.pathname,
      search: queryParams.toString(),
    });
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);

    const queryParams = new URLSearchParams(location.search);
    queryParams.set("sort", e.target.value);

    navigate({
      pathname: location.pathname,
      search: queryParams.toString(),
    });
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page");
    const status = queryParams.get("status");
    const sort = queryParams.get("sort");

    if (page) {
      setPage(parseInt(page));
    }

    if (status) {
      setSelectedStatus(status);
    }

    if (sort) {
      setSort(sort);
    }
  }, [location.search]);

  const handleOpenModalProof = (orderId, paymentBy, totalPrice) => {
    setSelectedOrder(orderId);
    setSelectedPaymentProof(paymentBy);
    setSelectedTotalPrice(totalPrice);
    setOpenModalProof(true);
  };

  const getOrderLists = async () => {
    try {
      const response = await getUserOrder({
        status: selectedStatus,
        page,
        size,
        sort,
      });
      setOrderLists(response.detail);
      setTotalPages(response.pagination.totalPages);

      console.log(response.detail);
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 403) {
        toast.error(error.response.data.message);
        setOrderLists([]);
        navigate("/");
        dispatch(showLoginModal());
      } else if (error.response.status === 404) {
        setOrderLists([]);
      } else if (error.response.status === 500) {
        toast.error(error.response.data.message);
        setOrderLists([]);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getOrderLists();
    }
  }, [selectedStatus, page, size, sort]);

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const sortingOptions = [
    { label: "Latest", value: "date-desc" },
    { label: "Oldest", value: "date-asc" },
    { label: "Lowest Price", value: "price-asc" },
    { label: "Highest Price", value: "price-desc" },
  ];

  const getStatusLabel = (status) => {
    // Use a regular expression to capitalize the first letter of each word
    return status.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const calculateTimeRemaining = (createdAt) => {
    const currentTime = new Date().getTime();
    const updatedAtTime = new Date(createdAt).getTime();
    const timeDifference = updatedAtTime + 24 * 60 * 60 * 1000 - currentTime;

    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  useEffect(() => {
    // Calculate and update remaining time for each order
    const updateRemainingTimes = () => {
      const updatedRemainingTimes = {};
      orderLists.forEach((orderItem) => {
        if (orderItem.status === "unpaid") {
          updatedRemainingTimes[orderItem.orderId] = calculateTimeRemaining(orderItem.createdAt);
        }
      });
      setRemainingTimes(updatedRemainingTimes);
    };

    const timerInterval = setInterval(updateRemainingTimes, 1000);

    // Initial calculation
    updateRemainingTimes();

    return () => clearInterval(timerInterval); // Clear the interval on component unmount
  }, [orderLists]);

  const formatTime = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  return (
    <>
      <NavPage pageName={"Order"} />
      <div className="flex lg:px-36 lg:justify-normal justify-center  font-sagoe">
        <div className="hidden lg:flex flex-col w-[20vw]">
          {listsMenu.map((list, index) => {
            const joinedList = list.toLowerCase().replace(/\s/g, "-");
            const isMyOrder = list === "My Order";
            return (
              <Link key={index} to={`/account/${joinedList}`} className={`block py-2 text-sm font-sagoe text-gray-700 hover:underline ${isMyOrder ? "font-black" : ""}`}>
                {list}
              </Link>
            );
          })}
        </div>
        <div className="w-full min-h-[40vh] lg:w-[60vw] overflow-y-hidden shadow-md">
          {isLoggedIn ? (
            <div className="px-6 py-4 w-full">
              <div id="orderStatus" className="hidden sm:flex flex-col">
                <span className="font-bold text-2xl">Status</span>

                <div className="flex justify-between">
                  <div className="w-[40vw] overflow-x-auto ">
                    <div className="flex w-[55vw]">
                      {orderStatus.map((status, index) => {
                        const joinedStatus = status.toLowerCase().replace(/\s/g, "-");
                        const isSelected = selectedStatus === joinedStatus;

                        return (
                          <button
                            key={index}
                            className={`m-2 bg-gray-100 ${isSelected && "bg-gray-800 text-white"} px-4 py-1 rounded-md text-sm font-sagoe text-gray-700 hover:bg-gray-800 hover:text-white`}
                            onClick={() => handleStatusChange(joinedStatus)}
                            style={{ order: isSelected ? 0 : 1 }}
                          >
                            <span>{status}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mr-2">
                    <span className="font-bold min-w-[55px]">Sort by</span>
                    <select value={sort} onChange={handleSortChange} className="px-2 py-1 my-2 bg-gray-100 rounded-md text-sm font-sagoe text-gray-700 hover:bg-gray-200">
                      {sortingOptions.map((option, index) => {
                        return (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              <div className="lg:hidden flex justify-between space-x-2">
                <div className="flex space-x-2 items-center">
                  <span className="font-bold ">Status</span>
                  <select value={selectedStatus} onChange={(e) => handleStatusChange(e.target.value)} className="block w-[120px] px-2 py-1 my-2 bg-gray-100 rounded-md text-sm font-sagoe text-gray-700 hover:bg-gray-200">
                    {orderStatus.map((status, index) => {
                      const joinedStatus = status.toLowerCase().replace(/\s/g, "-");
                      const isSelected = selectedStatus === joinedStatus;

                      return (
                        <option key={index} value={joinedStatus}>
                          {status}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="flex items-center gap-2 mr-2">
                  <span className="font-bold min-w-[55px]">Sort by</span>
                  <select value={sort} onChange={handleSortChange} className="px-2 py-1 my-2 bg-gray-100 rounded-md text-sm font-sagoe text-gray-700 hover:bg-gray-200">
                    {sortingOptions.map((option, index) => {
                      return (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div id="orderList" className="mt-4 flex flex-col overflow-y-auto space-y-4">
                {isLoading ? (
                  // Display the skeleton loading effect during the loading period
                  Array.from({ length: 5 }, (_, index) => (
                    <div key={index} className="border border-gray-200 rounded-md px-4 lg:px-4 py-4">
                      <div className="flex flex-row justify-between items-center">
                        <div className="w-[100px] lg:w-[200px]">
                          <Skeleton height={24} />
                        </div>
                        <div className="w-[100px] lg:w-[160px]">
                          <Skeleton height={24} />
                        </div>
                      </div>
                      <div className="mt-4 flex lg:flex-row  justify-between">
                        <div className="flex lg:flex-row flex-col justify-between w-full">
                          <div className="flex flex-col space-y-4 mb-4">
                            <div className="hidden lg:flex flex-1 flex-row justify-normal space-x-4 ">
                              <div className="w-[170px]">
                                <Skeleton height="200px" />
                              </div>
                              <div className="flex flex-1 flex-col text-sm space-y-2">
                                <div className="w-[250px] lg:w-[200px]">
                                  <Skeleton height={20} count={2} />
                                </div>
                                <div className="w-[250px] lg:w-[200px]">
                                  <Skeleton height={20} count={2} />
                                </div>
                              </div>
                            </div>
                            <div className="flex lg:hidden flex-1 flex-row justify-between space-x-6 ">
                              <div className="w-[100px]">
                                <Skeleton height="100px" />
                              </div>
                              <div className="flex flex-1 flex-col text-sm space-y-2">
                                <div className="w-[250px] lg:w-[200px]">
                                  <Skeleton height={20} count={2} />
                                </div>
                                <div className="w-[250px] lg:w-[200px]">
                                  <Skeleton height={20} count={2} />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="hidden lg:flex flex-col">
                            <div className="w-[50px] lg:w-[200px]">
                              <Skeleton height={18} count={5} />
                            </div>
                          </div>
                          <div className="flex lg:hidden flex-col">
                            <div className="w-[200px]">
                              <Skeleton height={18} count={4} />
                            </div>
                          </div>
                          <div className="flex lg:hidden flex-col">
                            <div className="w-[100px]">
                              <Skeleton height={18} count={1} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : orderLists.length > 0 ? (
                  orderLists.map((orderItem, index) => {
                    const createdAt = new Date(orderItem.createdAt);
                    const date = `${createdAt.getDate()} ${createdAt.toLocaleString("default", { month: "short" })} ${createdAt.getFullYear()}`;
                    const time = createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                    const remainingTime = remainingTimes[orderItem.orderId];

                    return (
                      <div key={index} className="border border-gray-200 rounded-md px-4 lg:px-4 py-4 lg:py-4 bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-4 items-center ">
                            <span className="bg-gray-900 text-gray-100 px-4 py-1 rounded-md  text-sm lg:text-md">{getStatusLabel(orderItem.status)}</span>
                            <div className={`${remainingTime && remainingTime.hours < 0 ? "text-red-500" : ""}`}>
                              <span className="font-bold text-sm">
                                {remainingTime ? `${formatTime(Math.max(remainingTime.hours, 0))}:${formatTime(Math.max(remainingTime.minutes, 0))}:${formatTime(Math.max(remainingTime.seconds, 0))}` : ""}
                              </span>
                            </div>
                            {orderItem.status === "unpaid" && (
                              <>
                                {remainingTime && remainingTime.hours > 0 && (
                                  <span onClick={() => handleOpenModalProof(orderItem.orderId, orderItem.paymentBy, orderItem.totalPrice)} className="hidden lg:block text-sm cursor-pointer font-semibold">
                                    Upload payment proof
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          <span className="text-gray-900 text-sm lg:text-md">
                            {date}, {time}
                          </span>
                        </div>
                        <div className={`mt-4 flex justify-between ${orderItem.status === "cancelled" ? "opacity-60" : ""}`}>
                          <div className="flex lg:flex-row flex-col justify-between w-full">
                            <div className="flex flex-col space-y-4 mb-4">
                              {orderItem.Products.slice(0, expandedOrders[index] ? orderItem.Products.length : 1).map((product, productIndex) => (
                                <div className="flex flex-1 flex-row justify-between lg:justify-normal lg:space-x-4 space-x-6 lg:space-y-0" key={productIndex}>
                                  <img
                                    src={`http://localhost:8000/public/${product.Product.productImages[0].imageUrl}`}
                                    loading="lazy"
                                    alt="product"
                                    className="w-[100px] lg:w-[170px] h-[100px] lg:h-[200px]  object-cover shadow-md rounded-md"
                                  />

                                  <div className="flex flex-1 flex-col text-sm">
                                    <span className="text-left">
                                      {product.Product.productName} ({product.Product.productGender})
                                    </span>
                                    <span className="mb-2 lg:text-sm lg:text-left">
                                      {product.quantity} x {formatToRupiah(product.Product.productPrice)}
                                    </span>
                                    <hr />
                                    <span className=" mt-2 text-sm lg:text-left">Total Price</span>
                                    <span className=" text-sm font-bold lg:text-left">{formatToRupiah(product.quantity * product.Product.productPrice)}</span>
                                  </div>
                                </div>
                              ))}
                              {orderItem.Products.length > 1 && (
                                <button onClick={() => toggleExpand(index)} className="text-blue-500 text-sm cursor-pointer focus:outline-none">
                                  {expandedOrders[index] ? `Show less` : `+${orderItem.Products.length - 1} Other${orderItem.Products.length > 2 ? "s" : ""}`}
                                </button>
                              )}
                            </div>
                            <div className="flex flex-col justify-between lg:justify-normal lg:space-y-1 w-full lg:w-[200px]">
                              <div className="flex flex-col">
                                <span className="font-bold text-md lg:text-xs">Shipping Information:</span>
                                <p className="text-sm lg:text-xs">
                                  {orderItem.Address.firstName} {orderItem.Address.lastName} ({orderItem.Address.phoneNumber}) <br />
                                  {orderItem.Address.street}, {orderItem.Address.subDistrict}, {orderItem.Address.district}, {orderItem.Address.city}, {orderItem.Address.province}
                                </p>
                                <span className="text-sm lg:text-xs font-bold">{orderItem.Shipment.name.charAt(0).toUpperCase() + orderItem.Shipment.name.slice(1)} Shipment</span>
                                <span className="text-sm lg:text-xs">
                                  Sent from: <b>{orderItem.Warehouse.name.replace(/Warehouse/g, "RAINS").replace(/warehouse/g, "RAINS")}</b>
                                </span>
                              </div>
                              <hr className="lg:mt-0 mt-2"/>
                              <div className="mt-2 lg:mt-0 flex flex-col">
                                <span className="text-sm lg:text-xs">
                                  Payment by: <b>{orderItem.paymentBy} </b>
                                </span>
                                <span className="text-sm lg:text-xs">Total quantity: {orderItem.totalQuantity}x</span>
                                <span className="text-sm lg:text-xs">Total prices: {formatToRupiah(orderItem.totalPrice - orderItem.Shipment.cost)} </span>
                                <span className="text-sm lg:text-xs">Shipment cost: {formatToRupiah(orderItem.Shipment.cost)} </span>
                                <hr className="lg:mt-0 mt-2" />
                                <span className="font-bold mt-1 lg:text-xs">Subtotal: {formatToRupiah(orderItem.totalPrice)} </span>
                                {orderItem.status === "unpaid" && (
                                  <div className="lg:hidden">
                                    {remainingTime && remainingTime.hours > 0 && (
                                      <Button mt={4} color="white" bgColor="gray.900" _hover={{ bgColor: "gray.700" }} size="xs" onClick={() => handleOpenModalProof(orderItem.orderId, orderItem.paymentBy, orderItem.totalPrice)}>
                                        Upload payment proof
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-center items-center py-2 mx-2 border border-gray-100 rounded-md">
                      <p className="text-xl font-bold font-sagoe">No data matches</p>
                    </div>
                  </div>
                )}
              </div>
              {totalPages > 1 && (
                <Box display="flex" justifyContent="right" gap={2} mt={4} textAlign="right" mr={4}>
                  <Flex alignItems={"center"} gap={2}>
                    <Text mr={2} fontWeight={"bold"}>
                      {" "}
                      Page{" "}
                    </Text>
                    <Box>
                      <Button
                        boxShadow="md"
                        key={1}
                        size="xs"
                        w="30px"
                        borderRadius="lg"
                        onClick={() => handlePageChange(1)}
                        variant={page === 1 ? "solid" : "solid"}
                        bgColor={page === 1 ? "gray.900" : "white"}
                        textColor={page === 1 ? "white" : "gray.900"}
                        _hover={{ bgColor: "gray.900", textColor: "white" }}
                        mr="5px"
                        transition={"ease-in-out 0.3s"}
                      >
                        1
                      </Button>
                      {totalPages > 1 &&
                        Array.from({ length: totalPages - 1 }, (_, index) => (
                          <Button
                            boxShadow="md"
                            key={index + 2}
                            size="xs"
                            w="30px"
                            borderRadius="lg"
                            onClick={() => handlePageChange(index + 2)}
                            variant={page === index + 2 ? "solid" : "solid"}
                            bgColor={page === index + 2 ? "gray.900" : "gray.white"}
                            textColor={page === index + 2 ? "white" : "gray.900"}
                            _hover={{ bgColor: "gray.900", textColor: "white" }}
                            mr="5px"
                            transition={"ease-in-out 0.3s"}
                          >
                            {index + 2}
                          </Button>
                        ))}
                    </Box>
                  </Flex>
                </Box>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-xl font-bold">You are not logged in</p>
            </div>
          )}
        </div>
      </div>
      <PaymentProofModal isOpen={openModalProof} onClose={() => setOpenModalProof(false)} orderId={selectedOrder} paymentBy={selectedPaymentProof} totalPrice={selectedTotalPrice} />
    </>
  );
};
