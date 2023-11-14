import Sidebar from "../components/Sidebar";
import Navigationadmin from "../components/Navigationadmin";
import { Button } from "flowbite-react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { PiMagnifyingGlass } from "react-icons/pi";
import { useState } from "react";
import AddProductModal from "../components/AddProductModal";
import AddCategoryModal from "../components/AddCategoryModal";
import { CategoryLists } from "../components/CategoryLists";

function Product() {
  const navList = ["All Products", "Out of stock", "Category", "Archive"];
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("All Products");

  const openAddProductModal = () => setOpenProductModal(true);
  const closeAddProductModal = () => setOpenProductModal(false);
  const openAddCategoryModal = () => setOpenCategoryModal(true);
  const closeAddCategoryModal = () => setOpenCategoryModal(false);
  const handleSelectComponent = (component) => setSelectedComponent(component);

  return (
    <div className="flex flex-row justify-between">
      <Sidebar />
      <div className="w-[84vw] bg-[#f0f0f0] overflow-hidden flex flex-col">
        <div className="shadow-md fixed top-0 left-[16vw] right-0 z-50 bg-white">
          <Navigationadmin />
        </div>
        <div className="flex flex-col mt-16 p-8 ">
          <div className="flex justify-end items-center gap-2">
            <Button color="light" size="medium" className="p-2 w-52 shadow-md" onClick={openAddCategoryModal}>
              Add Categories
            </Button>
            <Button color="dark" size="medium" className="p-2 w-52 shadow-md" onClick={openAddProductModal}>
              Add Products
            </Button>
          </div>
          <div className="flex items-center p-4 mt-4 bg-white rounded-lg shadow-md">
            <div className="flex gap-14 mx-4">
              {navList.map((nav, index) => (
                <span key={index} className="text-sm font-bold text-gray-900 dark:text-white cursor-pointer hover:text-gray-700" onClick={() => handleSelectComponent(nav)}>
                  {nav}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center mt-4">
            {selectedComponent === "All Products" && (
              <div>
                <InputGroup w="250px">
                  <InputLeftElement pl={2} mt="1px">
                    <PiMagnifyingGlass />
                  </InputLeftElement>
                  <Input
                    bg="white"
                    size="md"
                    borderRadius="md"
                    boxShadow="md"
                    placeholder="Search by product or SKU"
                    _placeholder={{ fontSize: "xs", marginBottom: "20px" }} // added textAlign property
                  ></Input>
                </InputGroup>
              </div>
            )}
            {selectedComponent === "Out of stock" && "Out of stock"}
            {selectedComponent === "Category" && <CategoryLists />}
            {selectedComponent === "Archive" && "Archive"}
          </div>
        </div>
      </div>
      <AddProductModal isOpen={openProductModal} isClose={closeAddProductModal} />
      <AddCategoryModal isOpen={openCategoryModal} isClose={closeAddCategoryModal} />
    </div>
  );
}

export default Product;
