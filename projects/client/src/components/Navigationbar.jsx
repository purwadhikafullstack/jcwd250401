import React, { useState } from "react";
import { BsCart, BsSearch, BsPersonCircle } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiOutlineArrowRight } from "react-icons/hi";
import { MdFavoriteBorder } from "react-icons/md";
import { Button } from "flowbite-react";
import rains from "../assets/rains.png";
import AuthModal from "./AuthModal";
import { useSelector, useDispatch } from "react-redux";
import { showLoginModal, showSignUpModal } from "../slices/authModalSlices";
import { logout } from "../slices/accountSlices";
import { getAuth, signOut } from "firebase/auth"; // Import Firebase authentication functions

function Navigationbar() {
  const isLogin = useSelector((state) => state.account.isLogin);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const categories = ["NEW IN", "MEN", "WOMEN", "BAGS", "ACCESSORIES"];
  const accounts = ["Profile", "Address Book", "My Order", "Change My Password"];
  const accountsDropdown = ["Profile", "Address Book", "My Order", "Change My Password", "Search", "Cart", "Favorites"];
  const dispatch = useDispatch();
  const auth = getAuth(); // Initialize Firebase authentication

  const openAuthModal = () => {
    dispatch(showLoginModal());
  };

  const openSignUpModal = () => {
    dispatch(showSignUpModal());
  }

  const handleIconClick = () => setDropdownVisible(!dropdownVisible);

  const handleLogout = () => {
    signOut(auth) // Sign out the user from Firebase
      .then(() => {
        setDropdownVisible(false);
        dispatch(logout()); // Dispatch the Redux logout action
      })
      .catch((error) => {
        // Handle any sign-out errors
        console.error("Error signing out:", error);
      });
  };

  return (
    <div className="w-full bg-white h-20 flex items-center justify-around">
      <div className="flex items-center gap-16">
        <img src={rains} alt="Logo" className="w-26 h-10" />
        <div className="hidden space-x-4 lg:flex">
          {categories.map((category, index) => {
            const joinedCategories = categories.map((category) => category.toLowerCase().replace(" ", "-")).join(" ");
            return (
              <a key={index} href={`/${joinedCategories}`} className="text-black text-md font-semibold hover:underline">
                {category}
              </a>
            );
          })}
        </div>
      </div>
      {isLogin ? (
        <>
          <div className="hidden gap-8 lg:flex items-center">
            <BsSearch className="text-xl cursor-pointer" />
            <img
              src="https://images.unsplash.com/photo-1556294778-037d36802a75?auto=format&fit=crop&q=80&w=1527&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Profile"
              className="w-6 h-6 rounded-full cursor-pointer"
              onClick={handleIconClick}
            />
            {dropdownVisible && (
              <div className="absolute top-16 w-48 h-48 bg-white ring-1 ring-black ring-opacity-5 z-10">
                {accounts.map((account, index) => {
                  const joinedAccounts = account.toLowerCase().replace(" ", "-");
                  return (
                    <a key={index} href={`/account/${joinedAccounts}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      {account}
                    </a>
                  );
                })}
                <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" role="menuitem" onClick={handleLogout}>
                  Log Out
                </p>
              </div>
            )}

            <MdFavoriteBorder className="text-xl cursor-pointer" />
            <BsCart className="text-xl cursor-pointer" />
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden gap-3 z-10">
            {/* Category sm */}
            <GiHamburgerMenu className="text-xl cursor-pointer flex lg:hidden" onClick={handleIconClick} />
            {dropdownVisible && (
              <div className="absolute top-20 w-full h-70 bg-white ring-1 ring-black ring-opacity-5 right-0 lg:hidden">
                {/* Categories sm */}
                <div className="flex flex-row">
                  <div className="w-[50vw]">
                    {categories.map((category, index) => {
                      const joinedCategories = category.toLowerCase().replace(" ", "-");
                      return (
                        <a key={index} href={`/${joinedCategories}`}>
                          <p className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm">{category}</p>
                        </a>
                      );
                    })}
                  </div>
                  {/* Profile sm */}
                  <div className="w-[50vw]">
                    {accountsDropdown.map((account, index) => {
                      const joinedAccounts = account.toLowerCase().replace(" ", "-");
                      return (
                        <a key={index} href={`/${joinedAccounts}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                          {account}
                        </a>
                      );
                    })}
                    <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" role="menuitem" onClick={handleLogout}>
                      Log Out
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center gap-4">
          <a onClick={openAuthModal} className="text-black text-md font-semibold hover:underline cursor-pointer">
            Log in
          </a>
          <Button pill className="cursor-pointer bg-[#40403F] enabled:hover:bg-[#777777]"
          onClick={openSignUpModal}>
            <span className="text-white text-md font-semibold">Sign Up</span>
            <HiOutlineArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}
      <AuthModal />
    </div>
  );
}

export default Navigationbar;
