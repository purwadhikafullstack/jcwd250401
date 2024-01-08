import React, { useCallback, useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiOutlineArrowRight } from "react-icons/hi";
import { Button } from "flowbite-react";
import rains from "../assets/rains.png";
import AuthModal from "./AuthModal";
import { useSelector, useDispatch } from "react-redux";
import { showLoginModal, showSignUpModal } from "../slices/authModalSlices";
import { logout, setUsername } from "../slices/accountSlices";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import getProfile from "../api/profile/getProfile";
import { PiHeart, PiMagnifyingGlass, PiShoppingCart } from "react-icons/pi";
import getCart from "../api/cart/getCart";
import { setCartItems } from "../slices/cartSlices";
import api from "../api";
import SearchModal from "./SearchModal";
import WishlistModal from "./WishlistModal";

function Navigationbar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownSubcategory, setDropdownSubcategory] = useState(null);
  const [isDropdownTransitioning, setIsDropdownTransitioning] = useState(false);
  const categories = ["MEN", "WOMEN", "BAGS", "ACCESSORIES"];
  const men = ["Jackets", "Tops", "Bottoms"];
  const women = ["Jackets", "Tops", "Bottoms"];
  const accounts = ["Profile", "Address Book", "My Order", "Change Password"];
  const accountsDropdown = ["Profile", "Address Book", "My Order", "Change Password"];
  const dispatch = useDispatch();
  const auth = getAuth();
  const [userData, setUserData] = useState(null);
  const updatedPhotoProfile = useSelector((state) => state?.account?.userPhotoProfile);
  const photoProfile = userData?.photoProfile;
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem("profile"));
  const username = profile?.data?.profile?.username;
  const token = useSelector((state) => state?.account?.profile?.data?.token);
  let isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
  const location = useLocation();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [carts, setCarts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [bagsSubCategory, setBagsSubCategory] = useState([]);
  const [accessoriesSubCategory, setAccessoriesSubCategory] = useState([]);
  const [jacketsSubCategory, setJacketsSubCategory] = useState([]);
  const [topsSubCategory, setTopsSubCategory] = useState([]);
  const [bottomSubCategory, setBottomSubCategory] = useState([]);
  const cart = useSelector((state) => state.cart.items);
  const [activeCategory, setActiveCategory] = useState(null);
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = (category) => {
    hoverTimeoutRef.current = setTimeout(() => {
      if (dropdownSubcategory !== category) {
        handleSubcategoryClick(category);
      }
    }, 500);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeoutRef.current);
  };

  const fetchCategoriesBags = useCallback(async () => {
    try {
      const response = await api.get(`/api/category/user/sub-categories?mainCategory=Bags`);
      const categoryData = response.data.detail;
      setBagsSubCategory(categoryData);
    } catch (error) {
      if (error?.response?.status === 404) {
        setBagsSubCategory([]);
      }
    }
  }, []);

  const fetchCategoriesJackets = useCallback(async () => {
    try {
      const response = await api.get(`/api/category/user/sub-categories?mainCategory=Jackets`);
      const categoryData = response.data.detail;
      setJacketsSubCategory(categoryData);
    } catch (error) {
      if (error?.response?.status === 404) {
        setJacketsSubCategory([]);
      }
    }
  }, []);

  const fetchCategoriesTops = useCallback(async () => {
    try {
      const response = await api.get(`/api/category/user/sub-categories?mainCategory=Tops`);
      const categoryData = response.data.detail;
      setTopsSubCategory(categoryData);
    } catch (error) {
      if (error?.response?.status === 404) {
        setTopsSubCategory([]);
      }
    }
  }, []);

  const fetchCategoriesBottom = useCallback(async () => {
    try {
      const response = await api.get(`/api/category/user/sub-categories?mainCategory=Bottom`);
      const categoryData = response.data.detail;
      setBottomSubCategory(categoryData);
    } catch (error) {
      if (error?.response?.status === 404) {
        setBottomSubCategory([]);
      }
    }
  }, []);

  const fetchCategoriesAccessories = useCallback(async () => {
    try {
      const response = await api.get(`/api/category/user/sub-categories?mainCategory=Accessories`);
      const categoryData = response.data.detail;
      setAccessoriesSubCategory(categoryData);
    } catch (error) {
      if (error?.response?.status === 404) {
        setAccessoriesSubCategory([]);
      }
    }
  }, []);

  const fetchCarts = useCallback(async () => {
    try {
      const result = await getCart({});
      setCarts(result.detail.CartItems);
      // Calculate total price and quantity
      calculateTotal(result.detail.CartItems);
    } catch (error) {
      if (error?.response?.status === 404) {
        setCarts([]);
        setTotalQuantity(0);
        dispatch(setCartItems(0));
      } else if (error.response && error.response.status === 401) {
        setCarts([]);
        setTotalQuantity(0);
        dispatch(setCartItems(0));
      } else if (error.response && error.response.status === 403) {
        setCarts([]);
        dispatch(setCartItems(0));
      }
    }
  }, [isLoggedIn, cart]);

  useEffect(() => {
    fetchCarts();
    fetchCategoriesJackets();
    fetchCategoriesBags();
    fetchCategoriesTops();
    fetchCategoriesBottom();
    fetchCategoriesAccessories();
  }, [fetchCarts, fetchCategoriesJackets, fetchCategoriesTops, fetchCategoriesBottom, fetchCategoriesBags, fetchCategoriesAccessories]);

  const calculateTotal = (cartItems) => {
    let total = 0;
    let quantity = 0;

    cartItems.forEach((cart) => {
      total += cart.Product.price * cart.quantity;
      quantity += cart.quantity;
    });

    setTotalPrice(total);
    setTotalQuantity(quantity);
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const openWishlistModal = () => {
    setIsWishlistModalOpen(true);
  };

  const closeWishlistModal = () => {
    setIsWishlistModalOpen(false);
  };

  const openAuthModal = () => {
    dispatch(showLoginModal());
  };

  const openSignUpModal = () => {
    dispatch(showSignUpModal());
  };

  const handleIconClick = () => setDropdownVisible(!dropdownVisible);

  const handleSubcategoryClick = (category) => {
    setIsDropdownTransitioning(true);
    setDropdownSubcategory((prevSubcategory) => (prevSubcategory === category ? null : category));
    setActiveCategory(category);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setDropdownVisible(false);
        dispatch(logout());
        navigate(location.pathname);
      })
      .catch((error) => {
        toast.error("Error signing out:", error);
      });
  };

  const getUserData = async () => {
    if (isLoggedIn) {
      try {
        const response = await getProfile({ username, token });
        setUserData(response.detail);
        dispatch(setUsername(response.detail.username));
      } catch (error) {
        if (error.response.status === 404 || error.response.status === 500 || error.response.status === 401 || error.response.status === 403) {
          toast.error(error.response.data.message);
          setTimeout(() => {
            isLoggedIn = false;
            dispatch(logout());
            handleLogout();
            navigate(location.pathname);
          }, 1000);
        }
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, [username, updatedPhotoProfile]);

  useEffect(() => {
    const resetTransition = () => {
      setIsDropdownTransitioning(false);
    };
    const timeout = setTimeout(resetTransition, 300);
  }, [dropdownSubcategory]);

  return (
    <div className="w-full bg-white h-20 flex items-center justify-between font-sagoe lg:px-32 px-6 ">
      <div className="flex items-center gap-16">
        <Link to="/">
          <img src={rains} alt="Logo" className="w-26 h-10 hover:cursor-pointer" />
        </Link>
        <div className="hidden space-x-6 lg:flex">
          {categories.map((category, index) => {
            const joinedCategories = category.toLowerCase().replace(" ", "-");
            const finalCategory = joinedCategories === "bags" || joinedCategories === "accessories" ? `unisex/${joinedCategories}` : joinedCategories;

            const renderSubcategory = (subcategory, index) => {
              const joinedSubcategory = subcategory.toLowerCase().replace(/\s/g, "-");
              const finalSubcategory = joinedSubcategory === "all-bags" || joinedSubcategory === "all-accessories" ? "" : `/${joinedSubcategory}`;
              return (
                <Link key={index} to={`/products/${finalCategory}${finalSubcategory}`}>
                  <p className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm">{subcategory}</p>
                </Link>
              );
            };
            return (
              <>
                <Link
                  to={category === "MEN" || category === "WOMEN" ? `/collections/${category.toLowerCase()}` : `/products/unisex/${category.toLowerCase()}`}
                  key={index}
                  className={`text-md font-semibold cursor-pointer underline-on-hover ${activeCategory === category ? "active" : ""}`}
                  onMouseEnter={() => handleMouseEnter(category)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => {
                    setDropdownSubcategory(null);
                    setActiveCategory(null);
                  }}
                >
                  {category}
                </Link>

                {dropdownSubcategory === category && (
                  <div
                    className={`absolute top-20 w-full right-0 h-50 bg-white ring-1 ring-black ring-opacity-5 z-10 flex-wrap transition-dropdown ${isDropdownTransitioning ? "dropdown-hidden" : "dropdown-visible"}`}
                    onMouseLeave={() => {
                      setDropdownSubcategory(null);
                      setActiveCategory(null);
                    }}
                  >
                    <div className="flex flex-row h-full px-28">
                      <div className="flex flex-col flex-wrap">
                        {(() => {
                          switch (category) {
                            case "MEN":
                              return (
                                <div className="flex space-x-16 ">
                                  <div className="mr-8 flex flex-col font-bold font-sagoe">{men.map(renderSubcategory)}</div>
                                  <div className="flex flex-col">
                                    <Link to={`/products/men/jackets`}>
                                      <span className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm font-bold">All Jackets</span>
                                    </Link>
                                    {jacketsSubCategory.map((subCategory) => {
                                      const joinedSubcategory = subCategory.name.toLowerCase().replace(/\s/g, "-");
                                      return (
                                        <Link to={`/products/men/jackets/${joinedSubcategory}`} key={subCategory.id}>
                                          <span className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm">{subCategory.name}</span>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                  <div className="flex flex-col">
                                    <Link to={`/products/men/tops`}>
                                      <span className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm font-bold">All Tops</span>
                                    </Link>
                                    {topsSubCategory.map((subCategory) => {
                                      const joinedSubcategory = subCategory.name.toLowerCase().replace(/\s/g, "-");
                                      return (
                                        <Link to={`/products/men/tops/${joinedSubcategory}`} key={subCategory.id}>
                                          <span className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm">{subCategory.name}</span>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                  <div className="flex flex-col">
                                    <Link to={`/products/men/bottom`}>
                                      <span className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm font-bold">All Bottom</span>
                                    </Link>
                                    {bottomSubCategory.map((subCategory) => {
                                      const joinedSubcategory = subCategory.name.toLowerCase().replace(/\s/g, "-");
                                      return (
                                        <Link to={`/products/men/bottom/${joinedSubcategory}`} key={subCategory.id}>
                                          <span className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm">{subCategory.name}</span>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            case "WOMEN":
                              return (
                                <div className="flex space-x-16 ">
                                  <div className="mr-8 font-bold font-sagoe">{women.map(renderSubcategory)}</div>
                                  <div className="flex flex-col">
                                    <Link to={`/products/women/jackets`}>
                                      <span className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm font-bold">All Jackets</span>
                                    </Link>
                                    {jacketsSubCategory.map((subCategory) => {
                                      const joinedSubcategory = subCategory.name.toLowerCase().replace(/\s/g, "-");
                                      return (
                                        <Link to={`/products/women/jackets/${joinedSubcategory}`} key={subCategory.id}>
                                          <span className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm">{subCategory.name}</span>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                  <div className="flex flex-col">
                                    <Link to={`/products/women/tops`}>
                                      <span className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm font-bold">All Tops</span>
                                    </Link>
                                    {topsSubCategory.map((subCategory) => {
                                      const joinedSubcategory = subCategory.name.toLowerCase().replace(/\s/g, "-");
                                      return (
                                        <Link to={`/products/women/tops/${joinedSubcategory}`} key={subCategory.id}>
                                          <span className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm">{subCategory.name}</span>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                  <div className="flex flex-col">
                                    <Link to={`/products/women/bottom`}>
                                      <span className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm font-bold">All Bottom</span>
                                    </Link>
                                    {bottomSubCategory.map((subCategory) => {
                                      const joinedSubcategory = subCategory.name.toLowerCase().replace(/\s/g, "-");
                                      return (
                                        <Link to={`/products/women/bottom/${joinedSubcategory}`} key={subCategory.id}>
                                          <span className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm">{subCategory.name}</span>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            case "BAGS":
                              return (
                                <div className="flex justify-center">
                                  <div className="mr-16 font-bold font-sagoe">
                                    <Link to={`/products/unisex/bags`}>
                                      <p className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm font-bold">All Bags</p>
                                    </Link>
                                  </div>
                                  <div className="flex flex-col">
                                    {bagsSubCategory.map((subCategory) => {
                                      const joinedSubcategory = subCategory.name.toLowerCase().replace(/\s/g, "-");
                                      return (
                                        <Link to={`/products/unisex/bags/${joinedSubcategory}`} key={subCategory.id}>
                                          <p className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm">{subCategory.name}</p>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            case "ACCESSORIES":
                              return (
                                <div className="flex justify-center">
                                  <div className="mr-16 font-bold font-sagoe">
                                    <Link to={`/products/unisex/accessories`}>
                                      <p className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm font-bold">All Accessories</p>
                                    </Link>
                                  </div>
                                  <div className="flex flex-col">
                                    {accessoriesSubCategory.map((subCategory) => {
                                      const joinedSubcategory = subCategory.name.toLowerCase().replace(/\s/g, "-");
                                      return (
                                        <Link to={`/products/unisex/accessories/${joinedSubcategory}`} key={subCategory.id}>
                                          <p className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm">{subCategory.name}</p>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
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
            <div className="text-xl cursor-pointer" onClick={openSearchModal}>
              <PiMagnifyingGlass />
            </div>
            <img src={photoProfile ? `http://localhost:8000/public/${photoProfile}` : "https://via.placeholder.com/150"} alt="Profile" className="w-6 h-6 rounded-full cursor-pointer" onClick={handleIconClick} />
            {dropdownVisible && (
              <div className={`absolute right-16 top-16 w-48 h-48 bg-white ring-1 ring-black ring-opacity-5 z-10 ${isDropdownTransitioning ? "dropdown-hidden" : "dropdown-visible"}`} onMouseLeave={() => setDropdownVisible(false)}>
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
            <PiHeart className="text-xl cursor-pointer" onClick={openWishlistModal} />
            <div style={{ position: "relative", display: "inline-block" }}>
              <PiShoppingCart className="text-xl cursor-pointer" onClick={() => navigate("/account/shopping-cart")} />
              {totalQuantity > 0 && ( // Conditionally render the circle if cartItem is greater than 0
                <div
                  style={{
                    position: "absolute",
                    top: "-7px",
                    right: "-9px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "red",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "9px",
                  }}
                >
                  {totalQuantity}
                </div>
              )}
            </div>
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden gap-3 z-10">
            {/* Category sm */}
            <GiHamburgerMenu className="text-xl cursor-pointer flex lg:hidden" onClick={handleIconClick} />
            {dropdownVisible && (
              <div className={`absolute top-20 w-full h-70 bg-white ring-1 ring-black ring-opacity-5 right-0 lg:hidden ${isDropdownTransitioning ? "dropdown-hidden" : "dropdown-visible"}`}>
                {/* Categories sm */}
                <div className="flex px-2 flex-row">
                  <div className="w-[50vw]">
                    {categories.map((category, index) => {
                      return (
                        <Link to={category === "MEN" || category === "WOMEN" ? `/collections/${category.toLowerCase()}` : `/products/unisex/${category.toLowerCase()}`} onClick={handleIconClick}>
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
                        <Link key={index} to={`/account/${joinedAccounts}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleIconClick}>
                          {account}
                        </Link>
                      );
                    })}

                    <span
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      role="menuitem"
                      onClick={() => {
                        navigate("/account/shopping-cart");
                        handleIconClick();
                      }}
                    >
                      Shopping Cart {cart > 0 && <span className="text-sm font-bold">{cart}</span>}
                    </span>
                    <span
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      role="menuitem"
                      onClick={() => {
                        openWishlistModal();
                        handleIconClick();
                      }}
                    >
                      Wishlist
                    </span>
                    <span
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      role="menuitem"
                      onClick={() => {
                        openSearchModal();
                        handleIconClick();
                      }}
                    >
                      Search
                    </span>

                    <p
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      role="menuitem"
                      onClick={() => {
                        handleLogout();
                        handleIconClick();
                      }}
                    >
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
          <div className="text-xl cursor-pointer" onClick={openSearchModal}>
            <PiMagnifyingGlass />
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <a onClick={openAuthModal} className="text-black text-md font-semibold hover:underline cursor-pointer">
              Log in
            </a>
            <Button pill className="cursor-pointer bg-[#40403F] text-white enabled:hover:bg-gray-400 enabled:hover:text-gray-900 transition duration-200 ease-linear" onClick={openSignUpModal}>
              <span className="text-md font-semibold">Sign Up</span>
              <HiOutlineArrowRight className="ml-2 h-5 w-5 hover:block" />
            </Button>
          </div>
          <div className="flex lg:hidden gap-3 z-10">
            {/* Category sm */}
            <GiHamburgerMenu className="text-xl cursor-pointer flex lg:hidden" onClick={handleIconClick} />
            {dropdownVisible && (
              <div className={`absolute top-20 w-full h-70 bg-white ring-1 ring-black ring-opacity-5 right-0 lg:hidden ${isDropdownTransitioning ? "dropdown-hidden" : "dropdown-visible"}`}>
                {/* Categories sm */}
                <div className="flex px-2 flex-row">
                  <div className="w-[50vw]">
                    {categories.map((category, index) => {
                      return (
                        <Link to={category === "MEN" || category === "WOMEN" ? `/collections/${category.toLowerCase()}` : `/products/unisex/${category.toLowerCase()}`} onClick={handleIconClick}>
                          <p className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm">{category}</p>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="w-[50vw] flex ml-20">
                    <div className="flex flex-col">
                      <a
                        onClick={() => {
                          openAuthModal();
                          handleIconClick();
                        }}
                        className="text-sm py-2 hover:underline cursor-pointer"
                      >
                        Log In
                      </a>
                      <a
                        onClick={() => {
                          openSignUpModal();
                          handleIconClick();
                        }}
                        className="text-sm py-2 hover:underline cursor-pointer"
                      >
                        Sign Up
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <AuthModal />
      <SearchModal isOpen={isSearchModalOpen} isClose={closeSearchModal} />
      <WishlistModal isOpen={isWishlistModalOpen} isClose={closeWishlistModal} />
    </div>
  );
}

export default Navigationbar;
