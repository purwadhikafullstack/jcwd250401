import React, { useCallback } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ProductNavPage from "../components/ProductNavPage";
import ProductGrid from "../components/productGrid";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import Breadcrumbs from "../components/Breadcrumbs";

const HomeProducts = () => {
  // Accessing parameters from the URL

  return (
    <div className="w-full">
      <div className="px-32 pt-4">
        <Breadcrumbs />
      </div>
      <div className="px-32 flex justify-between">
        <ProductNavPage />
        <div className="mt-16">
          <ProductGrid />
        </div>
      </div>
    </div>
  );
};

export default HomeProducts;
