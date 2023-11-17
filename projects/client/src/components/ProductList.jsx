import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addProduct } from "../slices/productSlices";
import api from "../api";
import { useSelector } from "react-redux";
import { PiInfo } from "react-icons/pi";
import { Box, Button, Flex, Text } from "@chakra-ui/react";

function ProductList() {
  const [sortCriteria, setSortCriteria] = useState("date-desc"); // Default sorting criteria that matches the backend;
  const [searchInput, setSearchInput] = useState(""); // Initialize with "All"
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWarehouse, setSelectedWarehouse] = useState("All Warehouse");
  const [selectedFilter, setSelectedFilter] = useState("price-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const productsPerPage = 10; // Number of products to display per page
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]); // Initialize with empty array
  const [products, setProducts] = useState([]); // Initialize with empty array

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleWarehouseChange = (e) => {
    setSelectedWarehouse(e.target.value);
  };

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setCurrentPage(1);
        const response = await api.get(`/product?page=${currentPage}&limit=${productsPerPage}&sort=${sortCriteria}&category=${selectedCategory}&search=${searchInput}&filterBy=${selectedFilter}`);
        const responseData = response.data.details;
        const totalData = response.data.pagination.totalData;
        const totalPages = Math.ceil(totalData / productsPerPage);
        setTotalData(totalData);
        setTotalPages(totalPages);

        setProducts(responseData);
      } catch (error) {
        if (error?.response?.status == 404) {
          setTotalData(0);
          setTotalPages(0);
          setProducts([]);
        }
      }
    };

    fetchProducts();
  }, [currentPage, sortCriteria, selectedCategory, searchInput, selectedFilter, totalPages, totalData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/category/child-categories");
        const categoryData = response.data.details;
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);
  };

  const handleSortChange = (event) => {
    const selectedSortValue = event.target.value;
    setSortCriteria(selectedSortValue);
  };

  const handleFilterChange = (event) => {
    const selectedFilterValue = event.target.value;
    setSelectedFilter(selectedFilterValue);
  };

  const warehouse = [
    { label: "All Warehouse", value: "All" },
    { label: "Jakarta", value: "Jakarta" },
    { label: "Bandung", value: "Bandung" },
    { label: "Medan", value: "Medan" },
  ];

  const sortingOptions = [
    { label: "Date DESC", value: "date-desc" },
    { label: "Date ASC", value: "date-asc" },
    { label: "(A-Z)", value: "alphabetical-asc" },
    { label: "(Z-A)", value: "alphabetical-desc" },
  ];

  const filterOptions = [
    { label: "Price DESC", value: "price-desc" },
    { label: "Price ASC", value: "price-asc" },
  ];

  const sortingProduct = [
    { label: "All Category", value: "All" }, // Default "All" option
    ...categories.map((category) => {
      const mainCategoryOption = {
        label: category.name,
        value: category.name,
      };

      if (category.subcategories && category.subcategories.length > 0) {
        mainCategoryOption.subOpts = category.subcategories.map((subCategory) => ({
          label: subCategory.name,
          value: subCategory.name,
        }));
      }

      return mainCategoryOption;
    }),
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      height: '2rem', // Adjust the height value as needed
    }),
    menu: (provided) => ({
      ...provided,
      maxHeight: '200px', // Set the desired height of the dropdown menu
    }),
  };
  

  return (
    <div className="flex flex-col gap-4 w-full h-screen">
      <div className="w-full flex justify-between space-x-16">
        <div className="w-[25vw]">
          <div className="relative">
            <span className="absolute inset-y-0 left-2 pl-1 flex items-center">
              <FaSearch className="text-gray-400" />
            </span>
            <input type="text" className="pl-10 pr-3 py-2 border-2 rounded-lg w-full text-sm shadow-md focus:outline-none focus:border-gray-800 border-gray-400 focus:ring-transparent" placeholder="Search by product or SKU" />
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <div className="w-full">
            <select className="py-2 border-2 rounded-lg w-full text-sm shadow-md focus:outline-none focus:border-gray-800 border-gray-400 focus:ring-transparent">
              <option value="" disabled className="text-gray-400">
                Warehouse
              </option>
              {warehouse.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <select className="py-2 border-2 rounded-lg w-full text-sm shadow-md focus:outline-none focus:border-gray-800 border-gray-400 focus:ring-transparent " onChange={handleFilterChange}>
              <option value="" disabled className="text-gray-400">
                Filter
              </option>
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <select
              className="py-2 border-2 rounded-lg w-full text-sm shadow-md focus:outline-none focus:border-gray-800 border-gray-400 focus:ring-transparent"
              onChange={handleCategoryChange}
            >
              <option value="" disabled className="text-gray-400">
                Category
              </option>
              {sortingProduct.map((opt) => (
                <React.Fragment key={opt.value}>
                  <option
                    value={opt.value}
                    disabled={opt.subOpts}
                    style={{
                      fontWeight: opt.subOpts ? "bold" : "normal",
                    }}
                  >
                    {opt.label}
                  </option>
                  {opt.subOpts &&
                    opt.subOpts.map((subOpt) => (
                      <option key={subOpt.value} value={subOpt.value}>
                        {subOpt.label}
                      </option>
                    ))}
                </React.Fragment>
              ))}
            </select>
          </div>

          <div className="w-full">
            <select className="py-2 border-2 rounded-lg w-full text-sm shadow-md focus:outline-none focus:border-gray-800 border-gray-400 focus:ring-transparent" onChange={handleSortChange}>
              <option value="" disabled className="text-gray-400">
                Sort
              </option>
              {sortingOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="space-y-6 overflow-y-scroll scrollbar-hide h-[56vh]">
        {products.length == 0 ? (
          <Text textAlign={"center"} fontStyle={"italic"}>
            No data matches.
          </Text>
        ) : (
          ""
        )}
        {products.map((product) => (
          <div key={product.id} className="bg-white items-center flex gap-6 h-36 w-full px-6 py-2 rounded-lg shadow-md">
            <div className="h-[100px] w-[100px] flex justify-center items-center">
              {product.productImages[0]?.imageUrl ? (
                <img src={`http://localhost:8000/public/${product.productImages[0].imageUrl}`} className="w-full h-full object-cover shadow-lg" alt="Product Image" />
              ) : (
                <div className="w-full h-full flex justify-center items-center bg-gray-200 text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <PiInfo className="h-8 w-8" />
                    <span>No Image</span>
                  </div>
                </div>
              )}
            </div>

            <div className="font-semibold flex-1 text-center">{product.name}</div>
            <div className="font-semibold flex-1">{formatToRupiah(product.price)}</div>
          </div>
        ))}
      </div>
      <Box display="flex" justifyContent="right" gap={2} textAlign="right" mr={4}>
        <Flex alignItems={"center"} gap={2}>
          <Text fontWeight={"bold"}> Page </Text>
          <Box>
            <Button key={1} size="sm" onClick={() => handlePageChange(1)} variant={currentPage === 1 ? "solid" : "outline"} mr="5px">
              1
            </Button>
            {totalPages > 1 &&
              Array.from({ length: totalPages - 1 }, (_, index) => (
                <Button key={index + 2} size="sm" onClick={() => handlePageChange(index + 2)} variant={currentPage === index + 2 ? "solid" : "outline"} mr="5px">
                  {index + 2}
                </Button>
              ))}
          </Box>
        </Flex>
      </Box>
    </div>
  );
}

export default ProductList;
