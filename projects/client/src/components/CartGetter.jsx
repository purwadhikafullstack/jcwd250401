import { useCallback, useEffect, useState } from "react";
import getCart from "../api/cart/getCart";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoginModal } from "../slices/authModalSlices";
import { NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/react";
import { Button } from "flowbite-react";
import { PiTrash } from "react-icons/pi";
import DeleteCartItemModal from "./DeleteCartItemModal";

function CartGetter() {
  const [carts, setCarts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openDeleteCartModal, setOpenDeleteCartModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});

  const fetchCarts = useCallback(async () => {
    try {
      const result = await getCart({});
      setCarts(result.detail.CartItems);
      // Calculate total price and quantity
      calculateTotal(result.detail.CartItems);
    } catch (error) {
      if (error?.response?.status === 404) {
        setCarts([]);
      } else if (error.response && error.response.status === 401) {
        dispatch(showLoginModal());
        toast.error(error.response.data.message, {
          description: error.response.data.detail,
        });
      } else if (error.response && error.response.status === 403) {
        dispatch(showLoginModal());
        toast.error(error.response.data.message, {
          description: error.response.data.detail,
        });
      } else if (error.request) {
        // Handle request errors
        setTimeout(() => {
          toast.error("Network error, please try again later");
        }, 2000);
      }
    }
  }, []);

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

  const handleQuantityChange = (newQuantity, cartIndex) => {
    // Update the quantity in the state
    const updatedCarts = [...carts];
    updatedCarts[cartIndex].quantity = newQuantity;
    setCarts(updatedCarts);

    // Recalculate total price and quantity
    calculateTotal(updatedCarts);
  };

  const formatToRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  const toggleDeleteModal = (cart) => {
    setSelectedProduct(cart);
    setOpenDeleteCartModal(!openDeleteCartModal);
  };

  return (
    <div className="w-full">
      <span className="text-2xl font-bold"> Shopping Cart</span>
      <div className="flex justify-between">
        <div className="flex mt-8 flex-col space-y-4 h-60 overflow-y-scroll scrollbar-hide">
          {carts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-600 text-lg">No items found.</p>
            </div>
          )}
          {carts.map((cart, index) => (
            <div className="flex flex-col w-[52vw]" key={index}>
              <div className="flex gap-4">
                <div className="w-[180px] h-[180px]">
                  <img className="w-full h-full object-cover" loading="lazy" src={`http://localhost:8000/public/${cart.Product.productImages[0].imageUrl}`} />
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{cart.Product.name}</span>
                    <PiTrash size={24} className="mr-2  cursor-pointer" onClick={() => toggleDeleteModal(cart)} />
                  </div>

                  <span className="text-sm mt-1">SKU: {cart.Product.sku}</span>
                  <span className="text-sm mt-1">Size: All Size</span>
                  <span className="text-sm font-bold mt-2">{formatToRupiah(cart.Product.price)}</span>
                  <div className="flex flex-col mt-2 space-y-2">
                    <span className="font-bold text-md">Quantity</span>
                    <div className="flex items-center space-x-32">
                      <NumberInput defaultValue={cart.quantity} size={"md"} min="0" onChange={(valueString) => handleQuantityChange(Number(valueString), index)}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <span className="font-bold text-md">Subtotal: {formatToRupiah(cart.Product.price * cart.quantity)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[94%] mt-14 mb-1 border-t border border-gray-200"></div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-6 flex flex-col h-62 border rounded-md w-[30vw]">
          <div className="flex-col space-y-2">
            <span className="font-bold text-2xl">Order Summary {totalQuantity} item(s) </span>
            <div className="flex justify-between">
              <span className="text-md ">Item(s) subtotal:</span>
              <span>{formatToRupiah(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-md ">Tax included:</span>
              <span>{formatToRupiah(totalPrice * 0.1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-md font-bold ">Subtotal:</span>
              <span className="text-md font-bold">{formatToRupiah(totalPrice)}</span>
            </div>
          </div>

          <div className="flex mt-6 flex-col space-y-2">
            <Button className="w-full bg-gray-900 enabled:hover:bg-gray-700" size="lg" onClick={() => console.log("opening cart")}>
              Checkout
            </Button>
            <span className="text-sm">Prices and delivery cost are not confirmed until you've reached the checkout.</span>
          </div>
        </div>
      </div>
      {openDeleteCartModal && <DeleteCartItemModal isOpen={openDeleteCartModal} data={selectedProduct} isClose={toggleDeleteModal} onSuccess={() => fetchCarts()} />}
    </div>
  );
}

export default CartGetter;
