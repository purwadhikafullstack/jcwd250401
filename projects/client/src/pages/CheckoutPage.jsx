import React from "react";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import CartSection from "../components/CartSection";
import OrderSummary from "../components/OrderSummary";
import CartBreadcrumbs from "../components/CartBreadcrumbs";
import DeliveryOptions from "../components/DeliveryOptions"; // Import the DeliveryOptions component

function CheckoutPage() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);


  const handlePaymentOpen = () => {
    setIsPaymentOpen(true);
  };

  const handlePaymentClose = () => {
    setIsPaymentOpen(false);
  }

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="px-6 lg:px-32 pt-4">
        <CartBreadcrumbs />
      </div>
      <div className="container mx-auto px-6 lg:px-32 mt-4 flex flex-wrap md:flex-nowrap">
        {/* Main content area with DeliveryOptions, adjusted for responsive width */}
        <div className="w-full lg:flex-1 lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mb-6 md:mb-0">
          <DeliveryOptions />
          {!isPaymentOpen && (
            <div className="mt-2 lg:mt-4 p-6 flex flex-col h-62 border rounded-md lg:w-[40vw]  bg-gray-200">
              <h2 className="font-bold text-xl mb-2">2. Payment Method</h2>
            </div>
          )}
        </div>
        {/* Sidebar area with OrderSummary */}
        <div className="w-full lg:w-1/3 xl:w-1/4">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
