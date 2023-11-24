import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ProductNavPage from "../components/ProductNavPage";
import ProductGrid from "../components/productGrid";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import Breadcrumbs from "../components/Breadcrumbs";
import getProductsUser from "../api/products/getProductsUser";
import { toast } from "sonner";

const HomeProducts = () => {
  const { gender, mainCategory, subCategory, productName } = useParams();
  const [selectedProduct, setSelectedProduct] = useState([]);

  const formatSubCategory = (subCategory) => {
    const words = subCategory.split("-");
    const formattedSubCategory = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    return formattedSubCategory;
  };

  const formatProductName = (productName) => {
    const words = productName.split("-");
    const formattedProductName = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    return formattedProductName;
  };

  const fetchProducts = useCallback(async () => {
    try {
      const category = subCategory ? formatSubCategory(subCategory) : mainCategory;
      const result = await getProductsUser({
        category,
        filterBy: gender,
        productName: formatProductName(productName),
      });

      setSelectedProduct(result.details);
    } catch (error) {
      if (error?.response?.status === 404) {
        setSelectedProduct([]);
      } else if (error.request) {
        setTimeout(() => {
          toast.error("Network error, please try again later");
        }, 2000);
      }
    }
  }, [gender, mainCategory, subCategory, productName]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
        <div>INI ADA PRODUCTNYA</div>
      )}
    </div>
  );
};

export default HomeProducts;
