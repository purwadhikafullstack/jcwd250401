import { Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import { Profile } from "./pages/Profile";
import { Address } from "./pages/Address";
import { ChangePassword } from "./pages/ChangePassword";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/account/profile" element={<Profile />} />
      <Route path="/account/address-book" element={<Address />} />
      <Route path="/account/change-my-password" element={<ChangePassword />} />
    </Routes>
  );
}
