import React, { useEffect, useRef, useState } from "react";
import { BsCart, BsSearch } from "react-icons/bs";
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
import api from "../api";
import { toast } from "sonner";

function Navigationbar() {
  const isLogin = useSelector((state) => state.account.isLogin);
  const userName = useSelector((state) => state?.account?.profile?.data?.profile?.username);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownSubcategory, setDropdownSubcategory] = useState(null);
  const categories = ["NEW IN", "MEN", "WOMEN", "BAGS", "ACCESSORIES"];
  const newIn = ["New Arrivals", "Best Sellers", "Rains Essentials"];
  const men = ["Jackets", "Tops", "Bottoms", "Accessories"];
  const women = ["Jackets", "Tops", "Bottoms", "Accessories"];
  const bags = ["Shop all bags", "New arrivals", "Texel travel series", "Color Story: Grey"];
  const bagsSubCategory = ["All bags", "Backpacks", "Totes Bags", "Travel Bags", "Laptop Bags", "Crossbody & Bum bags", "Wash bags"];
  const accessories = ["Caps", "Bags", "Accessories"];
  const accounts = ["Profile", "Address Book", "My Order", "Change My Password"];
  const accountsDropdown = ["Profile", "Address Book", "My Order", "Change My Password", "Search", "Cart", "Favorites"];
  const dispatch = useDispatch();
  const auth = getAuth(); // Initialize Firebase authentication
  const [userData, setUserData] = useState(null);
  const photoProfile = userData?.photoProfile;
  const dropdownRef = useRef(null);

  const openAuthModal = () => {
    dispatch(showLoginModal());
  };

  const openSignUpModal = () => {
    dispatch(showSignUpModal());
  };

  const handleIconClick = () => setDropdownVisible(!dropdownVisible);

  const handleSubcategoryClick = (subcategory) => setDropdownSubcategory(subcategory);
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

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (isLogin) {
          const response = await api.get(`/profile/${userName}`);
          setUserData(response.data.detail);
        }
      } catch (error) {
        toast.error("Failed to get user data");
      }
    };
    getUserData();
  }, [userName]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
        setDropdownSubcategory(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="w-full bg-white h-20 flex items-center justify-around">
      <div className="flex items-center gap-16">
        <img src={rains} alt="Logo" className="w-26 h-10" />
        <div className="hidden space-x-4 lg:flex">
          {categories.map((category, index) => {
            const joinedCategories = category.toLowerCase().replace(" ", "-");

            const renderSubcategory = (subcategory, index) => {
              const joinedSubcategory = subcategory.toLowerCase().replace(/\s/g, "-");
              return (
                <a key={index} href={`/${joinedCategories}/${joinedSubcategory}`}>
                  <p className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm">{subcategory}</p>
                </a>
              );
            };
            return (
              <>
                <p key={index} className="text-black text-md font-semibold hover:underline cursor-pointer" onClick={() => handleSubcategoryClick(category)}>
                  {category}
                </p>
                {dropdownSubcategory === category && (
                  <div className="absolute top-20 w-full right-0 h-50 bg-white ring-1 ring-black ring-opacity-5 z-10 flex-wrap" ref={dropdownRef}>
                    <div className="flex flex-row h-full">
                      <div className="w-[40vw] flex flex-col flex-wrap">
                        {(() => {
                          switch (category) {
                            case "NEW IN":
                              return newIn.map(renderSubcategory);
                            case "MEN":
                              return men.map(renderSubcategory);
                            case "WOMEN":
                              return women.map(renderSubcategory);
                            case "BAGS":
                              return (
                                <div className="w-[100%] flex justify-center">
                                  <div className="w-[80%vw] flex">
                                    <div className="mr-[5vw] font-extrabold">{bags.map(renderSubcategory)}</div>
                                    <div>{bagsSubCategory.map(renderSubcategory)}</div>
                                  </div>
                                </div>
                              );
                            case "ACCESSORIES":
                              return accessories.map(renderSubcategory);
                            default:
                              return null;
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })}
        </div>
      </div>
      {isLogin ? (
        <>
          <div className="hidden gap-8 lg:flex items-center">
            <BsSearch className="text-xl cursor-pointer" />
            <img src={photoProfile ? `http://localhost:8000/public/${photoProfile}` : "https://via.placeholder.com/150"} alt="Profile" className="w-6 h-6 rounded-full cursor-pointer" onClick={handleIconClick} />
            {dropdownVisible && (
              <div className="absolute top-16 w-48 h-48 bg-white ring-1 ring-black ring-opacity-5 z-10">
                {accounts.map((account, index) => {
                  const joinedAccounts = account.toLowerCase().replace(/\s/g, "-");
                  return (
                    <a key={index} href={`/account/${joinedAccounts}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {account}
                    </a>
                  );
                })}
                <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
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
                        <a key={index} href={`/account/${joinedAccounts}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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
          <Button pill className="cursor-pointer bg-[#40403F] enabled:hover:bg-[#777777]" onClick={openSignUpModal}>
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
