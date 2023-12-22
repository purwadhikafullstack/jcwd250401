import React, { useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { PiChartLine, PiHouse, PiPackage, PiReceipt, PiUserRectangle, PiUsersThree, PiWarehouse } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import rains from "../assets/rains.png";

const menuList = [
  {
    name: "Dashboard",
    icon: <PiHouse size={24} />,
    link: "/dashboard",
  },
  {
    name: "Products",
    icon: <PiPackage size={24} />,
    link: "/dashboard/products",
  },
  {
    name: "Warehouse",
    icon: <PiWarehouse size={24} />,
    link: "/dashboard/warehouse",
  },
  {
    name: "Customers",
    icon: <PiUsersThree size={24} />,
    link: "/dashboard/customers",
  },
  {
    name: "Staff",
    icon: <PiUserRectangle size={24} />,
    link: "/dashboard/staff",
  },
  {
    name: "Order",
    icon: <PiReceipt size={24} />,
    link: "/dashboard/order/customers" || "/dashboard/order/warehouse",
    subItems: [
      {
        name: "Customers",
        link: "/dashboard/order/customers",
      },
      {
        name: "Warehouse",
        link: "/dashboard/order/warehouse",
      },
    ],
  },
  {
    name: "Report",
    icon: <PiChartLine size={24} />,
    link: "/dashboard/report/sales" || "/dashboard/report/stock",
    subItems: [
      {
        name: "Sales",
        link: "/dashboard/report/sales",
      },
      {
        name: "Stock",
        link: "/dashboard/report/stock",
      },
    ],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isExpanded, setIsExpanded] = useState(Array(menuList.length).fill(false));
  const location = useLocation();
  const isWarehouseAdminAcc = useSelector((state) => state?.account?.adminProfile?.data?.profile?.isWarehouseAdmin);

  const handleAccordionClick = (index) => {
    // If the clicked accordion is already open, close it
    if (activeMenu === index && isExpanded[index]) {
      setActiveMenu(null);
      setIsExpanded(Array(menuList.length).fill(false));
    } else {
      // Otherwise, open the clicked accordion and close others
      setActiveMenu(index);
      const newIsExpanded = Array(menuList.length).fill(false);
      newIsExpanded[index] = true;
      setIsExpanded(newIsExpanded);
    }
  };

  const segments = location.pathname;

  return (
    <>
      <div className="w-[16vw] bg-black h-screen hidden lg:block">
        <div className="flex justify-center flex-col">
          <div className="flex justify-center mt-6 mb-10">
            <img src={rains} alt="logo" className="w-[40%] invert"></img>
          </div>
          <div>
            {menuList.map((item, index) => (
              <div key={index}>
                {/* Add a condition to check if the item should be rendered */}
                {(!isWarehouseAdminAcc || (item.name !== "Customers" && item.name !== "Staff" && item.name !== "Warehouse")) && (
                  <>
                    {item.subItems ? (
                      <div
                        onClick={() => handleAccordionClick(index)}
                        className={`flex items-center justify-start text-white hover:text-black hover:bg-white px-4 py-2 rounded mb-2 mx-2 cursor-pointer gap-2 ${segments === item.link ? "!text-black bg-white" : ""}`}
                      >
                        <div className="mr-6 ">{item.icon}</div>
                        <div className="">{item.name}</div>
                        <div className="ml-auto">{isExpanded[index] ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}</div>
                      </div>
                    ) : (
                      <Link key={index} to={item.link} className={`flex items-center justify-start text-white hover:text-black hover:bg-white px-4 py-2 rounded mb-2 mx-2 ${segments === item.link ? "!text-black bg-white" : ""}`}>
                        <div className="mr-8">{item.icon}</div>
                        {item.name}
                      </Link>
                    )}

                    {item.subItems && activeMenu === index && (
                      <div className="ml-6">
                        {item.subItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.link}
                            className={`flex items-center justify-start text-white hover:text-black hover:bg-white px-4 py-2 rounded mb-2 mx-2 ${segments === subItem.link ? "!text-black bg-white" : ""}`}
                          >
                            <div className="mr-8 ml-2">{subItem.icon}</div>
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile */}

      <div className="w-[18vw] bg-black h-screen lg:hidden">
        <div className="flex justify-center flex-col">
          <div className="flex justify-center mt-8 mb-10">
            <img src={rains} alt="logo" className="w-[70%] invert"></img>
          </div>
          <div>
            {menuList.map((item, index) => (
              <div key={index}>
                {/* Add a condition to check if the item should be rendered */}
                {(!isWarehouseAdminAcc || (item.name !== "Customers" && item.name !== "Staff")) && (
                  <>
                    {item.subItems ? (
                      <div
                        onClick={() => handleAccordionClick(index)}
                        className={`flex items-center justify-center text-white hover:text-black hover:bg-white px-2 py-2 rounded mb-2 mx-2 cursor-pointer flex-col  ${segments === item.link ? "!text-black bg-white" : ""}`}
                      >
                        <div className="">{item.icon}</div>
                        <div className="">{isExpanded[index] ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}</div>
                      </div>
                    ) : (
                      <Link key={index} to={item.link} className={`flex items-center justify-center text-white hover:text-black hover:bg-white px-4 py-2 rounded mb-2 mx-2 ${segments === item.link ? "!text-black bg-white" : ""}`}>
                        <div className="">{item.icon}</div>
                      </Link>
                    )}

                    {item.subItems && activeMenu === index && (
                      <div className="">
                        {item.subItems.map((subItem, subIndex) => (
                          <Link key={subIndex} to={subItem.link} className={`flex items-center justify-center text-white hover:text-black hover:bg-white px-2 py-2 rounded mb-2  ${segments === subItem.link ? "!text-black bg-white" : ""}`}>
                            <div className="">{subItem.icon}</div>
                            <span className="text-xs">{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
