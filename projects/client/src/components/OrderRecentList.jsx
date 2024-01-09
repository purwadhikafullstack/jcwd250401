import React from "react";
import { Button } from "flowbite-react";
import { useState, useEffect } from "react";
import PaymentModal from "./PaymentModal";
import rejectPayment from "../api/order/rejectPayment";
import confirmOrder from "../api/order/confirmOrder";
import cancelOrder from "../api/order/cancelOrder";
import cancelUnpaidOrder from "../api/order/cancelUnpaidOrder";
import ProductDetailModal from "./ProductDetailModal";
import { FaEllipsisV } from "react-icons/fa";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { toast } from "sonner";
import confirmShip from "../api/order/confirmShip";

function OrderRecentList({ orders, fetchOrders }) {
  const [paymentModalIsOpen, setPaymentModalIsOpen] = useState(false);
  const [paymentProof, setPaymentProof] = useState("");
  const [productModalIsOpen, setProductModalIsOpen] = useState(false);
  const [Products, setProducts] = useState([]);

  const handleProductModalOpen = (products) => {
    setProducts(products);
    setProductModalIsOpen(true);
  };

  const handleProductModalClose = () => {
    setProductModalIsOpen(false);
  };

  const handleConfirmOrder = async (orderId, products) => {
    try {
      const response = await confirmOrder({ orderId, products });
      // Update state and UI based on response
      fetchOrders();
    } catch (error) {
      // Handle error
      if (error.response && (error.response.status === 404 || error.response.status === 500)) {
        toast.error(error.response.data.message);
      }
      console.error("Error confirming order:", error);
    }
  };

  const handleConfirmShip = async (orderId) => {
    try {
      const response = await confirmShip({ orderId });
      // Update state and UI based on response
      fetchOrders();
    } catch (error) {
      // Handle error
      console.error("Error confirming ship:", error);
    }
  };

  const handleCancelOrder = async (orderId, products) => {
    try {
      const response = await cancelOrder({ orderId, products });
      // Update state and UI based on response
      fetchOrders();
    } catch (error) {
      // Handle error
      console.error("Error cancelling order:", error);
    }
  };

  const handleRejectPayment = async (orderId) => {
    try {
      const response = await rejectPayment({ orderId });
      // Update state and UI based on response
      fetchOrders();
    } catch (error) {
      // Handle error
      console.error("Error rejecting payment:", error);
    }
  };

  const handlePaymentModalOpen = (paymentProof) => {
    setPaymentModalIsOpen(true);
    setPaymentProof(paymentProof);
  };

  const handlePaymentModalClose = () => {
    setPaymentModalIsOpen(false);
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
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto">
      {orders.length === 0 ? (
        <div className="flex justify-center items-center h-96">
          <p className="text-2xl">You don't have any orders yet.</p>
        </div>
      ) : (
        <>
          {orders.slice(0, 5).map(({ orderId, invoice, paymentProofImage, totalPrice, totalPriceBeforeCost, status, createdAt, totalQuantity, Products, Shipment, User, Address, Warehouse, Pagination }, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-lg w-[1000px] lg:w-[100%] mb-5 lg:mb-5 overflow-auto">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  {status === "cancelled" && <span className="bg-[#FF7A7A66] text-[#FF0000]  px-6 py-2 rounded-md font-bold">Cancelled</span>}
                  {status === "unpaid" && <span className="bg-[#DAD32F] text-[#A5A816]  px-6 py-2 rounded-md font-bold">Unpaid</span>}
                  {status === "waiting-for-confirmation" && <span className="bg-[#16D6B333] text-[#16D6B3]  px-6 py-2 rounded-md font-bold">Waiting for Confirmation</span>}
                  {status === "ready-to-ship" && <span className="bg-[#E697FF66] text-[#A155B9]  px-6 py-2 rounded-md font-bold">Ready to Ship</span>}
                  {status === "on-delivery" && <span className="bg-[#165BAA] text-[#CAFFE9]  px-6 py-2 rounded-md font-bold">On Delivery</span>}
                  {status === "delivered" && <span className="bg-[#7AFFC766] text-[#1DDD8D]  px-6 py-2 rounded-md font-bold">Delivered</span>}
                  <p>
                    {invoice} / {new Date(createdAt).toLocaleDateString()} / {Warehouse.name}{" "}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button color="light" size="small" className="p-2 w-52 shadow-sm" onClick={() => handlePaymentModalOpen(paymentProofImage)}>
                    Payment Proof
                  </Button>
                    <Menu>
                      <MenuButton className="focus:outline-none">
                        <FaEllipsisV className="text-xl" />
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={() => handleProductModalOpen(Products)}>Products Details</MenuItem>
                        {status !== "cancelled" && status !== "delivered" && status !== "on-delivery" && (
                          <>
                            {status === "unpaid" || status === "waiting-for-confirmation" ? (
                              <MenuItem onClick={() => cancelUnpaidOrder(orderId)}>Cancel Order</MenuItem>
                            ) : (
                              <MenuItem onClick={() => handleCancelOrder(orderId, Products)}>Cancel Order</MenuItem>
                            )}
                          </>
                        )}
                      </MenuList>
                    </Menu>
                </div>
              </div>
              <hr className="my-2" />
              <div className="flex mt-4 mb-4">
                <div className="Products">
                  {Products.map(({ Product, quantity }, index) => (
                    <div key={index} className="flex gap-2 mb-4">
                      <img src={`http://localhost:8000/public/${Product.productImages[0].imageUrl}`} alt="" className="w-20 h-20 object-cover rounded-md" />
                      <div className="ml-2">
                        <p className="text-sm font-bold">{Product.productName}</p>
                        <p className="text-sm">
                          {formatToRupiah(Product.productPrice)} x {quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="ml-10">
                  <div className="mb-5">
                    <p className="font-bold">Customer</p>
                    {User.firstName && User.lastName ? (
                      <p>
                        {User.firstName} {User.lastName}
                      </p>
                    ) : (
                      <p>{User.username}</p>
                    )}
                  </div>
                  <div className="mb-5">
                    <p className="font-bold">Total Checkout</p>
                    <p>{formatToRupiah(totalPriceBeforeCost)}</p>
                  </div>
                </div>
                <div className="ml-20">
                  <div className="mb-5">
                    <p className="font-bold">Sent From</p>
                    <p>{Warehouse.name}</p>
                  </div>
                  <div className="mb-5">
                    <p className="font-bold">Delivery Option</p>
                    <p>{Shipment.name}</p>
                    <p>{formatToRupiah(Shipment.cost)}</p>
                  </div>
                </div>
                <div className="ml-auto">
                  <div className="mb-5">
                    <p className="font-bold">Shipping Information</p>
                    <p className="text-sm w-[25vw]">{`${Address.firstName} ${Address.lastName} (${Address.phoneNumber})`}</p>
                    <p className="text-sm w-[25vw]">
                      {Address.street}, {Address.subDistrict}, {Address.district}
                    </p>
                    <p className="text-sm w-[25vw]">
                      {Address.city}, {Address.province}
                    </p>
                  </div>
                </div>
              </div>
              <hr className="my-2" />
              <div className="flex ml-2 mr-2">
                <p className="text-lg font-bold">TOTAL</p>
                <p className="text-lg font-bold ml-auto">{formatToRupiah(totalPrice)}</p>
              </div>
              {status === "waiting-for-confirmation" && (
                <>
                  <hr className="my-2" />
                  <div className="flex justify-end gap-2">
                    {/* Action buttons here, if needed */}
                    <div className="flex flex-row items-center space-y-0 space-x-4">
                      <Button color="light" size="small" className="p-2 w-52 shadow-sm" onClick={() => handleRejectPayment(orderId)}>
                        Reject Order
                      </Button>
                      <Button color="dark" size="small" className="p-2 w-52 shadow-sm" onClick={() => handleConfirmOrder(orderId, Products)}>
                        Accept Order
                      </Button>
                    </div>
                  </div>
                </>
              )}
              {status === "ready-to-ship" && (
                <>
                  <hr className="my-2" />
                  <div className="flex justify-end gap-2">
                    {/* Action buttons here, if needed */}
                    <div className="flex flex-row items-center space-y-0 space-x-4">
                      <Button color="dark" size="small" className="p-2 w-52 shadow-sm" onClick={() => handleConfirmShip(orderId)}>
                        Ship Order
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </>
      )}
      <PaymentModal isOpen={paymentModalIsOpen} onClose={handlePaymentModalClose} paymentProof={paymentProof} />
      <ProductDetailModal isOpen={productModalIsOpen} onClose={handleProductModalClose} Products={Products} />
    </div>
  );
}

export default OrderRecentList;
