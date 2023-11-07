import { Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import { Toaster, toast } from "sooner";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </>
  );
}
