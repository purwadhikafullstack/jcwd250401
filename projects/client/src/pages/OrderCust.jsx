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
import OrderList from "../components/OrderList";

function OrderCust() {
  const navList = ["All Orders", "New Orders", "Ready to Ship", "On Delivery", "Completed", "Cancelled"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"];
  const [selectedComponent, setSelectedComponent] = useState("All Orders");
  const [warehouses, setWarehouses] = useState([]);
  const [sort, setSort] = useState("allW");
  const [order, setOrder] = useState("allM");
  const [pillWidth, setPillWidth] = useState(0); // State to store the width of the pill
  const handleSelectComponent = (nav) => setSelectedComponent(nav);
  const navRefs = useRef([]); // Refs to store references to each navigation item
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isWarehouseAdmin = useSelector((state) => state?.account?.isWarehouseAdmin);

  const fetchWarehouses = async () => {
    try {
      const { data } = await getWarehouses();
      setWarehouses(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

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
        <div className="flex flex-col mt-16 py-8 px-4 md:p-8">
            <div className="flex justify-end items-center gap-4">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-white text-[#40403F] py-2 px-10 rounded-md cursor-pointer focus:ring-0 focus:border-none">
              <option value={"allW"} defaultChecked>
                All Warehouses
              </option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>

            <select value={order} onChange={(e) => setOrder(e.target.value)} className="bg-white text-[#40403F] py-2 px-12 rounded-md cursor-pointer focus:ring-0 focus:border-none">
              <option value={"allM"} defaultChecked>
                All Months
              </option>
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
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
            {selectedComponent === "All Orders" && <OrderList />}
            {selectedComponent === "New Orders"}
            {selectedComponent === "Ready to Ship"}
            {selectedComponent === "On Delivery"}
            {selectedComponent === "Completed"}
            {selectedComponent === "Cancelled"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCust;