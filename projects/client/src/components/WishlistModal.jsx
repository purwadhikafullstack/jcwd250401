import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { PiEye, PiMagnifyingGlassBold, PiTrash } from "react-icons/pi";
import { toast } from "sonner";
import _debounce from "lodash/debounce";
import getProductsUser from "../api/products/getProductsUser";
import { Button } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import rains from "../assets/rains.png";
import menexplore from "../assets/menjackets.jpg";
import womenexplore from "../assets/womensearch.jpg";
import unisexexplore from "../assets/unisexsearch.jpg";
import getWishlist from "../api/Wishlist/getWishlist";
import DeleteWishlistItem from "./DeleteWishlishItem";

function WishlistModal({ isOpen, isClose }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [openDeleteWishlistModal, setOpenDeleteWishlistModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [key, setKey] = useState(0);

  const fetchProduct = useCallback(async () => {
    try {
      const result = await getWishlist({});
      setProducts(result.detail.WishlistProducts);

      console.log(result.detail.WishlistProducts);
    } catch (error) {
      if (error?.response?.status === 404) {
        setProducts([]);
      } else if (error.request) {
        setTimeout(() => {
          toast.error("Network error, please try again later");
        }, 2000);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchProduct();
    }
  }, [key, isOpen]);

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };
  const handleClose = () => {
    isClose();
    setKey((prevKey) => prevKey + 1); // Change the key to force a remount
  };

  const toggleDeleteModal = (product) => {
    setSelectedProductId(product);
    setOpenDeleteWishlistModal(!openDeleteWishlistModal);
  };

  return (
    <Modal key={key} closeOnOverlayClick={false} isOpen={isOpen} size="full" onClose={handleClose} motionPreset="slideInTop" isCentered>
      <ModalOverlay />
      <ModalContent bg="rgba(0, 0, 0, 0.7)" backdropFilter="blur(4px)">
        <ModalHeader />
        <ModalCloseButton color="white" />
        <ModalBody>
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center space-y-2">
              <img
                src={rains}
                alt="rains"
                className="lg:w-[15%] w-[30%] invert mb-4 cursor-pointer"
                onClick={() => {
                  handleClose();
                  navigate("/");
                }}
              />
              <span className="text-white text-2xl font-semibold">My Wishlist </span>
            </div>
            <div className="hidden lg:flex flex-col space-y-4 mt-10 h-[60vh] overflow-y-auto">
              <div className="flex flex-col justify-center items-center space-y-4">
                {products?.length === 0 && <span className="text-white text-2xl font-sans">No products on wishlist.</span>}
                {products?.map((product) => (
                  <div key={product.id} className="flex flex-col justify-center items-center space-y-4">
                    <div className="flex lg:flex-row flex-col items-center space-y-4 lg:space-y-0 lg:space-x-8 px-4 py-4 rounded-2xl  w-[40vw]">
                      <div className="h-[140px] w-[140px] lg:h-[120px] lg:w-[120px] opacity-100 relative">
                        {product.totalStockAllWarehouses !== 0 ? (
                          <img src={`http://localhost:8000/public/${product.Product.productImages[0].imageUrl}`} className="w-full h-full object-cover shadow-xl rounded-lg" loading="lazy" alt="Product Image" />
                        ) : (
                          <img
                            src={`http://localhost:8000/public/${product.Product.productImages[0].imageUrl}`}
                            className="w-full h-full object-cover shadow-xl rounded-lg"
                            alt="Product Image"
                            loading="lazy"
                            style={{ filter: "grayscale(100%)" }}
                          />
                        )}

                        {product.Product.totalStockAllWarehouses === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-30 w-full flex justify-center text-white p-1">
                              <span className="text-sm font-sans font-light">Out of Stock</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col text-center lg:text-left">
                        <span className="text-white lg:text-lg font-medium font-sans">
                          {product.Product.name} ({product.Product.gender})
                        </span>
                        <span className="text-white lg:text-lg font-medium font-sans">{formatToRupiah(product.Product.price)}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          color="light"
                          size="small"
                          className="p-2 w-10 shadow-md"
                          as={Link}
                          to={`/products/${product.Product.gender.toLowerCase()}/${product.Product.Categories[0].name.replace(/\s+/g, "-").toLowerCase()}/${product.Product.Categories[1].name
                            .replace(/\s+/g, "-")
                            .toLowerCase()}/${product.Product.name.replace(/\s+/g, "-").toLowerCase()}`}
                          onClick={handleClose}
                        >
                          <PiMagnifyingGlassBold size={20} color="black" />
                        </Button>
                        <Button
                          color="light"
                          size="small"
                          className="p-2 w-10 shadow-md"
                          onClick={() => {
                            toggleDeleteModal(product.productId);
                          }}
                        >
                          <PiTrash size={20} color="black" />
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
                {products?.length === 0 && <span className="text-white text-2xl font-sans">No products on wishlist.</span>}
                <SimpleGrid columns={2} spacing={4} className="h-screen">
                  {products?.map((product) => (
                    <div key={product.id} className="flex flex-col justify-center items-center space-y-4">
                      <div className="flex lg:flex-row flex-col items-center space-y-4 h-[36vh] px-4 py-4 rounded-2xl bg-black opacity-80 w-[40vw]">
                        <div className="h-[140px] w-[140px] lg:h-[100px] lg:w-[100px] relative">
                          {product.totalStockAllWarehouses !== 0 ? (
                            <img src={`http://localhost:8000/public/${product.Product.productImages[0].imageUrl}`} className="w-full h-full object-cover shadow-xl rounded-lg" loading="lazy" alt="Product Image" />
                          ) : (
                            <img
                              src={`http://localhost:8000/public/${product.Product.productImages[0].imageUrl}`}
                              className="w-full h-full object-cover shadow-xl rounded-lg"
                              alt="Product Image"
                              loading="lazy"
                              style={{ filter: "grayscale(100%)" }}
                            />
                          )}

                          {product.Product.totalStockAllWarehouses === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black bg-opacity-30 w-full flex justify-center text-white p-1">
                                <span className="text-sm font-sans font-light">Out of Stock</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col text-center lg:text-left">
                          <span className="text-white text-md font-medium font-sans">
                            {product.Product.name} ({product.Product.gender})
                          </span>
                          <span className="text-white text-md font-medium font-sans">{formatToRupiah(product.Product.price)}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            color="light"
                            size="small"
                            className="p-2 w-10 shadow-md"
                            as={Link}
                            to={`/products/${product.Product.gender.toLowerCase()}/${product.Product.Categories[0].name.replace(/\s+/g, "-").toLowerCase()}/${product.Product.Categories[1].name
                              .replace(/\s+/g, "-")
                              .toLowerCase()}/${product.Product.name.replace(/\s+/g, "-").toLowerCase()}`}
                            onClick={handleClose}
                          >
                            <PiMagnifyingGlassBold size={20} color="black" />
                          </Button>
                          <Button
                            color="light"
                            size="small"
                            className="p-2 w-10 shadow-md"
                            onClick={() => {
                              toggleDeleteModal(product.productId);
                            }}
                          >
                            <PiTrash size={20} color="black" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </SimpleGrid>
              </div>
            </div>
          </div>
          <DeleteWishlistItem isOpen={openDeleteWishlistModal} isClose={toggleDeleteModal} productId={selectedProductId} onSuccess={fetchProduct} />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}

export default WishlistModal;
