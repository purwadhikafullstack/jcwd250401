import Sidebar from "../components/Sidebar";
import Navigationadmin from "../components/Navigationadmin";
import SalesOverview from "../components/SalesOverview";

function SalesReport() {
  document.title = "RAINS - Sales Report";

  return (
    <div className="flex flex-row justify-between h-screen">
      <Sidebar />
      <div className="w-[82vw] lg:w-[84vw] bg-[#f0f0f0] overflow-hidden flex flex-col">
        <div className="shadow-md fixed top-0 left-[18vw] lg:left-[16vw] right-0 z-50 bg-white">
          <Navigationadmin />
        </div>
        <div className="flex flex-col overflow-hidden mt-16 py-8 px-4 md:p-8">
         <SalesOverview />
        </div>
      </div>
    </div>
  );
}

export default SalesReport;
