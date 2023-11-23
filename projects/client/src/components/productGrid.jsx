import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getProductsUser from "../api/products/getProductsUser";
import { SimpleGrid } from "@chakra-ui/react";
import { toast } from "sonner";

function ProductGrid() {
  const { gender, mainCategory, subCategory } = useParams();
  const [products, setProducts] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [sortCriteria, setSortCriteria] = useState("date-desc");

  const formatSubCategory = (subCategory) => {
    // Split the subCategory into words
    const words = subCategory.split('-');
  
    // Capitalize each word and join them back
    const formattedSubCategory = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
    return formattedSubCategory;
  };
  

const fetchProducts = useCallback(async () => {
    try {
        const category = subCategory ? formatSubCategory(subCategory) : mainCategory;
        const result = await getProductsUser({
            category,
            filterBy: gender,
            page: currentPage,
            sort: sortCriteria,
        });
        const totalData = result.pagination.totalData;
        const totalPages = result.pagination.totalPages;
        setTotalData(totalData);
        setTotalPages(totalPages);
        setProducts(result.details);
    } catch (error) {
        if (error?.response?.status === 404) {
            setTotalData(0);
            setTotalPages(0);
            setProducts([]);
        } else if (error.request) {
            // Handle request errors
            setTimeout(() => {
                toast.error("Network error, please try again later");
            }, 2000);
        }
    }
}, [currentPage, totalData, gender, mainCategory, sortCriteria, subCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0, // Set minimumFractionDigits to 0 to remove the decimal part
      maximumFractionDigits: 0,
    }).format(number);
  };

  const handleSortChange = (event) => {
    const selectedSortValue = event.target.value;
    setSortCriteria(selectedSortValue);
  };

  const sortingOptions = [
    { label: "Date DESC", value: "date-desc" },
    { label: "Date ASC", value: "date-asc" },
    { label: "(A-Z)", value: "alphabetical-asc" },
    { label: "(Z-A)", value: "alphabetical-desc" },
    { label: "Price ASC", value: "price-asc" },
    { label: "Price DESC", value: "price-desc" },
  ];

  return (
    <div>
      <div className="flex justify-between">
        <div>&nbsp;</div>
        <div className="w-[160px] space-y-4">
          <span className="font-bold"> Sort by</span>
          <select className="py-2 border-2 rounded-lg w-full text-sm shadow-sm focus:outline-none focus:border-gray-800 border-gray-400 focus:ring-transparent" onChange={handleSortChange}>
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
      <div className="mt-6">
        <SimpleGrid columns={4} spacing={6} h="62vh" overflowY="auto" className="scrollbar-hide">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col gap-2 mb-2 ">
              <div>
                <img src={`http://localhost:8000/public/${product.productImages[0].imageUrl}`} className="w-[230px] h-[280px] object-cover shadow-md" alt="Product Image" />
              </div>
              <div className="text-md flex flex-col">
                <span> {product.name}</span>
                <span className="font-bold"> {formatToRupiah(product.price)}</span>
              </div>
            </div>
          ))}
        </SimpleGrid>
      </div>
    </div>
  );
}

export default ProductGrid;
