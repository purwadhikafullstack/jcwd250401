import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { PiEye, PiMagnifyingGlassBold } from "react-icons/pi";
import { toast } from "sonner";
import _debounce from "lodash/debounce";
import getProductsUser from "../api/products/getProductsUser";
import { Button } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import rains from "../assets/rains.png";
import menexplore from "../assets/menjackets.jpg";
import womenexplore from "../assets/womensearch.jpg";
import unisexexplore from "../assets/unisexsearch.jpg";

function SearchModal({ isOpen, isClose }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchProduct = useCallback(async () => {
    // Check if search is not empty before making the API call
    if (search.trim() === "") {
      setProducts([]); // Set products to an empty array when search is empty
      return;
    }

    try {
      const result = await getProductsUser({
        page: 1,
        limit: 10,
        search: search,
      });
      setProducts(result.details);
    } catch (error) {
      if (error?.response?.status === 404) {
        setProducts([]);
      } else if (error.request) {
        setTimeout(() => {
          toast.error("Network error, please try again later");
        }, 2000);
      }
    }
  }, [search]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleSearchInputChange = _debounce((e) => {
    setSearch(e.target.value);
  }, 600);

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const handleClose = () => {
    setProducts([]);
    setSearch(""); // Reset products when the modal is closed
    isClose();
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} size="full" onClose={handleClose} motionPreset="slideInTop" isCentered>
      <ModalOverlay />
      <ModalContent bg="rgba(0, 0, 0, 0.7)" backdropFilter="blur(4px)">
        <ModalHeader />
        <ModalCloseButton color="white" />
        <ModalBody>
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center space-y-4">
              <img
                src={rains}
                alt="rains"
                className="lg:w-[15%] w-[30%] invert mb-4 cursor-pointer"
                onClick={() => {
                  handleClose();
                  navigate("/");
                }}
              />
              <div className="relative">
                <PiMagnifyingGlassBold size={20} color="white" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  className="bg-black opacity-80 border-2 text-white focus:border-gray-200 focus:ring-transparent focus:outline-tranparent transition duration-200 ease-in-out rounded-xl px-10 py-2 w-[300px] lg:w-[600px] pl-12" // Adjusted padding and width to accommodate the icon
                  placeholder="What are you looking for?"
                  onChange={handleSearchInputChange}
                />
              </div>
            </div>
            <div className="hidden lg:flex flex-col space-y-4 mt-10 h-[60vh] overflow-y-auto scrollbar-hide">
              <div className="flex flex-col justify-center items-center space-y-4">
                {search === "" && (
                  <SimpleGrid columns={3} spacing={5} mt={16} p={1}>
                    <div
                      className="w-[22vw] flex justify-center items-end px-20 py-10 cursor-pointer  hover:ring-2 hover:ring-gray-100 transition duration-700 ease-in-out"
                      style={{ backgroundImage: `url(${menexplore})`, backgroundSize: "cover", height: "40vh" }}
                      onClick={() => {
                        handleClose();
                        navigate("/collections/men");
                      }}
                    >
                      <span className="text-3xl text-center font-medium text-white">MEN</span>
                    </div>
                    <div
                      className="w-[22vw] flex justify-center items-end px-20 py-10 cursor-pointer  hover:ring-2 hover:ring-gray-100 transition duration-700 ease-in-out"
                      style={{ backgroundImage: `url(${womenexplore})`, backgroundSize: "cover", height: "40vh" }}
                      onClick={() => {
                        handleClose();
                        navigate("/collections/women");
                      }}
                    >
                      <span className="text-3xl text-center font-medium text-white">WOMEN</span>
                    </div>
                    <div
                      className="w-[22vw] flex justify-center items-end px-20 py-10 cursor-pointer  hover:ring-2 hover:ring-gray-100 transition duration-700 ease-in-out"
                      style={{ backgroundImage: `url(${unisexexplore})`, backgroundSize: "cover", height: "40vh" }}
                      onClick={() => {
                        handleClose();
                        navigate("/collections/unisex");
                      }}
                    >
                      <span className="text-3xl text-center font-medium text-white">UNISEX</span>
                    </div>
                  </SimpleGrid>
                )}
                {search !== "" && products.length === 0 && <span className="text-white text-2xl font-sans">No products found.</span>}
                {products.map((product) => (
                  <div key={product.id} className="flex flex-col justify-center items-center space-y-4">
                    <div className="flex lg:flex-row flex-col items-center space-y-4 lg:space-y-0 lg:space-x-8 px-4 py-4 rounded-2xl  w-[40vw]">
                      <div className="h-[140px] w-[140px] lg:h-[120px] lg:w-[120px] opacity-100  relative">
                        {product.totalStockAllWarehouses !== 0 ? (
                          <img src={`http://localhost:8000/public/${product.productImages[0].imageUrl}`} className="w-full h-full object-cover shadow-xl rounded-lg" loading="lazy" alt="Product Image" />
                        ) : (
                          <img src={`http://localhost:8000/public/${product.productImages[0].imageUrl}`} className="w-full h-full object-cover shadow-xl rounded-lg" alt="Product Image" loading="lazy" style={{ filter: "grayscale(100%)" }} />
                        )}

                        {product.totalStockAllWarehouses === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-30 w-full flex justify-center text-white p-1">
                              <span className="text-sm font-sans font-light">Out of Stock</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col text-center lg:text-left">
                        <span className="text-white lg:text-lg font-medium font-sans">
                          {product.name} ({product.gender})
                        </span>
                        <span className="text-white lg:text-lg font-medium font-sans">{formatToRupiah(product.price)}</span>
                      </div>
                      <div className="">
                        <Button
                          color="light"
                          size="small"
                          className="p-2 w-10 shadow-md"
                          as={Link}
                          to={`/products/${product.gender.toLowerCase()}/${product.categories[0].name.replace(/\s+/g, "-").toLowerCase()}/${product.categories[1].name.replace(/\s+/g, "-").toLowerCase()}/${product.name
                            .replace(/\s+/g, "-")
                            .toLowerCase()}`}
                          onClick={handleClose}
                        >
                          <PiMagnifyingGlassBold size={20} color="black" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile */}

            <div className="lg:hidden flex justify-center space-y-4 mt-8 h-[76vh] overflow-y-auto scrollbar-hide">
              <div className="flex justify-center space-y-4">
                {search === "" && (
                  <SimpleGrid columns={1} spacing={4} mt={4}>
                    <div
                      className="w-[70vw] flex justify-center items-end px-20 py-10 cursor-pointer"
                      style={{ backgroundImage: `url(${menexplore})`, backgroundSize: "cover", height: "20vh" }}
                      onClick={() => {
                        handleClose();
                        navigate("/collections/men");
                      }}
                    >
                      <span className="text-3xl text-center font-medium text-white">MEN</span>
                    </div>
                    <div
                      className="w-[70vw] flex justify-center items-end px-20 py-10 cursor-pointer"
                      style={{ backgroundImage: `url(${womenexplore})`, backgroundSize: "cover", height: "20vh" }}
                      onClick={() => {
                        handleClose();
                        navigate("/collections/women");
                      }}
                    >
                      <span className="text-3xl text-center font-medium text-white">WOMEN</span>
                    </div>
                    <div
                      className="w-[70vw] flex justify-center items-end px-20 py-10 cursor-pointer"
                      style={{ backgroundImage: `url(${unisexexplore})`, backgroundSize: "cover", height: "20vh" }}
                      onClick={() => {
                        handleClose();
                        navigate("/collections/unisex");
                      }}
                    >
                      <span className="text-3xl text-center font-medium text-white">UNISEX</span>
                    </div>
                  </SimpleGrid>
                )}
                {search !== "" && products.length === 0 && <span className="text-white text-2xl font-sans">No products found.</span>}
                <SimpleGrid columns={2} spacing={4} className="h-screen">
                  {products.map((product) => (
                    <div key={product.id} className="flex flex-col justify-center items-center space-y-4">
                      <div className="flex lg:flex-row flex-col items-center space-y-4 h-[36vh] px-4 py-4 rounded-2xl bg-black opacity-80 w-[40vw]">
                        <div className="h-[140px] w-[140px] lg:h-[100px] lg:w-[100px] relative">
                          {product.totalStockAllWarehouses !== 0 ? (
                            <img src={`http://localhost:8000/public/${product.productImages[0].imageUrl}`} className="w-full h-full object-cover shadow-xl rounded-lg" loading="lazy" alt="Product Image" />
                          ) : (
                            <img
                              src={`http://localhost:8000/public/${product.productImages[0].imageUrl}`}
                              className="w-full h-full object-cover shadow-xl rounded-lg"
                              alt="Product Image"
                              loading="lazy"
                              style={{ filter: "grayscale(100%)" }}
                            />
                          )}

                          {product.totalStockAllWarehouses === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black bg-opacity-30 w-full flex justify-center text-white p-1">
                                <span className="text-sm font-sans font-light">Out of Stock</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col text-center lg:text-left">
                          <span className="text-white text-md font-medium font-sans">
                            {product.name} ({product.gender})
                          </span>
                          <span className="text-white text-md font-medium font-sans">{formatToRupiah(product.price)}</span>
                        </div>
                        <div className="">
                          <Button
                            color="light"
                            size="small"
                            className="p-2 w-10 shadow-md"
                            as={Link}
                            to={`/products/${product.gender.toLowerCase()}/${product.categories[0].name.replace(/\s+/g, "-").toLowerCase()}/${product.categories[1].name.replace(/\s+/g, "-").toLowerCase()}/${product.name
                              .replace(/\s+/g, "-")
                              .toLowerCase()}`}
                            onClick={handleClose}
                          >
                            <PiMagnifyingGlassBold size={20} color="black" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </SimpleGrid>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}

export default SearchModal;
