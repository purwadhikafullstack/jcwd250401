import React, { useCallback, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import getProductsUser from "../api/products/getProductsUser";
import { Divider, HStack, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, SimpleGrid, Select } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from "flowbite-react";
import { useDispatch } from "react-redux";
import { showLoginModal } from "../slices/authModalSlices";
import ZoomableImage from "./ZoomableImage";

function ProductCard() {
  const { gender, mainCategory, subCategory, productName } = useParams();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const sliderRef = useRef(null);
  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
  const dispatch = useDispatch();

  const formatSubCategory = (subCategory) => {
    const words = subCategory.split("-");
    const formattedSubCategory = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    return formattedSubCategory;
  };

  const formatProductName = (productName) => {
    const words = productName.split("-");
    const formattedProductName = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    return formattedProductName;
  };

  const fetchProducts = useCallback(async () => {
    try {
      const category = subCategory ? formatSubCategory(subCategory) : mainCategory;
      const result = await getProductsUser({
        category,
        filterBy: gender,
        productName: formatProductName(productName),
      });

      setSelectedProduct(result.details);
    } catch (error) {
      if (error?.response?.status === 404) {
        setSelectedProduct([]);
      } else if (error.request) {
        setTimeout(() => {
          toast.error("Network error, please try again later");
        }, 2000);
      }
    }
  }, [gender, mainCategory, subCategory, productName]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleImageClick = (imageId) => {
    const index = selectedProduct[0].productImages.findIndex((image) => image.id === imageId);
    if (index !== -1) {
      setActiveImageIndex(index);
      if (sliderRef.current) {
        sliderRef.current.slickGoTo(index);
      }
    }
  };

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          marginRight: "44px",
          zIndex: "20",
          transform: "scale(2)",
        }}
        onClick={onClick}
      ></div>
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          marginLeft: "44px",
          zIndex: "20",
          transform: "scale(2)",
        }}
        onClick={onClick}
      ></div>
    );
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setActiveImageIndex(current),
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.info("Please login first to perform this action", {
        duration: 1700,
        onAutoClose: (t) => {
          dispatch(showLoginModal());
        },
      });
    }

    console.log("add to cart");
  };

  const handleAddToWishlist = () => {
    if (!isLoggedIn) {
      toast.info("Please login first to perform this action", {
        duration: 1700,
        onAutoClose: (t) => {
          dispatch(showLoginModal());
        },
      });
    }
    console.log("add to wishlist");
  };

  console.log(showPopup);
  return (
    <div className="flex flex-col px-6 lg:px-32 space-y-6 lg:space-y-20 h-screen overflow-y scrollbar-hide">
      {selectedProduct.length !== 0 ? (
        <>
          <div className="hidden lg:flex w-full mt-14 gap-5">
            <div>
              {selectedProduct.map((product) => (
                <SimpleGrid columns={2} spacing={5} key={product.id}>
                  {product.productImages.map((image, idx) => (
                    <div key={idx} className={`w-[82px] h-[82px] object-cover shadow-xl cursor-pointer ${idx === activeImageIndex ? "border-2 border-[#777777]" : ""}`} onClick={() => handleImageClick(image.id)}>
                      <img src={`http://localhost:8000/public/${image.imageUrl}`} alt={`Product Image ${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </SimpleGrid>
              ))}
            </div>
            {selectedProduct.map((product) => (
              <div className="flex flex-col space-y-10 cursor-zoom-in" key={product.id}>
                <Slider {...settings} className="w-[480px] h-[480px] shadow-xl" ref={sliderRef}>
                  {product.productImages.map((image, idx) => (
                    <ZoomableImage imageUrl={`http://localhost:8000/public/${image.imageUrl}`} alt={`Product Image ${idx}`} images={selectedProduct[0].productImages} />
                  ))}
                </Slider>
              </div>
            ))}
            {selectedProduct.map((product) => (
              <div className="flex flex-col justify-between ml-28 w-[25vw]">
                <div className="flex flex-col space-y-5">
                  <div className="flex flex-col space-y-2">
                    <span className="font-bold text-2xl">{product.name}</span>
                    <span className="text-md leading-snug">{product.description.split(".").slice(0, 2).join(".") + "."}</span>
                  </div>
                  <div>
                    <span className="font-bold text-2xl">{formatToRupiah(product.price)}</span>
                    <div className="mt-6 border-t border border-gray-200"></div>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="flex space-x-4 justify-between">
                    <div className="w-full space-y-4">
                      <span className="font-bold text-xl">Size</span>
                      <select className="w-full h-10 rounded-md border-gray-200 focus:outline-transparent transition-all ease-in-out duration-500">
                        <option>All Size</option>
                      </select>
                    </div>
                    <div className="w-full space-y-4">
                      <span className="font-bold text-xl">Quantity</span>
                      <NumberInput defaultValue={1} min={1} max={20}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full shadow-md" color="light" size="lg" onClick={handleAddToWishlist}>
                      Add To Wishlist
                    </Button>
                    <Button className="w-full bg-Grey-1 enabled:hover:bg-[#777777] shadow-md" size="lg" onClick={handleAddToCart}>
                      Add To Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Mobile */}
          <div className="flex flex-col w-full mt-14 gap-5 lg:hidden">
            {selectedProduct.map((product) => (
              <div className="flex flex-col justify-center items-center space-y-10 cursor-zoom-in" key={product.id}>
                <Slider {...settings} className="w-[350px] h-[480px] shadow-xl" ref={sliderRef}>
                  {product.productImages.map((image, idx) => (
                    <ZoomableImage imageUrl={`http://localhost:8000/public/${image.imageUrl}`} alt={`Product Image ${idx}`} images={selectedProduct[0].productImages} />
                  ))}
                </Slider>
              </div>
            ))}
            <div className="flex justify-center">
              {selectedProduct.map((product) => (
                <div className="flex justify-center">
                  <SimpleGrid columns={5} spacing={2} key={product.id}>
                    {product.productImages.map((image, idx) => (
                      <div key={idx} className={`w-[62px] h-[82px] object-cover shadow-xl cursor-pointer ${idx === activeImageIndex ? "border-2 border-[#777777]" : ""}`} onClick={() => handleImageClick(image.id)}>
                        <img src={`http://localhost:8000/public/${image.imageUrl}`} alt={`Product Image ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </SimpleGrid>
                </div>
              ))}
            </div>
            {selectedProduct.map((product) => (
              <div className="flex flex-col justify-between">
                <div className="flex flex-col space-y-5">
                  <div className="flex flex-col space-y-2">
                    <span className="font-bold text-2xl">{product.name}</span>
                    <span className="text-md leading-snug">{product.description.split(".").slice(0, 2).join(".") + "."}</span>
                  </div>
                  <div>
                    <span className="font-bold text-2xl">{formatToRupiah(product.price)}</span>
                    <div className="mt-6 border-t border border-gray-200"></div>
                  </div>
                </div>
                <div className="space-y-4 mt-4">
                  <div className="flex space-x-4 justify-between">
                    <div className="w-full space-y-4">
                      <span className="font-bold text-xl">Size</span>
                      <select className="w-full h-10 rounded-md border-gray-200 focus:outline-transparent transition-all ease-in-out duration-500">
                        <option>All Size</option>
                      </select>
                    </div>
                    <div className="w-full space-y-4">
                      <span className="font-bold text-xl">Quantity</span>
                      <NumberInput defaultValue={1} min={1} max={20}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full shadow-md" color="light" size="lg" onClick={handleAddToWishlist}>
                      Add To Wishlist
                    </Button>
                    <Button className="w-full bg-Grey-1 enabled:hover:bg-[#777777] shadow-md" size="lg" onClick={handleAddToCart}>
                      Add To Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pb-10 flex-col space-y-4 lg:space-y-8">
            <div>
              <span className="font-bold text-2xl">Description</span>
            </div>
            <div>
              {selectedProduct[0]?.description.split("\n").map((paragraph, index) => (
                <p key={index} className="text-md mb-2 leading-snug">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
            <div className="mt-8 border-t border border-gray-200"></div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <span className="text-xl ">No product matches. </span>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
