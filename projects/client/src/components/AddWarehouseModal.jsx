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
import { set } from 'lodash';

const AddWarehouseModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [OpenHour, setOpenHour] = useState('');
  const [CloseHour, setCloseHour] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [province, setProvince] = useState('');
  const [provinceId, setProvinceId] = useState(0);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [city, setCity] = useState('');
  const [cityId, setCityId] = useState(0);
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

    setWarehouseImage(file);
  };

  useEffect(() => {
    // Fetch provinces
    api.admin.get('/api/address/province').then(response => {
      if (response.data.ok) {
        setProvinces(response.data.detail);
      }
    });
  }, []);

  const handleProvinceChange = (e) => {
    const selectedId = e.target.value;
    setSelectedProvince(selectedId);
    setProvinceId(selectedId);
    setCityId(0); // Reset city id when province changes
    setCities([]);

    api.admin.get(`/api/address/city/${selectedId}`).then(response => {
      if (response.data.ok) {
        setCities(response.data.detail);
      }
    });

    const selectedProvince = provinces.find(province => province.province_id.toString() === selectedId);
    if (selectedProvince) {
      setProvince(selectedProvince.province);
    }
  };

  const handleCityChange = (e) => {
    const selectedId = e.target.value;
    setSelectedCity(selectedId);
    setCityId(selectedId);

    const selectedCity = cities.find(city => city.city_id.toString() === selectedId);
    if (selectedCity) {
      setCity(selectedCity.city_name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('owner', owner);
    formData.append('OpenHour', OpenHour);
    formData.append('CloseHour', CloseHour);
    formData.append('phoneNumber', phoneNumber);
    formData.append('province', province);
    formData.append('provinceId', Number(provinceId));
    formData.append('city', city);
    formData.append('cityId', Number(cityId));
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
        onSuccess(); // Call the onSuccess prop to refetch the warehouses
        // Reset form
        setName('');
        setOwner('');
        setOpenHour('');
        setCloseHour('');
        setPhoneNumber('');
        setProvince('');
        setProvinceId(0);
        setCity('');
        setCityId(0);
        setStreet('');
        setImagePreview(null);
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

  console.log(warehouseImage);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={{ base: 'xl', md: 'xl' }}>
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
            <VStack spacing="2" width="full" alignItems="flex-start">
            <FormLabel>Warehouse Profile</FormLabel>
            <HStack spacing="2" width="full">
            <FormControl id="warehouse-name">
              <Input placeholder="Warehouse name" onChange={(e) => setName(e.target.value)} value={name} />
            </FormControl>
            <FormControl id="warehouse-owner">
              <Input placeholder="Warehouse owner" onChange={(e) => setOwner(e.target.value)} value={owner} />
            </FormControl>
            </HStack>
            <FormControl id='warehouse-phoneNumber'>
              <Input placeholder="Warehouse phone number" onChange={(e) => setPhoneNumber(e.target.value)} value={phoneNumber} />
            </FormControl>
            </VStack>
            <VStack spacing="2" width="full" alignItems="flex-start">
              <FormLabel fontSize="1rem">Warehouse Operating Hour</FormLabel>
              <HStack spacing="2" width="full">
              <FormControl id="openHour" flex="1">
                <Input placeholder="Open Hour" onChange={(e) => setOpenHour(e.target.value)} value={OpenHour} />
              </FormControl>
              <FormControl id="closeHour" flex="1">
                <Input placeholder="Close Hour" onChange={(e) => setCloseHour(e.target.value)} value={CloseHour} />
              </FormControl>
              </HStack>
            </VStack>
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
                <Select placeholder='Select City' onChange={handleCityChange} value={selectedCity} disabled={!selectedProvince}>
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
        <ModalFooter className="gap-2">
          <Button variant="outline" onClick={onClose} flex="1" className="border-gray-300 text-black">
            Discard
          </Button>
          <Button
            color="white"
            bg="black"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            flex="1"
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