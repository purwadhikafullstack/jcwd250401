import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import CartSection from "../components/CartSection";
import OrderSummary from "../components/OrderSummary";
import CartBreadcrumbs from "../components/CartBreadcrumbs";

function CheckoutPage() {
  return (
    <div className="w-full">
      <div className="px-6 lg:px-32 pt-4">
        <CartBreadcrumbs />
      </div>
      <div className="px-6 lg:px-32 mt-4">
        <OrderSummary />
      </div>
    </div>
  );
}

export default CheckoutPage;
