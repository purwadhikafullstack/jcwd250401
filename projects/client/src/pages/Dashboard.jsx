import Sidebar from "../components/Sidebar";
import Navigationadmin from "../components/Navigationadmin";

function Dashboard() {
  return (
    <div className="flex flex-row justify-between">
      <Sidebar />
      <div className="w-[84vw] bg-[#f0f0f0] overflow-hidden flex flex-col">
        <div className="shadow-md fixed top-0 left-[16vw] right-0 bg-white">
          <Navigationadmin />
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
