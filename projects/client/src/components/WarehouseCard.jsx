import React, { useState } from 'react';
import { Box, Text, Flex, Image, Button, Card, Menu, MenuButton, MenuList, MenuItem, HStack, VStack} from '@chakra-ui/react';
import { FaPhone, FaClock, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { PiCaretDown } from 'react-icons/pi';
import { useSelector } from 'react-redux';
import EditWarehouseModal from './EditWarehouseModal';
import api from '../api';

const WarehouseCard = ({ warehouse, onSuccess }) => {
  const isWarehouseAdmin = useSelector((state) => state?.account?.isWarehouseAdmin);
  // State to manage the visibility of the modal
  const [isModalOpen, setModalOpen] = useState(false);

  // Function to delete the warehouse
  const handleDelete = async () => {
    await api.admin.delete(`/api/warehouse/${warehouse.id}`);
    // You can also refresh the data by calling the API again
    onSuccess();
  };

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
        fallbackSrc='https://via.placeholder.com/300x150'
      />
      <Box p={6} className="flex-1">
        <HStack spacing={4} mb={4}>
        <VStack align="start" spacing={1} flex="1">
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
        </VStack>
        {isWarehouseAdmin === false && (
        <Menu>
        <MenuButton
          px={2}
          py={2}
          transition="all 0.2s"
          borderRadius="lg"
          textColor="gray.600"
          boxShadow="md"
          borderColor="gray.500"
          borderWidth="2px"
          _hover={{ bg: "gray.900", textColor: "white" }}
          _expanded={{ bg: "gray.900", textColor: "white" }}
        >
          <Flex justifyContent="between" gap={4} px={2} alignItems="center">
            <Text fontWeight="bold">Edit</Text>
            <PiCaretDown size="20px" />
          </Flex>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={handleOpenModal}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </MenuList>
      </Menu>
        )}
        </HStack>
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