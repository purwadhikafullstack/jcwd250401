import { Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import ResetPassword from "./pages/ResetPassword";
import { Profile } from "./pages/Profile";
import { Address } from "./pages/Address";
import { ChangePassword } from "./pages/ChangePassword";
import { NotFound } from "./pages/NotFound";
import Navigationbar from "./components/Navigationbar";

import { useNavigate, useLocation } from "react-router-dom";

export default function App() {
  const location = useLocation();

  // Hide Navigationbar for /reset-password route
  const renderNavigationbar = location.pathname !== "/reset-password";

  return (
    <div>
      {renderNavigationbar && (
        <div className="shadow-md">
          <Navigationbar />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account/profile" element={<Profile />} />
        <Route path="/account/address-book" element={<Address />} />
        <Route path="/account/change-password" element={<ChangePassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
