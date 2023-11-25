import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ProductNavPage from "../components/ProductNavPage";
import ProductGrid from "../components/productGrid";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import Breadcrumbs from "../components/Breadcrumbs";
import getProductsUser from "../api/products/getProductsUser";
import { toast } from "sonner";
import ProductCard from "../components/productCard";

const HomeProducts = () => {
  const { gender, mainCategory, subCategory, productName } = useParams();

  return (
    <div className="w-full">
      <div className="px-32 pt-4">
        <Breadcrumbs />
      </div>
      {!productName ? (
        <div className="px-32 flex justify-between">
          <ProductNavPage />
          <div className="mt-16">
            <ProductGrid />
          </div>
        </div>
      ) : (
        <ProductCard />
      )}
    </div>
  );
};

export default HomeProducts;
