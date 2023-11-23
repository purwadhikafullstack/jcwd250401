import React, { useState } from 'react';
import { Box, Text, Flex, Image, Button, Card } from '@chakra-ui/react';
import { FaPhone, FaClock, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import EditWarehouseModal from './EditWarehouseModal';

const WarehouseCard = ({ warehouse, onSuccess }) => {
  const isWarehouseAdmin = useSelector((state) => state?.account?.isWarehouseAdmin);
  // State to manage the visibility of the modal
  const [isModalOpen, setModalOpen] = useState(false);

  // Function to open the modal
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  
  // Function to close the modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  
  // Function to handle actions after successful edit
  const handleSuccess = () => {
    // Implement any actions that need to be taken after successful edit
    handleCloseModal();
    // You can also refresh the data by calling the API again
    onSuccess();
  };  

  return (
    <Card
      borderWidth="1wv"
      borderRadius="lg"
      direction={{ base: 'column', md: 'row' }}
      overflow="hidden"
      className="bg-white shadow-md mb-4"
    >
      <Image
        src={`http://localhost:8000/public/${warehouse.warehouseImage}`}
        alt={`Image of ${warehouse.name}`}
        className="w-full md:w-1/3 object-cover rounded-lg"
      />
      <Box p={6} className="flex-1">
        <Text fontSize="2xl" fontWeight="bold" className="text-gray-800">
          Warehouse {warehouse.name}
        </Text>
        <Flex align="center" mt={2} className="text-gray-600 text-sm">
          <FaUser className="mr-2" />
          <Text>John Doe</Text>
        </Flex>
        <Flex align="center" mt={2} className="text-gray-600 text-sm">
          <FaPhone className="mr-2" />
          <Text>021-12345678</Text>
        </Flex>
        <Flex align="center" mt={2} className="text-gray-600 text-sm">
          <FaClock className="mr-2" />
          <Text>Operating Hours</Text>
        </Flex>
        <Flex align="center" mt={2} className="text-gray-600 text-sm">
          <FaMapMarkerAlt className="mr-2" />
          <Text>{warehouse.WarehouseAddress.street}, {warehouse.WarehouseAddress.city}</Text>
        </Flex>
        {isWarehouseAdmin === false && (
        <Button mt={4} colorScheme="gray" size="sm" onClick={handleOpenModal}>
          Edit
        </Button>
        )}
      </Box>
      <EditWarehouseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        warehouseId={warehouse.id} // Assuming warehouse object has an id
      />
    </Card>
  );
};

export default WarehouseCard;