import { Link, useNavigate } from "react-router-dom";
import { NavPage } from "../components/NavPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { showLoginModal } from "../slices/authModalSlices";
import api from "../api";
import { toast } from "sonner";

export const Order = () => {
  const isLogin = useSelector((state) => state?.account?.isLogin);
  const listsMenu = ["Profile", "Address Book", "My Order", "Change Password"];
  const orderStatus = ["All", "Waiting for Payment", "Waiting for Payment Confirmation", "On Process", "On Delivery", "Delivered", "Cancelled"];
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [orderLists, setOrderLists] = useState([]);
  const [page, setPage] = useState(1);
  const size = 10;
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("DESC");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!isLogin) {
    setTimeout(() => {
      navigate("/");
      dispatch(showLoginModal());
    }, 2000);
  }
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  useEffect(() => {
    const getOrderLists = async () => {
      try {
        const response = await api.get(`/order?status=${selectedStatus}&page=${Number(page)}&size=${Number(size)}&sort=${sort}&order=${order}`);
        const orderLists = response.data.detail;
        setOrderLists(orderLists);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.error(error.response.data.message);
        } else if (error.response && error.response.status === 500) {
          console.error(error.response.data.detail);
          toast.error(error.response.data.message);
        }
      }
    };
    getOrderLists();
  }, [selectedStatus, page, size, sort, order]);

  return (
    <>
      <NavPage pageName={"Order"} />
      <div className="flex justify-center font-sagoe">
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

        <div className="w-full min-h-[72.5vh] lg:w-[53vw] overflow-y-hidden shadow-md">
          {isLogin ? (
            <div className="p-3">
              <div id="orderStatus" className="hidden sm:flex flex-col flex-wrap overflow-x-auto">
                <p className="font-bold">Status</p>
                <div>
                  {orderStatus.map((status, index) => {
                    const isSelected = selectedStatus === status;

                    return (
                      <button key={index} className={`m-2 bg-gray-100 ${isSelected && "bg-gray-200"} px-2 py-1 min-w-[5vw] rounded-md text-sm font-sagoe text-gray-700 hover:bg-gray-200`} onClick={() => handleStatusChange(status)}>
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="font-bold sm:hidden">Status</p>
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="block sm:hidden px-2 py-1 my-2 bg-gray-100 rounded-md text-sm font-sagoe text-gray-700 hover:bg-gray-200">
                  {orderStatus.map((status, index) => {
                    return (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex flex-wrap w-full">
                <div className="flex items-center gap-2 mr-2">
                  <p className="font-bold min-w-[55px]">Sort by</p>
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-2 py-1 my-2 bg-gray-100 rounded-md text-sm font-sagoe text-gray-700 hover:bg-gray-200">
                    <option value="createdAt">Date</option>
                    <option value="totalPrice">Total Price</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <p className="font-bold min-w-[55px]">Order</p>
                  <select value={order} onChange={(e) => setOrder(e.target.value)} className="px-2 py-1 my-2 bg-gray-100 rounded-md text-sm font-sagoe text-gray-700 hover:bg-gray-200">
                    <option value="DESC">High to Low</option>
                    <option value="ASC">Low to High</option>
                  </select>
                </div>
              </div>

              <div id="orderList" className="overflow-y-auto gap-2">
                {orderLists.length > 0 ? (
                  orderLists.map((orderItem, index) => {
                    const createdAt = new Date(orderItem.createdAt);

                    const date = createdAt.toLocaleDateString();
                    const time = createdAt.toLocaleTimeString();
                    return (
                        <div key={index} className="border border-gray-200 rounded-md p-2 my-2">
                          <div className="flex justify-between h-[5vh]">
                            <p>{orderItem.Order.status}</p>
                            <p>
                              {date}, {time}
                            </p>
                          </div>

                          <div className="flex justify-between">
                            <div className="flex">
                              <img src={orderItem.Product.image} alt={orderItem.Product.name} className="w-[30vw] h-[20vh] lg:w-[10vw] lg:h-[20vh] object-cover rounded-md" />
                              <div className="flex justify-between w-full items-center ml-2">
                                <div className="w-[25vw] lg:w-[20vw]">
                                  <p className="font-bold">{orderItem.Product.name}</p>
                                  <p>Quantity: {orderItem.quantity}</p>
                                </div>
                                <p>
                                  <span className="font-bold">Total:</span> Rp{orderItem.Order.totalPrice}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                    );
                  })
                ) : (
                  <div className="flex justify-center items-center h-full py-2 mx-2 border border-gray-100 rounded-md">
                    <p className="text-xl font-bold font-sagoe">You have no order yet</p>
                  </div>
                )}
              </div>
              <div className={`${orderLists.length > 0 ? "flex" : "hidden"} justify-between`}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-2 py-1 my-2 bg-gray-100 rounded-md text-sm font-sagoe text-gray-700 hover:bg-gray-200">
                  Prev
                </button>
                <button disabled={orderLists.length < size} onClick={() => setPage(page + 1)} className="px-2 py-1 my-2 bg-gray-100 rounded-md text-sm font-sagoe text-gray-700 hover:bg-gray-200">
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-xl font-bold">You are not logged in</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
