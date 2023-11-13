import { Link } from "react-router-dom";
import { NavPage } from "../components/NavPage";
import { useSelector } from "react-redux";
import { useState } from "react";

export const Order = () => {
  const isLogin = useSelector((state) => state?.account?.isLogin);
  const listsMenu = ["Profile", "Address Book", "My Order", "Change Password"];
  const orderStatus = ["All", "Waiting for Payment", "On Process", "On Delivery", "Delivered", "Cancelled"];
  const [selectedStatus, setSelectedStatus] = useState("All");
  //   const [orderList, setOrderList] = useState([]);
  const dummyOrderList = [
    {
      id: 1,
      status: "Waiting for Payment",
      orderDate: "2021-10-01",
      orderTime: "10:00",
      itemName: "Baju",
      itemPrice: 100000,
      itemQuantity: 1,
      image: "https://via.placeholder.com/350x150",
    },
    {
      id: 2,
      status: "On Process",
      orderDate: "2021-10-01",
      orderTime: "10:00",
      itemName: "Baju",
      itemPrice: 100000,
      itemQuantity: 1,
      image: "https://via.placeholder.com/350x150",
    },
    {
      id: 3,
      status: "On Delivery",
      orderDate: "2021-10-01",
      orderTime: "10:00",
      itemName: "Baju",
      itemPrice: 100000,
      itemQuantity: 1,
      image: "https://via.placeholder.com/350x150",
    },
    {
      id: 4,
      status: "Delivered",
      orderDate: "2021-10-01",
      orderTime: "10:00",
      itemName: "Baju",
      itemPrice: 100000,
      itemQuantity: 1,
      image: "https://via.placeholder.com/350x150",
    },
    {
      id: 5,
      status: "Cancelled",
      orderDate: "2021-10-01",
      orderTime: "10:00",
      itemName: "Baju",
      itemPrice: 100000,
      itemQuantity: 1,
      image: "https://via.placeholder.com/350x150",
    },
  ];
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

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

        <div className="w-full min-h-[71vh] lg:w-[53vw] overflow-y-hidden shadow-md">
          {isLogin ? (
            <div className="p-3">
              <div id="orderStatus" className="flex flex-col flex-wrap overflow-x-auto">
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

              <div id="orderList">
                {dummyOrderList
                  .filter((order) => order.status === selectedStatus || selectedStatus === "All")
                  .map((order, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-2 my-2">
                      <div className="flex justify-between h-[5vh]">
                        <p>{order.status}</p>
                        <p>{order.orderDate}, {order.orderTime}</p>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex">
                          <img src={order.image} alt={order.itemName} className="w-[30vw] h-[20vh] lg:w-[10vw] lg:h-[20vh] object-cover rounded-md" />
                          <div className="flex justify-between w-full items-center ml-2">
                            <div className="w-[25vw] lg:w-[20vw]">
                              <p className="font-bold">{order.itemName}</p>
                              <p>Quantity: {order.itemQuantity}</p>
                            </div>
                            <p><span className="font-bold">Total:</span> Rp{order.itemPrice}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
