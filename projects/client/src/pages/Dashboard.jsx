import Sidebar from "../components/Sidebar";
import Navigationadmin from "../components/Navigationadmin";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function Dashboard() {
  const isAdminLogin = useSelector((state) => state?.account?.profile?.data?.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminLogin) {
      toast.error("Please login first");
      navigate("/adminlogin");
    }
  },[isAdminLogin]);

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
