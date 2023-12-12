import React from 'react';
import { Button } from 'flowbite-react';

function OrderList({ orders, fetchOrders }) {
  const formatToRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4">
      {orders.map(({ Order, Product, quantity, createdAt }, index) => (
        <div key={index} className="p-4 bg-white rounded-lg shadow-lg w-[1000px] lg:w-[100%] mb-5 lg:mb-5">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              {Order.status === "Waiting for Payment" && <span className="bg-[#7AFFC766] text-[#15c079cb] py-1 px-2 rounded-md font-bold">Waiting for Payment</span>}
              <p>ID {Order.id} / {new Date(createdAt).toLocaleDateString()} / {Order.warehouse.warehouseName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button color="light" size="small" className="md:p-2 w-full md:w-52 shadow-sm">
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
              <p className="font-bold">Quantity</p>
              <p>{quantity}</p>
            </div>
            <div className="ml-20">
              <p className="font-bold">Status</p>
              <p>{Order.status}</p>
            </div>
            <div className="ml-auto">
              <p className="font-bold">Product Details</p>
              <p className="text-sm w-[25vw]">{Product.productDescription}</p>
            </div>
          </div>
          <hr className="my-2" />
          <div className='flex ml-2 mr-2'>
            <p className="text-lg font-bold">TOTAL</p>
            <p className="text-lg font-bold ml-auto">{formatToRupiah(Order.totalPrice)}</p>
          </div>
          <hr className="my-2" /> 
          <div className="flex justify-end gap-2">
            {/* Action buttons here, if needed */}
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <Button color="light" size="small" className="md:p-2 w-full md:w-52 shadow-sm">
                Reject Order
              </Button>
              <Button color="dark" size="small" className="md:p-2 w-full md:w-52 shadow-sm">
                Accept Order
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderList;