import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ProductNavPage from "../components/ProductNavPage";
import ProductGrid from "../components/productGrid";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import getProductsUser from "../api/products/getProductsUser";
import { toast } from "sonner";
import ProductCard from "../components/productCard";
import ProductsBreadcrumbs from './../components/ProductsBreadcrumbs';

const HomeProducts = () => {
  const { gender, mainCategory, subCategory, productName } = useParams();

  return (
    <div className="w-full">
      <div className="px-6 lg:px-32 pt-4">
        <ProductsBreadcrumbs />
      </div>
      {!productName ? (
        <div className="px-6 lg:px-32 flex flex-col lg:flex-row justify-between">
          <ProductNavPage />
          <div className="mt-4 lg:mt-4">
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
