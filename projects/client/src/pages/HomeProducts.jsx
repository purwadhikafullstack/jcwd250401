import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import ProductNavPage from "../components/ProductNavPage";


const HomeProducts = () => {
  // Accessing parameters from the URL
  const { gender, category, subCategory, productName } = useParams();

  return (
    <div className="w-full">
      <div className="pl-44 pt-6">
        <ProductNavPage />
      </div>
    </div>
  );
};

export default HomeProducts;
