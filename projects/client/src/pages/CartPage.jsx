import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import CartGetter from "../components/CartGetter";

function CartPage() {
  const { gender, mainCategory, subCategory, productName } = useParams();

  return (
    <div className="w-full">
      <div className="px-6 lg:px-32 pt-4">
        <Breadcrumbs />
      </div>
      <div className="lg:px-32 mt-4">
        <CartGetter />
      </div>
    </div>
  );
}

export default CartPage;
