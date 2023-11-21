import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navigationadmin from "../components/Navigationadmin";
import { Button } from "flowbite-react";
import AddWarehouseModal from "../components/AddWarehouseModal"; // Import the AddWarehouseModal component
import WarehouseCard from "../components/WarehouseCard"; // Import the WarehouseCard component
import api from '../api'; // Replace with your actual API module

function Warehouse() {
  const [warehouses, setWarehouses] = useState([]); // State to store the warehouses
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State to manage AddWarehouseModal visibility

  useEffect(() => {
    api.get('/api/warehouse')
      .then(response => {
        if (response.data.ok) {
          setWarehouses(response.data.data); // Set the warehouses data
        }
      })
      .catch(error => {
        // Handle error here, e.g., set an error state
      });
  }, []);

  // Handler to open the AddWarehouseModal
  const openAddModal = () => setIsAddModalOpen(true);

  // Handler to close the AddWarehouseModal
  const closeAddModal = () => setIsAddModalOpen(false);

  return (
    <div className="flex flex-row justify-between h-screen">
      <Sidebar />
      <div className="flex-grow bg-[#f0f0f0] overflow-hidden flex flex-col">
        <div className="shadow-md fixed top-0 left-[16vw] right-0 z-50 bg-white">
          <Navigationadmin />
        </div>
        <div className="flex flex-col mt-16 py-8 px-4 md:p-8 overflow-auto h-full">
          <div className="flex justify-end items-center gap-2">
            {/* Updated Button component to open the modal */}
            <Button color="dark" size="medium" className="md:p-2 w-52 shadow-md" onClick={openAddModal}>
              Add Warehouse
            </Button>
          </div>
          {/* Scrollable area for Warehouse Cards */}
          <div className="mt-4 space-y-4 overflow-y-auto">
            {warehouses.map(warehouse => (
              <WarehouseCard key={warehouse.id} warehouse={warehouse} />
            ))}
          </div>
        </div>
      </div>
      {/* AddWarehouseModal component */}
      <AddWarehouseModal isOpen={isAddModalOpen} onClose={closeAddModal} />
    </div>
  );
}

export default Warehouse;