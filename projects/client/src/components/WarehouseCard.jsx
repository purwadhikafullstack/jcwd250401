import React from 'react';
import { Box, Text, Flex, Image, Button, Card } from '@chakra-ui/react';
import { FaPhone, FaClock, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const WarehouseCard = ({ warehouse }) => {

  const isWarehouseAdmin = useSelector((state) => state?.account?.isWarehouseAdmin);

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
        <Button mt={4} colorScheme="gray" size="sm">
          Edit
        </Button>
        )}
      </Box>
    </Card>
  );
};

export default WarehouseCard;