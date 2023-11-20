import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navigationadmin from "../components/Navigationadmin";
import { Button } from "flowbite-react";
import AddProductModal from "../components/AddProductModal";
import WarehouseCard from "../components/WarehouseCard"; // Import the WarehouseCard component
import api from '../api'; // Replace with your actual API module

function Warehouse() {
  const [warehouses, setWarehouses] = useState([]); // State to store the warehouses

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

  return (
    <div className="flex flex-row justify-between h-screen">
      <Sidebar />
      <div className="flex-grow bg-[#f0f0f0] overflow-hidden flex flex-col">
        <div className="shadow-md fixed top-0 left-[16vw] right-0 z-50 bg-white">
          <Navigationadmin />
        </div>
        <div className="flex flex-col mt-16 py-8 px-4 md:p-8 overflow-auto h-full">
          <div className="flex justify-end items-center gap-2">
            <Button color="dark" size="medium" className="md:p-2 w-52 shadow-md">
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
    </div>
  );
}

export default Warehouse;
