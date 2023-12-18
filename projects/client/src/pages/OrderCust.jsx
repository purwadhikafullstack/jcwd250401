import Sidebar from "../components/Sidebar";
import Navigationadmin from "../components/Navigationadmin";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { logoutAdmin } from "../slices/accountSlices";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import getWarehouses from "../api/warehouse/getWarehouses";
import getAllOrders from "../api/order/getAllOrder";
import getSingleAdmin from "../api/users/getSingleAdmin";
import getWarehouseByAdmin from "../api/warehouse/getWarehouseByAdmin";
import OrderList from "../components/OrderList";
import OrderReadyToShip from "../components/OrderReadyToShip";
import OrderShipped from "../components/OrderShipped";

function OrderCust() {
  const navList = ["All Orders", "New Orders", "Ready to Ship", "Completed", "Cancelled"];
  const months = [
    { name: "January", number: 1 },
    { name: "February", number: 2 },
    { name: "March", number: 3 },
    { name: "April", number: 4 },
    { name: "May", number: 5 },
    { name: "June", number: 6 },
    { name: "July", number: 7 },
    { name: "August", number: 8 },
    { name: "September", number: 9 },
    { name: "October", number: 10 },
    { name: "November", number: 11 },
    { name: "December", number: 12 }
  ];
  const [selectedComponent, setSelectedComponent] = useState("All Orders");
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [warehouseId, setWarehouseId] = useState('');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [orders, setOrders] = useState([]);
  const [pillWidth, setPillWidth] = useState(0); // State to store the width of the pill
  const handleSelectComponent = (nav) => setSelectedComponent(nav);
  const navRefs = useRef([]); // Refs to store references to each navigation item
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isWarehouseAdmin = useSelector((state) => state?.account?.isWarehouseAdmin);
  const adminData = useSelector((state) => state?.account?.adminProfile?.data?.profile);

  const fetchOrders = () => {
    getAllOrders({ month: selectedMonth, warehouseId: selectedWarehouseId })
      .then(response => {
        if (response.ok) {
          setOrders(response.detail);
        } else if (response.status === 404) {
          // Handle 404 specifically
          setOrders([]); // Set orders to an empty array
          console.log("No orders found.");
        }
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        if (error.response && error.response.status === 404) {
          setOrders([]); // Set orders to an empty array for 404 errors
        }
        // Handle other errors as needed
      });
  };  

  const fetchWarehouses = async () => {
    try {
      const { data } = await getWarehouses();
      setWarehouses(data);
    } catch (error) {
      console.log(error);
    }
  };

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
          setWarehouses([response2.detail]);
          setSelectedWarehouseId(warehouseIdFromResponse);
          fetchOrders();
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

  const handleWarehouseChange = (e) => {
    setSelectedWarehouseId(e.target.value);
  }

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  }

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (isWarehouseAdmin) {
      fetchAdminWarehouseData();
    } else {
      fetchOrders();
    }
  }, [selectedMonth, selectedWarehouseId]);

  useEffect(() => {
    // Calculate the width of the selected navigation item
    if (navRefs[selectedComponent]) {
      setPillWidth(navRefs[selectedComponent].offsetWidth);
    }
  }, [selectedComponent]);

  return (
    <div className="flex flex-row justify-between h-screen">
      <Sidebar />
      <div className="w-[82vw] lg:w-[84vw] bg-[#f0f0f0] overflow-y-auto scrollbar-hide flex flex-col">
        <div className="shadow-md fixed top-0 left-[18vw] lg:left-[16vw] right-0 z-50 bg-white">
          <Navigationadmin />
        </div>
        <div className="flex flex-col mt-16 py-8 px-4 md:p-8">
          <div className="flex flex-row justify-end items-center gap-4 w-[80vw] md:w-[100%] ">
            <select value={selectedWarehouseId} onChange={handleWarehouseChange} className="bg-white text-[#40403F] py-2 px-10 rounded-md cursor-pointer focus:ring-0 focus:border-none">
              {isWarehouseAdmin ? (
                <>
                  <option value={selectedWarehouseId} defaultChecked>
                    {warehouses[0]?.name}
                  </option>
                </>
              ) : (
                <>
                  <option value={""} defaultChecked>
                    All Warehouses
                  </option>
                  {warehouses.map((warehouse, index) => (
                    <option key={index} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </>
              )}
            </select>

            <select value={selectedMonth} onChange={handleMonthChange} className="bg-white text-[#40403F] py-2 px-12 rounded-md cursor-pointer focus:ring-0 focus:border-none">
              <option value={""} defaultChecked>
                All Months
              </option>
              {months.map((month, index) => (
                <option key={index} value={month.number}>
                  {month.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center p-2 md:p-4 mt-4 bg-white rounded-lg shadow-sm">
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
          <div className="flex items-center mt-4">
            {selectedComponent === "All Orders" && <OrderList orders={orders} fetchOrders={fetchOrders}/>}
            {selectedComponent === "New Orders"}
            {selectedComponent === "Ready to Ship" && <OrderReadyToShip orders={orders} fetchOrders={fetchOrders}/>}
            {selectedComponent === "Completed" && <OrderShipped orders={orders} fetchOrders={fetchOrders}/>}
            {selectedComponent === "Cancelled"}
          </div>
          </div>
      </div>
    </div>
  );
}

export default OrderCust;