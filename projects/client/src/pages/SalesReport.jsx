import Sidebar from "../components/Sidebar";
import Navigationadmin from "../components/Navigationadmin";
import { Button } from "flowbite-react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { PiMagnifyingGlass } from "react-icons/pi";
import { useState } from "react";
import AddProductModal from "../components/AddProductModal";
import AddCategoryModal from "../components/AddCategoryModal";
import { CategoryLists } from "../components/CategoryLists";
import ProductList from "../components/ProductList";
import { useEffect } from "react";
import { useRef } from "react";
import ArchivedProductList from "../components/ArchivedProductList";
import { logoutAdmin } from "../slices/accountSlices";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import SalesOverview from "../components/SalesOverview";

function SalesReport() {
  document.title = "RAINS - Sales Report";
  const navList = ["Overview", "Products"];
  
  const [selectedComponent, setSelectedComponent] = useState("Overview");
  const [pillWidth, setPillWidth] = useState(0); // State to store the width of the pill
  const handleSelectComponent = (nav) => setSelectedComponent(nav);
  const navRefs = useRef([]); // Refs to store references to each navigation item
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isWarehouseAdmin = useSelector((state) => state?.account?.isWarehouseAdmin);

  useEffect(() => {
    // Calculate the width of the selected navigation item
    if (navRefs[selectedComponent]) {
      setPillWidth(navRefs[selectedComponent].offsetWidth);
    }
  }, [selectedComponent]);

  

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
