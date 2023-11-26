import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import getProductsUser from "../api/products/getProductsUser";
import { SimpleGrid } from "@chakra-ui/react";
import { toast } from "sonner";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ProductGrid() {
  const { gender, mainCategory, subCategory } = useParams();
  const [products, setProducts] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [sortCriteria, setSortCriteria] = useState("date-desc");
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [sliderIntervals, setSliderIntervals] = useState({});
  const location = useLocation();

  useEffect(() => {
    // Initialize currentImageIndexes with default value 0 for each product ID
    const initialIndexes = {};
    products.forEach((product) => {
      initialIndexes[product.id] = 0;
    });
    setCurrentImageIndexes(initialIndexes);

    // Clean up intervals on component unmount
    return () => {
      Object.values(sliderIntervals).forEach((intervalId) => clearInterval(intervalId));
    };
  }, [products, sliderIntervals]);

  const formatSubCategory = (subCategory) => {
    const words = subCategory.split("-");
    const formattedSubCategory = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const handleSortChange = (event) => {
    const selectedSortValue = event.target.value;
    setSortCriteria(selectedSortValue);
  };

  const handleImageSlider = (index, productId) => {
    setCurrentImageIndexes((prevIndexes) => ({
      ...prevIndexes,
      [productId]: index,
    }));

    const intervalId = setInterval(() => {
      setCurrentImageIndexes((prevIndexes) => ({
        ...prevIndexes,
        [productId]: (prevIndexes[productId] + 1) % products.find((p) => p.id === productId)?.productImages.length || 0,
      }));
    }, 2000);

    setSliderIntervals((prevIntervals) => ({ ...prevIntervals, [productId]: intervalId }));
  };

  const stopImageSlider = (productId) => {
    // Reset the currentImageIndex to 0 when the mouse leaves
    setCurrentImageIndexes((prevIndexes) => ({
      ...prevIndexes,
      [productId]: 0,
    }));
    clearInterval(sliderIntervals[productId]);
  };

  const sortingOptions = [
    { label: "Date DESC", value: "date-desc" },
    { label: "Date ASC", value: "date-asc" },
    { label: "(A-Z)", value: "alphabetical-asc" },
    { label: "(Z-A)", value: "alphabetical-desc" },
    { label: "Price ASC", value: "price-asc" },
    { label: "Price DESC", value: "price-desc" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <></>,
    prevArrow: <></>,
  };

  return (
    <div>
      {products.length === 0 && (
        <div className="flex justify-between">
          <span className="text-xl ">No products found. </span>
          <span className="text-xl w-[34vw]">&nbsp; </span>
        </div>
      )}
      {products.length !== 0 && (
        <div className="flex justify-between">
          <div>&nbsp;</div>
          <div className="w-[168px] space-y-2">
            <span className="font-bold"> Sort by</span>
            <select className="py-2 border-1 rounded-lg w-full text-sm shadow-sm focus:outline-none focus:border-gray-800 border-gray-400 focus:ring-transparent" onChange={handleSortChange}>
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
      )}
      <div className="mt-6">
        <SimpleGrid columns={4} spacing={4} h="63vh" overflowY="auto" className="scrollbar-hide">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.gender.toLowerCase()}/${product.categories[0].name.replace(/\s+/g, "-").toLowerCase()}/${product.categories[1].name.replace(/\s+/g, "-").toLowerCase()}/${product.name.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <div className="flex flex-col space-y-10 cursor-pointer">
                <Slider {...settings} className="w-[230px] h-[280px]">
                  {product.productImages.map((image, idx) => (
                    <div key={idx} className="w-[230px] h-[310px]">
                      <img src={`http://localhost:8000/public/${image.imageUrl}`} className="w-full h-full object-cover shadow-md" alt={`Product Image ${idx}`} />
                    </div>
                  ))}
                </Slider>
                <div className="text-md flex flex-col">
                  <span>{product.name}</span>
                  <span className="font-bold">{formatToRupiah(product.price)}</span>
                </div>
              </div>
            </Link>
          ))}
        </SimpleGrid>
      </div>
    </div>
  );
}

export default ProductGrid;
