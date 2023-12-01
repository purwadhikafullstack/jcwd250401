import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";

import CartSection from "../components/CartSection";

function CartPage() {
  const { gender, mainCategory, subCategory, productName } = useParams();

  return (
    <div className="w-full">
      <div className="px-6 lg:px-32 pt-4">
        <Breadcrumbs />
      </div>
      <div className="px-6 lg:px-32 mt-4">
        <CartSection />
      </div>
    </div>
  );
}

export default CartPage;
