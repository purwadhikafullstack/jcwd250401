import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

function CartSummary({ totalPrice, totalQuantity }) {
  const navigate = useNavigate();
  const formatToRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="mt-2 lg:mt-4 p-6 flex flex-col h-62 border rounded-md lg:w-[30vw]">
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
        <Button className="w-full bg-gray-900 enabled:hover:bg-gray-700" size="lg" onClick={() => navigate("/account/shopping-cart/checkout")}>
          Checkout
        </Button>
        <span className="text-sm">Prices and delivery cost are not confirmed until you've reached the checkout.</span>
      </div>
    </div>
  );
}

export default CartSummary;
