import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import ResetPassword from "./pages/ResetPassword";
import { Profile } from "./pages/Profile";
import { Address } from "./pages/Address";
import { ChangePassword } from "./pages/ChangePassword";
import { NotFound } from "./pages/NotFound";
import Navigationbar from "./components/Navigationbar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AdminLoginPage from "./pages/AdminLoginPage";
import { Order } from "./pages/Order";
import { CartPage } from "./pages/CartPage";
import { Customers } from "./pages/Customers";
import { Staff } from "./pages/Staff";
import Warehouse from "./pages/Warehouse";
import HomeProducts from "./pages/HomeProducts";

// 

const adminPaths = [
  "/adminlogin",
  "/reset-password-admin",
  "/dashboard",
  "/dashboard/products",
  "/dashboard/customers",
  "/dashboard/staff",
  "/dashboard/warehouse",
  // Add more admin paths as needed
];

export default function App() {
  const location = useLocation();

  // Check if the current path is an admin path
  const isAdminPath = adminPaths.some((path) => location.pathname.startsWith(path));

  // Show Navigationbar only if it's not an admin path
  const showNavigationbar = !isAdminPath;

  return (
    <div>
      {showNavigationbar && (
        <div className="shadow-md fixed top-0 left-0 right-0 z-50">
          <Navigationbar />
        </div>
      )}
      <div className={showNavigationbar ? "mt-20" : ""}>
        {/* Add some top margin to create space for the fixed navigation bar */}
        <Routes>
          {/* admin routes */}
          <Route path="/adminlogin" element={<AdminLoginPage />} />
          <Route path="/reset-password-admin" element={<ResetPassword userType={"admin"} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/products" element={<Products />} />
          <Route path="/dashboard/customers" element={<Customers />} />
          <Route path="/dashboard/staff" element={<Staff />} />
          <Route path="/dashboard/warehouse" element={<Warehouse />} />
          {/* client routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/reset-password" element={<ResetPassword userType={"user"} />} />
          <Route path="/account/profile" element={<Profile />} />
          <Route path="/account/my-order" element={<Order />} />
          <Route path="/account/address-book" element={<Address />} />
          <Route path="/account/change-password" element={<ChangePassword />} />
          <Route path="/account/cart" element={<CartPage />} />
          <Route path="/products/:gender/:mainCategory?/:subCategory?/:productName?" element={<HomeProducts />} />
          {/* Add more route configurations as needed */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
