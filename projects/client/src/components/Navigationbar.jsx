import React, { useEffect, useState } from "react";
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
import { getAuth, signOut } from "firebase/auth";
import api from "../api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Navigationbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownSubcategory, setDropdownSubcategory] = useState(null);
  const [isDropdownTransitioning, setIsDropdownTransitioning] = useState(false);
  const categories = ["NEW IN", "MEN", "WOMEN", "BAGS", "ACCESSORIES"];
  const newIn = ["New Arrivals", "Best Sellers", "Rains Essentials"];
  const men = ["Jackets", "Tops", "Bottoms", "Accessories"];
  const women = ["Jackets", "Tops", "Bottoms", "Accessories"];
  const bags = ["Shop all bags", "New arrivals", "Texel travel series", "Color Story: Grey"];
  const bagsSubCategory = ["All bags", "Backpacks", "Totes Bags", "Travel Bags", "Laptop Bags", "Crossbody & Bum bags", "Wash bags"];
  const accessories = ["Caps", "Bags", "Accessories"];
  const accounts = ["Profile", "Address Book", "My Order", "Change Password"];
  const accountsDropdown = ["Profile", "Address Book", "My Order", "Change Password", "Search", "Cart", "Favorites"];
  const dispatch = useDispatch();
  const auth = getAuth();
  const [userData, setUserData] = useState(null);
  const photoProfile = userData?.photoProfile;
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem("profile"));
  const username = profile.data?.profile?.username;
  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));

  console.log(isLoggedIn, username)

  const openAuthModal = () => {
    dispatch(showLoginModal());
  };

  const openSignUpModal = () => {
    dispatch(showSignUpModal());
  };

  const handleIconClick = () => setDropdownVisible(!dropdownVisible);

  const handleSubcategoryClick = (subcategory) => {
    setIsDropdownTransitioning(true);
    setDropdownSubcategory(subcategory);
  };

  const handleLogout = () => {
    navigate("/");
    signOut(auth)
      .then(() => {
        dispatch(showLoginModal());
        setDropdownVisible(false);
        dispatch(logout());
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (isLoggedIn) {
          const response = await api.get(`/profile/${username}`);
          setUserData(response.data.detail);
        }
      } catch (error) {
        toast.error("Failed to get user data");
        // handleLogout();
      }
    };
    getUserData();
  }, [username, photoProfile]);

  useEffect(() => {
    const resetTransition = () => {
      setIsDropdownTransitioning(false);
    };

    const timeoutId = setTimeout(resetTransition, 200);

    return () => clearTimeout(timeoutId);
  }, [dropdownSubcategory]);

  return (
    <div className="w-full bg-white h-20 flex items-center justify-around font-sagoe ">
      <div className="flex items-center gap-16">
        <Link to="/">
          <img src={rains} alt="Logo" className="w-26 h-10 hover:cursor-pointer" />
        </Link>
        <div className="hidden space-x-4 lg:flex">
          {categories.map((category, index) => {
            const joinedCategories = category.toLowerCase().replace(" ", "-");

            const renderSubcategory = (subcategory, index) => {
              const joinedSubcategory = subcategory.toLowerCase().replace(/\s/g, "-");
              return (
                <Link key={index} to={`/${joinedCategories}/${joinedSubcategory}`}>
                  <p className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm">{subcategory}</p>
                </Link>
              );
            };

            return (
              <>
                <Link to={`/${joinedCategories}`} key={index} className="text-md font-semibold cursor-pointer underline-on-hover " onMouseEnter={() => handleSubcategoryClick(category)}>
                  {category}
                </Link>
                {dropdownSubcategory === category && (
                  <div
                    className={`absolute top-20 w-full right-0 h-50 bg-white ring-1 ring-black ring-opacity-5 z-10 flex-wrap transition-dropdown ${isDropdownTransitioning ? "dropdown-hidden" : "dropdown-visible"}`}
                    onMouseLeave={() => setDropdownSubcategory(null)}
                  >
                    <div className="flex flex-row h-full px-44">
                      <div className="flex flex-col flex-wrap">
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
                                <div className="flex justify-center">
                                  <div className="mr-[4vw] font-bold font-sagoe">{bags.map(renderSubcategory)}</div>
                                  <div>{bagsSubCategory.map(renderSubcategory)}</div>
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
      {isLoggedIn ? (
        <>
          <div className="hidden gap-8 lg:flex items-center">
            <BsSearch className="text-xl cursor-pointer" />
            <img src={photoProfile ? `http://localhost:8000/public/${photoProfile}` : "https://via.placeholder.com/150"} alt="Profile" className="w-6 h-6 rounded-full cursor-pointer" onClick={handleIconClick} />
            {dropdownVisible && (
              <div className={`absolute top-16 w-48 h-48 bg-white ring-1 ring-black ring-opacity-5 z-10 ${isDropdownTransitioning ? "dropdown-hidden" : "dropdown-visible"}`} onMouseLeave={() => setDropdownVisible(false)}>
                {accounts.map((account, index) => {
                  const joinedAccounts = account.toLowerCase().replace(/\s/g, "-");
                  return (
                    <Link key={index} to={`/account/${joinedAccounts}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {account}
                    </Link>
                  );
                })}
                <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                  Log Out
                </p>
              </div>
            )}

            <MdFavoriteBorder className="text-xl cursor-pointer" />
            <BsCart className="text-xl cursor-pointer" 
              onClick={() => navigate("/account/cart")}
            />
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden gap-3 z-10">
            {/* Category sm */}
            <GiHamburgerMenu className="text-xl cursor-pointer flex lg:hidden" onClick={handleIconClick} />
            {dropdownVisible && (
              <div className={`absolute top-20 w-full h-70 bg-white ring-1 ring-black ring-opacity-5 right-0 lg:hidden ${isDropdownTransitioning ? "dropdown-hidden" : "dropdown-visible"}`}>
                {/* Categories sm */}
                <div className="flex flex-row">
                  <div className="w-[50vw]">
                    {categories.map((category, index) => {
                      const joinedCategories = category.toLowerCase().replace(" ", "-");
                      return (
                        <Link key={index} to={`/${joinedCategories}`}>
                          <p className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm">{category}</p>
                        </Link>
                      );
                    })}
                  </div>
                  {/* Profile sm */}
                  <div className="w-[50vw]">
                    {accountsDropdown.map((account, index) => {
                      const joinedAccounts = account.toLowerCase().replace(" ", "-");
                      return (
                        <Link key={index} to={`/account/${joinedAccounts}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          {account}
                        </Link>
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
        <div className="flex items-center gap-4">
          <a onClick={openAuthModal} className="text-black text-md font-semibold hover:underline cursor-pointer">
            Log in
          </a>
          <Button pill className="cursor-pointer bg-[#40403F] enabled:hover:bg-gray-400 transition duration-500 ease-in-out" onClick={openSignUpModal}>
            <span className="text-white text-md font-semibold">Sign Up</span>
            <HiOutlineArrowRight className="ml-2 h-5 w-5 hover:block" />
          </Button>
        </div>
      )}
      <AuthModal />
    </div>
  );
}

export default Navigationbar;
