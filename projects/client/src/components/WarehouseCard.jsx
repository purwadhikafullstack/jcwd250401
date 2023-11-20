import React from 'react';
import { Box, Text, Flex, Image, Button } from '@chakra-ui/react';
import { FaPhone, FaClock, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

const WarehouseCard = ({ warehouse }) => {
  return (
    <Flex
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      direction={{ base: 'column', md: 'row' }}
      className="bg-white shadow-md mb-4"
    >
      <Image
        src={`http://localhost:8000/public/${warehouse.warehouseImage}`}
        alt={`Image of ${warehouse.name}`}
        className="w-full md:w-1/3 object-cover"
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
        <Button mt={4} colorScheme="gray" size="sm">
          Edit
        </Button>
      </Box>
    </Flex>
  );
};

export default WarehouseCard;