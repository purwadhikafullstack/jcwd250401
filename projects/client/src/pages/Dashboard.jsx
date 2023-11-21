import Sidebar from "../components/Sidebar";
import Navigationadmin from "../components/Navigationadmin";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Dashboard() {
  const adminProfile = JSON.parse(localStorage.getItem("adminProfile"))
  const token = adminProfile?.data?.token
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/adminlogin");
    }
  },[token]);

  return (
    <div className="flex flex-row justify-between">
      <Sidebar />
      <div className="w-[84vw] bg-[#f0f0f0] overflow-hidden flex flex-col">
        <div className="shadow-md fixed top-0 left-[16vw] right-0 bg-white z-50">
          <Navigationadmin />
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
