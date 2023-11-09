import { Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import ResetPassword from "./pages/ResetPassword";

import { Profile } from "./pages/Profile";
import { Address } from "./pages/Address";
import { ChangePassword } from "./pages/ChangePassword";
import { NotFound } from "./pages/NotFound";
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account/profile" element={<Profile />} />
        <Route path="/account/address-book" element={<Address />} />
        <Route path="/account/change-my-password" element={<ChangePassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
