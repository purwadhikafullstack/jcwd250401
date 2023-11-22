import { Link, useNavigate } from "react-router-dom";
import { NavPage } from "../components/NavPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { showLoginModal } from "../slices/authModalSlices";
import api from "../api";
import { toast } from "sonner";
import { PaymentProofModal } from "./PaymentProofModal";

export const Order = () => {
  const isLogin = useSelector((state) => state?.account?.isLogin);
  const userName = useSelector((state) => state?.account?.profile?.data?.profile?.username);
  const listsMenu = ["Profile", "Address Book", "My Order", "Change Password"];
  const orderStatus = ["All", "Waiting for Payment", "Waiting for Payment Confirmation", "On Process", "On Delivery", "Delivered", "Cancelled"];
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModalProof, setOpenModalProof] = useState(false);
  const [orderLists, setOrderLists] = useState([]);
  const [page, setPage] = useState(1);
  const size = 5;
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("DESC");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleStatusChange = (status) => setSelectedStatus(status);
  // const handleOpenModalProof = (orderId) => {
  //   setSelectedOrder(orderId);
  //   setOpenModalProof(true);
  // };

  useEffect(() => {
    const getOrderLists = async (userId) => {
      try {
        const response = await api.get(`/order/${userId}?status=${selectedStatus}&page=${Number(page)}&size=${Number(size)}&sort=${sort}&order=${order}`);
        setOrderLists(response.data.detail);
      } catch (error) {
        if (error.response && (error.response.status === 404 || error.response.status === 401 || error.response.status === 403 || error.response.status === 500)) {
          toast.error(error.response.data.message);
          setOrderLists([]);
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            setTimeout(() => {
              navigate("/");
              dispatch(showLoginModal());
            }, 2000);
          }
          if (error.response.status === 500) console.error(error.response.data.detail);
        }
      }
    };
    const getUserData = async () => {
      try {
        const response = await api.get(`/profile/${userName}`);

        getOrderLists(response.data.detail.id);
      } catch (error) {
        if (error.response && (error.response.status === 404 || error.response.status === 401 || error.response.status === 403 || error.response.status === 500)) {
          toast.error(error.response.data.message);
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            setTimeout(() => {
              navigate("/");
              dispatch(showLoginModal());
            }, 2000);
          }
          if (error.response.status === 500) console.error(error.response.data.detail);
        }
      }
    };
    getUserData();
  }, [userName, selectedStatus, page, size, sort, order]);

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
                    const joinedStatus = status.toLowerCase().replace(/\s/g, "-");
                    const isSelected = selectedStatus === joinedStatus;

                    return (
                      <button key={index} className={`m-2 bg-gray-100 ${isSelected && "bg-gray-200"} px-2 py-1 min-w-[5vw] rounded-md text-sm font-sagoe text-gray-700 hover:bg-gray-200`} onClick={() => handleStatusChange(joinedStatus)}>
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
                            <img src={`http://localhost:8000/public/${orderItem.Product.productImages[0].imageUrl}`} alt={orderItem.Product.name} className="w-[30vw] h-[20vh] lg:w-[10vw] lg:h-[20vh] object-cover rounded-md" />
                            <div className="flex justify-between w-full items-center ml-2">
                              <div className="w-[25vw] lg:w-[20vw]">
                                <p className="font-bold">{orderItem.Product.productName}</p>
                                <p>Quantity: {orderItem.quantity}</p>
                              </div>
                              <p>
                                <span className="font-bold">Total:</span> Rp{orderItem.Order.totalPrice}
                              </p>
                            </div>
                          </div>
                          {/* <button onClick={() => handleOpenModalProof(orderItem.Order.id)} className="px-2 py-1 bg-gray-100 rounded-md text-sm font-sagoe text-gray-700 hover:bg-gray-200 w-full h-[5vh] self-end">
                            Upload Payment Proof
                          </button> */}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex justify-center items-center h-full py-2 mx-2 border border-gray-100 rounded-md">
                    <p className="text-xl font-bold font-sagoe">No data matches</p>
                  </div>
                )}
              </div>
              <div className={`flex justify-between`}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-2 py-1 my-2 bg-gray-100 rounded-md text-sm font-sagoe text-gray-700 hover:bg-gray-200">
                  Prev
                </button>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{page}</span>
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
      {/* <PaymentProofModal isOpen={openModalProof} onClose={() => setOpenModalProof(false)} orderId={selectedOrder} /> */}
    </>
  );
};
