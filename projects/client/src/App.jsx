import { Route, Routes, useLocation } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import ResetPassword from "./pages/ResetPassword";
import { Profile } from "./pages/Profile";
import { Address } from "./pages/Address";
import { ChangePassword } from "./pages/ChangePassword";
import { NotFound } from "./pages/NotFound";
import Navigationbar from "./components/Navigationbar";



const routesConfig = [
  { path: "/", component: <Homepage />, showNavigationbar: true },
  { path: "/reset-password", component: <ResetPassword />, showNavigationbar: false },
  { path: "/account/profile", component: <Profile />, showNavigationbar: true },
  { path: "/account/address-book", component: <Address />, showNavigationbar: true },
  { path: "/account/change-password", component: <ChangePassword />, showNavigationbar: true },
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
        <div className="shadow-md">
          <Navigationbar />
        </div>
      )}
      <Routes>
        {routesConfig.map((route, index) => (
          <Route key={index} path={route.path} element={route.component} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
