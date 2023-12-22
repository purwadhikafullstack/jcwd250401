import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { debounce } from "lodash";
import { Button } from "@chakra-ui/react";

function MenuListMobile() {
  const [dropdownSubcategory, setDropdownSubcategory] = useState(null);
  const [isDropdownTransitioning, setIsDropdownTransitioning] = useState(false);
  const categories = ["NEW", "MEN", "WOMEN", "BAGS", "ACCESSORIES"];
  const newIn = ["New Arrivals", "Best Sellers", "Rains Essentials"];
  const men = ["Jackets", "Tops", "Bottoms"];
  const women = ["Jackets", "Tops", "Bottoms"];
  const bags = ["Shop all bags", "New arrivals"];
  const [bagsSubCategory, setBagsSubCategory] = useState([]);
  const accessories = ["Shop all accessories", "New arrivals"];
  const [accessoriesSubCategory, setAccessoriesSubCategory] = useState([]);
  const [jacketsSubCategory, setJacketsSubCategory] = useState([]);
  const [topsSubCategory, setTopsSubCategory] = useState([]);
  const [bottomSubCategory, setBottomSubCategory] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const hoverTimeoutRef = useRef(null);

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
      console.log(categoryData);
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
      console.log(categoryData);
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
      console.log(categoryData);
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
      console.log(categoryData);
    } catch (error) {
      if (error?.response?.status === 404) {
        setAccessoriesSubCategory([]);
      }
    }
  }, []);

  useEffect(() => {
    const resetTransition = () => {
      setIsDropdownTransitioning(false);
    };
    const timeout = setTimeout(resetTransition, 300);
  }, [dropdownSubcategory]);

  const handleSubcategoryClick = (category) => {
    setIsDropdownTransitioning(true);
    setDropdownSubcategory((prevSubcategory) => (prevSubcategory === category ? null : category));

    // Only set activeCategory if it's not the same as the clicked category
    setActiveCategory((prevActiveCategory) => (prevActiveCategory === category ? null : category));
  };

  useEffect(() => {
    const handleScroll = debounce(() => {
      // Close the dropdown and set activeCategory to null
      setDropdownSubcategory(null);
      setActiveCategory(null);
    }, 1000); // Adjust the debounce delay as needed

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchCategoriesBags();
    fetchCategoriesJackets();
    fetchCategoriesTops();
    fetchCategoriesBottom();
    fetchCategoriesAccessories();
  }, [fetchCategoriesBags, fetchCategoriesJackets, fetchCategoriesTops, fetchCategoriesBottom, fetchCategoriesAccessories]);

  return (
    <div className="flex mt-4 h-14 w-full overflow-y-auto items-center space-x-2 scrollbar-hide">
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
            <Button
              key={index}
              onClick={() => {
                if (activeCategory === category) {
                  // If the clicked category is already active, reset both activeCategory and dropdownSubcategory
                  setDropdownSubcategory(null);
                  setActiveCategory(null);
                } else {
                  // If the clicked category is not active, handleSubcategoryClick and set dropdownSubcategory
                  handleSubcategoryClick(category);
                }
              }}
              minW={"150px"}
              px={10}
            >
              <span className={`text-md font-semibold cursor-pointer underline-on-click ${activeCategory === category ? "active" : ""}`}>{category}</span>
            </Button>

            {dropdownSubcategory === category && (
              <div className={`absolute top-14 w-full right-0 h-50 bg-white ring-1 ring-black ring-opacity-5 z-10 flex-wrap transition-dropdown ${isDropdownTransitioning ? "dropdown-hidden" : "dropdown-visible"}`}>
                <div className="flex flex-row h-full px-2">
                  <div className="flex flex-col flex-wrap">
                    {(() => {
                      switch (category) {
                        case "NEW IN":
                          return newIn.map(renderSubcategory);
                        case "MEN":
                          return (
                            <div className="flex ">
                              <div className=" flex flex-col font-bold font-sagoe">{men.map(renderSubcategory)}</div>
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
                            <div className="flex">
                              <div className=" font-bold font-sagoe">{women.map(renderSubcategory)}</div>
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
                              <div className="mr-16 font-bold font-sagoe">{bags.map(renderSubcategory)}</div>
                              <div className="flex flex-col">
                                <Link to={`/products/unisex/bags`}>
                                  <p className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm font-bold">All Bags</p>
                                </Link>
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
                              <div className="mr-16 font-bold font-sagoe">{accessories.map(renderSubcategory)}</div>
                              <div className="flex flex-col">
                                <Link to={`/products/unisex/accessories`}>
                                  <p className="text-gray-700 hover:bg-gray-100 block px-4 py-2 text-sm font-bold">All Accessories</p>
                                </Link>
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
  );
}

export default MenuListMobile;
