import { Button } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import getCart from "../api/cart/getCart";
import { showLoginModal } from "../slices/authModalSlices";
import { toast } from "sonner";

function OrderSummary({ shippingCost, onCartItem, onTotalPrice, onQuantityProduct}) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [carts, setCarts] = useState([]);
  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
  const dispatch = useDispatch();

  const fetchCarts = useCallback(async () => {
    try {
      const result = await getCart({});
      setCarts(result.detail.CartItems);
      const cartItemsData = result.detail.CartItems
      .filter((cart) => cart.quantity > 0)
      .map((cart) => ({
        cartId: cart.cartId,
        productId: cart.Product.id,
        quantity: cart.quantity,
      }));

      onCartItem(cartItemsData);

      
      // Calculate total price and quantity
      calculateTotal(result.detail.CartItems);
    } catch (error) {
      if (error?.response?.status === 404) {
        setCarts([]);
      } else if (error.response && error.response.status === 401) {
        dispatch(showLoginModal());
        navigate("/");
        setCarts([]);
        setTotalPrice(0);
        setTotalQuantity(0);
        toast.error(error.response.data.message, {
          description: error.response.data.detail,
        });
      } else if (error.response && error.response.status === 403) {
        dispatch(showLoginModal());
        navigate("/");
        setCarts([]);
        setTotalPrice(0);
        setTotalQuantity(0);
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
  }, [isLoggedIn]);

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

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  const navigate = useNavigate();
  const formatToRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const cost  = shippingCost[1];
  onTotalPrice(totalPrice + cost);
  
  onQuantityProduct(totalQuantity);

  return (
    <>
      {shippingCost.length !== 0 ? (
        <div className="mt-2 lg:mt-4 p-6 flex flex-col h-72 border rounded-md lg:w-[30vw] bg-white">
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
              <span className="text-md ">Delivery cost:</span>
              <span>{formatToRupiah(cost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-md font-bold ">Subtotal:</span>
              <span className="text-md font-bold">{formatToRupiah(totalPrice + cost)}</span>
            </div>
          </div>
          <div className="flex mt-6 ">
            <span className="text-sm">Prices and delivery cost are not confirmed until you've choose delivery options.</span>
          </div>
        </div>
      ) : (
        <div className="mt-2 lg:mt-4 p-6 flex flex-col h-62 border rounded-md lg:w-[30vw] bg-white">
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
          <div className="flex mt-6 ">
            <span className="text-sm">Prices and delivery cost are not confirmed until you've choose delivery options.</span>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderSummary;
