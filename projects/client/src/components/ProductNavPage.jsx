import React, { useCallback, useState } from "react";
import Navigationbar from "./Navigationbar";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { useEffect } from "react";
import api from "../api";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import getProductsCountsUser from "../api/products/getProductsCountsUser";

export const ProductNavPage = () => {
  const { gender, mainCategory, subCategory, productName } = useParams();
  const [categories, setCategories] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    try {
      const result = await getProductsCountsUser({
        category: mainCategory,
        filterBy: gender,
      });
      const totalData = result.pagination.totalData;
      setTotalData(totalData);
    } catch (error) {
      if (error?.response?.status === 404) {
        setTotalData(0);
      } else if (error.request) {
        // Handle request errors
        setTimeout(() => {
          toast.error("Network error, please try again later");
        }, 2000);
      }
    }
  }, [currentPage, totalData, gender, mainCategory]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get(`/category/user/sub-categories?mainCategory=${mainCategory}`);
      const categoryData = response.data.detail;
      setCategories(categoryData);
      console.log(categoryData);
    } catch (error) {
      if (error?.response?.status === 404) {
        setCategories([]);
      }
    }
  }, [gender, mainCategory]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter((segment) => segment !== "");

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.map((segment, index, array) => (
          <BreadcrumbItem key={index} isCurrentPage={index === array.length - 1}>
            <span>{segment.charAt(0).toUpperCase() + segment.slice(1)}</span>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>

      <div className="space-y-16 mt-16">
        <div className="flex flex-col space-y-2">
          <span className="font-bold"> Result</span>
          <span> {totalData} items </span>
        </div>
        <div className="flex flex-col space-y-6">
          <div>
            <span className="font-bold text-xl">{mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1)}</span>
          </div>
          <div className="flex flex-col space-y-4">
            {categories.map((category, index) => (
              <Link to={`/${gender}/${mainCategory}/${category.name.replace(/\s+/g, "-").toLowerCase()}`} key={index}>{category.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductNavPage;
