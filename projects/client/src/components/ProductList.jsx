import { useState } from "react";
import { FaSearch } from "react-icons/fa";

function ProductList() {
  const [sortCriteria, setSortCriteria] = useState("alphabetical-asc"); // Default sorting criteria that matches the backend;
  const [searchInput, setSearchInput] = useState(""); // Initialize with "All"
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("All Warehouse");
  const [selectedFilter, setSelectedFilter] = useState("Filter");

  const warehouse = [
    { label: "All Warehouse", value: "All" },
    { label: "Jakarta", value: "Jakarta" },
    { label: "Bandung", value: "Bandung" },
    { label: "Medan", value: "Medan" },
  ];

  const sortingOptions = [
    { label: "(A-Z)", value: "alphabetical-asc" },
    { label: "(Z-A)", value: "alphabetical-desc" },
  ];

  const filterOptions = [
    { label: "Price DESC", value: "price-desc" },
    { label: "Price ASC", value: "price-asc" },
  ];

  const categories = [
    { label: "All Category", value: "All" },
    { label: "Category 1", value: "Category 1" },
    { label: "Category 2", value: "Category 2" },
    { label: "Category 3", value: "Category 3" },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
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
            <select className="py-2 border-2 rounded-lg w-full text-sm shadow-md focus:outline-none focus:border-gray-800 border-gray-400 focus:ring-transparent">
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
            <select className="py-2 border-2 rounded-lg w-full text-sm shadow-md focus:outline-none focus:border-gray-800 border-gray-400 focus:ring-transparent">
              <option value="" disabled className="text-gray-400">
                Category
              </option>
              {categories.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <select className="py-2 border-2 rounded-lg w-full text-sm shadow-md focus:outline-none focus:border-gray-800 border-gray-400 focus:ring-transparent">
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
      <div className=" space-y-6 overflow-y-scroll scrollbar-hide h-[62vh] mb-4">
        <div className="bg-white h-36 w-full px-4 py-2 rounded-lg shadow-md">Product 1</div>
        <div className="bg-white h-36 w-full px-4 py-2 rounded-lg shadow-md">Product 2</div>
        <div className="bg-white h-36 w-full px-4 py-2 rounded-lg shadow-md">Product 3</div>
        <div className="bg-white h-36 w-full px-4 py-2 rounded-lg shadow-md">Product 4</div>
      </div>
    </div>
  );
}

export default ProductList;
