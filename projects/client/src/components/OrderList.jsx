import React from 'react';
import { Button } from 'flowbite-react';
import { useState, useEffect } from 'react';
import PaymentModal from './PaymentModal';
import rejectPayment from '../api/order/rejectPayment';
import confirmOrder from '../api/order/confirmOrder';

function OrderList({ orders, fetchOrders }) { 
  const [paymentModalIsOpen, setPaymentModalIsOpen] = useState(false);
  const [paymentProof, setPaymentProof] = useState('');

  const handleConfirmOrder = async (orderId, productId) => {
    try {
      const response = await confirmOrder({ orderId, productId });
      // Update state and UI based on response
      fetchOrders();
    } catch (error) {
      // Handle error
      console.error('Error confirming order:', error);
    }
  };

  const handleRejectPayment = async (orderId) => {
    try {
      const response = await rejectPayment({ orderId });
      // Update state and UI based on response
      fetchOrders();
    } catch (error) {
      // Handle error
      console.error('Error rejecting payment:', error);
    }
  };

  const handlePaymentModalOpen = (paymentProof) => {
    setPaymentModalIsOpen(true);
    setPaymentProof(paymentProof);
  }

  const handlePaymentModalClose = () => {
    setPaymentModalIsOpen(false);
  }

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
    <div className="container mx-auto px-4">
      {orders.length === 0 ? (
        <div className="flex justify-center items-center h-96">
          <p className="text-2xl">You don't have any orders yet.</p>
        </div>
      ) : (
      <>
      {orders.map(({ Order, Product, quantity, createdAt, paymentProofImage }, index) => (
        <div key={index} className="p-4 bg-white rounded-lg shadow-lg w-[1000px] lg:w-[100%] mb-5 lg:mb-5">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              {Order.status === "waiting-for-payment" && <span className="bg-[#7AFFC766] text-[#15c079cb] py-1 px-2 rounded-md font-bold">Waiting for Payment</span>}
              {Order.status === "waiting-for-confirmation" && <span className="bg-[#7AFFC766] text-[#15c079cb] py-1 px-2 rounded-md font-bold">Waiting for Payment Confirmation</span>}
              {Order.status === "processed" && <span className="bg-[#7AFFC766] text-[#15c079cb] py-1 px-2 rounded-md font-bold">Order Processed</span>}
              {Order.status === "waiting-approval" && <span className="bg-[#7AFFC766] text-[#15c079cb] py-1 px-2 rounded-md font-bold">Waiting User Approval</span>}
              {Order.status === "shipped" && <span className="bg-[#7AFFC766] text-[#15c079cb] py-1 px-2 rounded-md font-bold">Shipped</span>}
              <p>ID {Order.id} / {new Date(createdAt).toLocaleDateString()} / {Order.warehouse.warehouseName} </p>
            </div>
            <div className="flex items-center gap-2">
              <Button color="light" size="small" className="md:p-2 w-full md:w-52 shadow-sm" onClick={() => handlePaymentModalOpen(paymentProofImage)}>
                Payment Proof
              </Button>
            </div>
          </div>
          <hr className="my-2" />
          <div className="flex mt-4 mb-4">
            <img src={`http://localhost:8000/public/${Product.productImages[0].imageUrl}`} alt={Product.productName} className="w-20 h-20 object-cover" />
            <div className="ml-2">
              <p className="text-sm font-bold">{Product.productName}</p>
              <p className="text-sm">{Product.productGender}</p>
              <p className="text-sm">{formatToRupiah(Product.productPrice)} x {quantity}</p>
            </div>
            <div className="ml-10">
              <div className='mb-5'>
                <p className="font-bold">Customer</p>
                  {Order.user.firstName && Order.user.lastName ? (
                    <p>{Order.user.firstName} {Order.user.lastName}</p>
                  ) : (
                    <p>{Order.user.username}</p>
                  )}
              </div>
              <div className='mb-5'>
                <p className="font-bold">Total Checkout</p>
                <p>{quantity}</p>
              </div>
            </div>
            <div className="ml-20">
              <div className='mb-5'>
                <p className="font-bold">Sent From</p>
                <p>{Order.warehouse.warehouseName}</p>
              </div>
              <div className='mb-5'>
                <p className="font-bold">Delivery Option</p>
                <p>{Order.shipment.shipmentName}</p>
                <p>{formatToRupiah(Order.shipment.shipmentCost)}</p>
              </div>
            </div>
            <div className="ml-auto">
              <div className='mb-5'>
                <p className="font-bold">Shipping Information</p>
                <p className="text-sm w-[25vw]">{`${Order.shipment.address.firstName} ${Order.shipment.address.lastName} (${Order.shipment.address.phoneNumber})`}</p>
                <p className="text-sm w-[25vw]">{Order.shipment.address.street}, {Order.shipment.address.subDistrict}, {Order.shipment.address.district}</p>
                <p className="text-sm w-[25vw]">{Order.shipment.address.city}, {Order.shipment.address.province}</p>
              </div>
            </div>
          </div>
          <hr className="my-2" />
          <div className='flex ml-2 mr-2'>
            <p className="text-lg font-bold">TOTAL</p>
            <p className="text-lg font-bold ml-auto">{formatToRupiah(Order.totalPrice)}</p>
          </div>
          {Order.status === "waiting-for-confirmation" && (
            <>
              <hr className="my-2" /> 
              <div className="flex justify-end gap-2">
                {/* Action buttons here, if needed */}
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                  <Button color="light" size="small" className="md:p-2 w-full md:w-52 shadow-sm" onClick={() => handleRejectPayment(Order.id)}>
                    Reject Order
                  </Button>
                  <Button color="dark" size="small" className="md:p-2 w-full md:w-52 shadow-sm" onClick={() => handleConfirmOrder(Order.id, Product.id)}>
                    Accept Order
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
      </>)}
      <PaymentModal isOpen={paymentModalIsOpen} onClose={handlePaymentModalClose} paymentProof={paymentProof} />
    </div>
  );
}

export default OrderList;