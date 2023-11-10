import React, { useState } from "react";
import { FiSettings, FiHome, FiTrendingUp, FiChevronUp, FiChevronsDown, FiChevronDown } from "react-icons/fi";
import { BiMessageSquareAdd, BiSolidFoodMenu } from "react-icons/bi";
import { FaFileInvoiceDollar } from "react-icons/fa";
import {PiChartLine, PiChartLineBold, PiHouse, PiHouseBold, PiPackage, PiPackageBold, PiReceipt, PiReceiptBold, PiUserRectangle, PiUserRectangleBold, PiUsersThree, PiUsersThreeBold, PiWarehouse, PiWarehouseBold } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdFastfood } from "react-icons/md";
import { logout } from "../slices/accountSlices";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { updatePhotoProfile } from "../slices/accountSlices";
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

  const segments = location.pathname.split("/");
  const currentPage = segments[segments.length - 1];

  return (
    <div className="w-[20vw] bg-black h-screen">
      <div className="flex justify-center flex-col">
        <div className="flex justify-center mt-6 mb-10">
          <img src={rains} alt="logo" className="w-[40%] invert"></img>
        </div>
        <div>
          {menuList.map((item, index) => (
            <div key={index}>
              {item.subItems ? (
                <div
                  onClick={() => handleAccordionClick(index)}
                  className={`flex items-center justify-start text-white hover:text-black hover:bg-white px-4 py-2 rounded mb-2 mx-2 cursor-pointer gap-2 ${currentPage === item.name.toLowerCase() ? "!text-black bg-white" : ""}`}
                >
                  <div className="mr-6 ">{item.icon}</div>
                  <div className="">{item.name}</div>
                  <div className="ml-auto">{isExpanded[index] ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}</div>
                </div>
              ) : (
                <Link
                  key={index}
                  to={item.link}
                  className={`flex items-center justify-start text-white hover:text-black hover:bg-white px-4 py-2 rounded mb-2 mx-2 ${currentPage === item.name.toLowerCase() ? "!text-black bg-white" : ""}`}
                >
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
                      className={`flex items-center justify-start text-white hover:text-black hover:bg-white px-4 py-2 rounded mb-2 mx-2 ${currentPage === subItem.name.toLowerCase() ? "!text-black bg-white" : ""}`}
                    >
                      <div className="mr-8 ml-2">{subItem.icon}</div>
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
