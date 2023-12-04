import React from 'react';
import { Button } from 'flowbite-react';
import getAllOrders from '../api/order/getAllOrder';

function OrderList({ orders, fetchOrders }) {
  return (
    <div className="container mx-auto px-4">
      {orders.map(({ Order, Product, quantity, createdAt }) => (
        <div key={Order.id} className="bg-white shadow rounded-lg p-6 mb-4 flex flex-col">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="text-lg font-semibold text-gray-700">{Order.status}</div>
              <div className='flex flex-row md:flex-row md:items-center space-y-0 md:space-y-0 md:space-x-4'>
                <div className="text-sm text-gray-500">{Order.warehouse.warehouseName}</div>
                <div className="text-sm text-gray-500">{new Date(createdAt).toLocaleString()}</div>
              </div>
            </div>
            <Button color="light" size="small" className="md:p-2 w-full md:w-52 shadow-sm">
              Payment Proof
            </Button>
          </div>
          <div className="flex flex-col items-center md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <img
              src={`http://localhost:8000/public/${Product.productImages[0].imageUrl}`}
              alt="Product"
              className="w-1/2 md:w-20 h-20 object-cover rounded-md"
            />
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{Product.productName}</span>
              <span className="text-gray-500">Quantity: {quantity}</span>
              <span className="text-gray-500">User ID: {Order.userId}</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between mt-4 pt-4 border-t">
            <span className="text-sm font-medium text-gray-500">Total: Rp{Order.totalPrice.toLocaleString()}</span>
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
};

export default OrderList;