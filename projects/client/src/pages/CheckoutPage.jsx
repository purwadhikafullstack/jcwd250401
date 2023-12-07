import React from "react";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import CartSection from "../components/CartSection";
import OrderSummary from "../components/OrderSummary";
import CartBreadcrumbs from "../components/CartBreadcrumbs";
import DeliveryOptions from "../components/DeliveryOptions"; // Import the DeliveryOptions component
import Footer from "../components/Footer";
import PaymentOptions from "../components/PaymentOptions";

function CheckoutPage() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handlePaymentOpen = () => {
    setIsPaymentOpen(true);
  };

  const handlePaymentClose = () => {
    setIsPaymentOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="px-6 lg:px-32 pt-4">
        <CartBreadcrumbs />
      </div>
      <div className="px-6 w-full lg:pl-32 mt-4 flex lg:flex-row flex-col justify-between">
        {/* Main content area with DeliveryOptions, adjusted for responsive width */}
        <div className="w-full lg:flex-col">
          <DeliveryOptions handlePaymentOpen={handlePaymentOpen} />
          {!isPaymentOpen && (
            <div className="mt-2 lg:mt-4 p-6 flex flex-col h-62 border rounded-md lg:w-[48vw]  bg-gray-200">
              <h2 className="font-bold text-xl mb-2">2. Payment Method</h2>
            </div>
          )}
          {isPaymentOpen && (
            <PaymentOptions />
          )}
        </div>
        {/* Sidebar area with OrderSummary */}
        <div className="w-full lg:px-6 flex justify-start lg:justify-center lg:h-64">
          <OrderSummary />
        </div>
      </div>
      <div className="mt-32">
        <Footer />
      </div>
    </div>
  );
}

export default CheckoutPage;
