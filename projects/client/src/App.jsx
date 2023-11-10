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



const routesConfig = [

  // USER ROUTES
  { path: "/", component: <Homepage />, showNavigationbar: true },
  { path: "/reset-password", component: <ResetPassword />, showNavigationbar: false },
  { path: "/account/profile", component: <Profile />, showNavigationbar: true },
  { path: "/account/address-book", component: <Address />, showNavigationbar: true },
  { path: "/account/change-password", component: <ChangePassword />, showNavigationbar: true },

  // ADMIN ROUTES
  { path: "/dashboard", component: <Dashboard />, showNavigationbar: false},
  { path: "/dashboard/products", component: <Products/>, showNavigationbar: false},
  // Add more route configurations as needed
];

export default function App() {
  const location = useLocation();

  const currentRoute = routesConfig.find(route => route.path === location.pathname);

  // Show Navigationbar only if the current route exists and showNavigationbar is true
  const showNavigationbar = currentRoute ? currentRoute.showNavigationbar : false;

  return (
    <div>
      {showNavigationbar && (
        <div className="shadow-md fixed top-0 left-0 right-0 z-50">
          <Navigationbar />
        </div>
      )}
      <div className={showNavigationbar ? 'mt-20' : ''}>
        {/* Add some top margin to create space for the fixed navigation bar */}
        <Routes>
          {routesConfig.map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
