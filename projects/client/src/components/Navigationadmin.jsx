import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "flowbite-react";
import rains from "../assets/rains.png";
import AuthModal from "./AuthModal";
import { useSelector, useDispatch } from "react-redux";
import { showLoginModal, showSignUpModal } from "../slices/authModalSlices";
import { logoutAdmin } from "../slices/accountSlices";
import { getAuth, signOut } from "firebase/auth"; // Import Firebase authentication functions
import api from "../api";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { PiBell, PiMagnifyingGlass } from "react-icons/pi";
import { useEffect } from "react";
import { setIsWarehouseAdmin } from "../slices/accountSlices";

function Navigationadmin() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const dispatch = useDispatch();
  const adminProfile = JSON.parse(localStorage.getItem("adminProfile"));
  const username = adminProfile?.data?.profile?.username;
  const isLoggedInAdmin = JSON.parse(localStorage.getItem("isLoggedInAdmin"));
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (isLoggedInAdmin) {
          const response = await api.get(`/profile/admin/${username}`);
          const userDetail = response.data.detail;
          setUserData(userDetail);

          if (userDetail[0].isWarehouseAdmin === true) {
            dispatch(setIsWarehouseAdmin(true));
          } else if (userDetail[0].isWarehouseAdmin === false) {
            dispatch(setIsWarehouseAdmin(false));
          }
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          setTimeout(() => {
            toast.error(error.response.data.message, {
              autoClose: 1000,
              onAutoClose: (t) => {
                dispatch(logoutAdmin());
                navigate("/adminlogin");
              },
            });
          }, 600);
        } else if (error?.response?.status === 403) {
          setTimeout(() => {
            toast.error(error.response.data.message, {
              autoClose: 1000,
              onAutoClose: (t) => {
                dispatch(logoutAdmin());
                navigate("/adminlogin");
              },
            });
          }, 600);
        } else if (error.request) {
          // Handle request errors
          setTimeout(() => {
            toast.error("Network error, please try again later");
          }, 2000);
        }
      }
    };
    getUserData();
  }, []);

  const handleIconClick = () => setDropdownVisible(!dropdownVisible);
  const handleLogout = () => {
    try {
      navigate("/adminlogin");
      dispatch(logoutAdmin());
      setDropdownVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Extract the last segment from the location
  const segments = location.pathname.split("/");
  const currentPage = segments[segments.length - 1];

  // Capitalize the first letter of currentPage
  const formattedCurrentPage = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  return (
    <div className="flex justify-between items-center px-4 py-4 h-20 w-full">
      <div className="text-2xl font-bold font-sagoe ml-4">{formattedCurrentPage}</div>
      <div className="hidden gap-4 lg:flex items-center mr-6">
        <PiMagnifyingGlass className="text-2xl cursor-pointer" />
        <PiBell className="text-2xl cursor-pointer" />
        {userData?.map((data) => (
          <div key={data.id} className="flex items-center gap-4">
            <img src={data.photoProfile ? `http://localhost:8000/public/${data.photoProfile}` : "https://via.placeholder.com/150"} alt="Profile" className="w-6 h-6 rounded-full cursor-pointer" onClick={handleIconClick} />
            {dropdownVisible && (
              <div className="absolute top-16 right-8 w-40 h-10 bg-white ring-1 ring-black ring-opacity-5 z-10" onMouseLeave={() => setDropdownVisible(false)}>
                <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                  Log Out
                </p>
              </div>
            )}
            <span className="text-gray-700 text-sm font-medium">{data.isWarehouseAdmin ? "Warehouse Admin" : "Super Admin"}</span>
          </div>
        ))}

        {/* Mobile */}
        <div className="flex lg:hidden gap-3 z-10">
          {/* Category sm */}
          <GiHamburgerMenu className="text-xl cursor-pointer flex lg:hidden" onClick={handleIconClick} />
          {dropdownVisible && (
            <div className="w-[50vw]">
              <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" role="menuitem" onClick={handleLogout}>
                Log Out
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navigationadmin;
