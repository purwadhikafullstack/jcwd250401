import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Image,
  VStack,
  HStack,
  Box,
  useToast,
  Textarea,
} from '@chakra-ui/react';
import { FiCamera } from 'react-icons/fi';
import api from '../api'; 
import { useRef } from 'react';

const AddWarehouseModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [province, setProvince] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [street, setStreet] = useState('');
  const [warehouseImage, setWarehouseImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handlePhotoIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl); // Set the image preview URL state
    }
  };

  useEffect(() => {
    // Fetch provinces
    api.admin.get('/address/province').then(response => {
      if (response.data.ok) {
        setProvinces(response.data.detail);
      }
    });
  }, []);

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setCities([]); // Clear cities when province changes
    setSelectedCity(''); // Clear selected city when province changes

    // Fetch cities based on the selected province
    api.admin.get(`/address/city/${provinceId}`).then(response => {
      if (response.data.ok) {
        setCities(response.data.detail);
      }
    });
  };    

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('province', province);
    formData.append('city', city);
    formData.append('street', street);
    formData.append('warehouseImage', warehouseImage);

    try {
      const response = await api.admin.post('/api/warehouse/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.ok) {
        toast({
          title: 'Success!',
          description: 'New warehouse has been added.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose(); // Close the modal after successful submission
        // Reset form
        setName('');
        setProvince('');
        setCity('');
        setStreet('');
        setWarehouseImage(null);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error submitting the form.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={{ base: 'full', md: 'xl' }}>
      <ModalOverlay />
      <ModalContent mx={{ base: '4', md: '12' }} my="auto" rounded="lg" overflow="hidden">
        <ModalHeader className="font-bold text-lg text-center">New Warehouse</ModalHeader>
        <ModalCloseButton />
        <ModalBody className="p-4">
          <VStack spacing="4">
            <Box className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center mx-auto" onClick={handlePhotoIconClick}>
              {imagePreview ? (
                <Image src={imagePreview} alt="Warehouse image" className="w-full h-full rounded" />
              ) : (
                <FiCamera className="h-12 w-12 text-gray-400" />
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </Box>
            <FormControl id="warehouse-name">
              <FormLabel>Warehouse Name</FormLabel>
              <Input placeholder="Enter warehouse name" />
            </FormControl>
            <VStack spacing="2" width="full" alignItems="flex-start">
              <FormLabel htmlFor="location" fontSize="1rem">Warehouse Location</FormLabel>
              <HStack spacing="2" width="full">
                <FormControl id="province" flex="1">
                  <Select placeholder='Select Province' onChange={handleProvinceChange} value={selectedProvince}>
                    {provinces.map((province) => (
                      <option key={province.province_id} value={province.province_id}>{province.province}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl id="city" flex="1">
                  <Select placeholder='Select City' onChange={(e) => setSelectedCity(e.target.value)} value={selectedCity} disabled={!selectedProvince}>
                    {cities.map((city) => (
                      <option key={city.city_id} value={city.city_id}>{city.city_name}</option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>
            </VStack>
            <FormControl id="street">
              <Textarea placeholder="Enter street" onChange={(e) => setStreet(e.target.value)} value={street} />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter flexDirection={{ base: 'column', md: 'row' }} className="gap-2">
          <Button variant="outline" onClick={onClose} flex="1" className="border-gray-300 text-black">
            Discard
          </Button>
          <Button
            color="white"
            bg="black"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            flex="1"
            mt={{ base: '2', md: '0' }}
            _hover={{ bg: 'gray' }} // Add hover effect to change background color to gray
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddWarehouseModal;