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

const TimePicker = ({ value, onChange }) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : i));
  const periods = ['AM', 'PM'];

  // Convert 12-hour format to 24-hour format for onChange
  const to24HourFormat = (hour, minute, period) => {
    hour = parseInt(hour, 10);
    if (period === 'PM' && hour !== 12) {
      hour = hour + 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    return `${hour < 10 ? `0${hour}` : hour}:${minute}`;
  };

  // Extract hour, minute, and period from the 24-hour format value
  const [hour24, minute] = value.split(':');
  const period = parseInt(hour24, 10) >= 12 ? 'PM' : 'AM';
  const hour12 = parseInt(hour24, 10) % 12 === 0 ? 12 : parseInt(hour24, 10) % 12;

  const handleTimeChange = (hour, minute, period) => {
    const time24HourFormat = to24HourFormat(hour, minute, period);
    onChange(time24HourFormat);
  };

  return (
    <HStack>
      <Select value={hour12} onChange={(e) => handleTimeChange(e.target.value, minute, period)}>
        {hours.map((hour) => (
          <option key={hour} value={hour}>{hour}</option>
        ))}
      </Select>
      <Select value={minute} onChange={(e) => handleTimeChange(hour12, e.target.value, period)}>
        {minutes.map((minute) => (
          <option key={minute} value={minute}>{minute}</option>
        ))}
      </Select>
      <Select value={period} onChange={(e) => handleTimeChange(hour12, minute, e.target.value)}>
        {periods.map((period) => (
          <option key={period} value={period}>{period}</option>
        ))}
      </Select>
    </HStack>
  );
};

const EditWarehouseModal = ({ isOpen, onClose, onSuccess, warehouseId }) => {
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [OpenHour, setOpenHour] = useState('');
  const [CloseHour, setCloseHour] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [province, setProvince] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [provinceId, setProvinceId] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState(0);
  const [selectedCity, setSelectedCity] = useState('');
  const [street, setStreet] = useState('');
  const [warehouseImage, setWarehouseImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [initialWarehouseData, setInitialWarehouseData] = useState(null);
  const [initialImageURL, setInitialImageURL] = useState(null);

  const resetState = () => {
    setName('');
    setOwner('');
    setOpenHour('');
    setCloseHour('');
    setPhoneNumber('');
    setProvince('');
    setProvinces([]);
    setProvinceId(0);
    setSelectedProvince('');
    setCity('');
    setCities([]);
    setCityId(0);
    setSelectedCity('');
    setStreet('');
    setImagePreview(null);
    setWarehouseImage(null);
    setInitialWarehouseData(null);
    setInitialImageURL(null);
  };

  const handlePhotoIconClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    // Fetch provinces and initial warehouse data
    if (isOpen && warehouseId) {
      api.admin.get('/api/address/province').then(response => {
        if (response.data.ok && isOpen) {
          setProvinces(response.data.detail);
        }
      });

      if (warehouseId) {
        api.admin.get(`/api/warehouse/w/${warehouseId}`).then(response => {
          if (response.data.ok) {
            const warehouse = response.data.detail;
            setInitialWarehouseData(warehouse); // Store the initial data
            setName(warehouse.name);
            setOwner(warehouse.owner);
            setOpenHour(warehouse.OpenHour);
            setCloseHour(warehouse.CloseHour);
            setPhoneNumber(warehouse.phoneNumber);
            setProvince(warehouse.WarehouseAddress.province);
            setProvinceId(warehouse.WarehouseAddress.provinceId);
            setSelectedProvince(warehouse.WarehouseAddress.province);
            setCity(warehouse.WarehouseAddress.city);
            setCityId(warehouse.WarehouseAddress.cityId);
            setSelectedCity(warehouse.WarehouseAddress.city);
            setStreet(warehouse.WarehouseAddress.street);
            setImagePreview(warehouse.warehouseImage ? `http://localhost:8000/public/${warehouse.warehouseImage}` : null);
            setInitialImageURL(warehouse.warehouseImage ? `http://localhost:8000/public/${warehouse.warehouseImage}` : null);
          }
        });
      }
    }
  }, [isOpen, warehouseId]);

  useEffect(() => {
    if (initialWarehouseData && provinces.length > 0) {
      setSelectedProvince(initialWarehouseData.WarehouseAddress.provinceId.toString());
      fetchCities(initialWarehouseData.WarehouseAddress.provinceId);
    }
  }, [initialWarehouseData, provinces]);

  const fetchCities = (provinceId) => {
    api.admin.get(`/api/address/city/${provinceId}`).then(response => {
      if (response.data.ok) {
        setCities(response.data.detail);
        if (initialWarehouseData) {
          setSelectedCity(initialWarehouseData.WarehouseAddress.cityId.toString());
        }
      }
    });
  };

  const handleProvinceChange = (e) => {
    const selectedId = e.target.value;
    setSelectedProvince(selectedId);
    setProvinceId(selectedId);
    fetchCities(selectedId);
    setCityId(0);
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setWarehouseImage(file); // Set file object to warehouseImage
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
    formData.append('province', province);
    formData.append('provinceId', provinceId);
    formData.append('city', city);
    formData.append('cityId', cityId);
    formData.append('street', street);
    if (warehouseImage instanceof File) {
      formData.append('warehouseImage', warehouseImage); // Append only if it's a File object
    }

    try {
      const response = await api.admin.patch(`/api/warehouse/${warehouseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.ok) {
        toast({
          title: 'Success!',
          description: 'Warehouse has been updated.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose(); // Close the modal after successful submission
        onSuccess(); // Call the onSuccess prop to refetch the warehouses
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

  const handleModalClose = () => {
    // Reset form and state on modal close
    resetState();
    onClose();
  };
  
  useEffect(() => {
    if (!OpenHour) setOpenHour('00:00'); // Set default open hour in 24-hour format
    if (!CloseHour) setCloseHour('12:00'); // Set default close hour in 24-hour format
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} isCentered size={{ base: 'xl', md: 'xl' }}>
      <ModalOverlay />
      <ModalContent mx={{ base: '4', md: '12' }} my="auto" rounded="lg" overflow="hidden">
        <ModalHeader className="font-bold text-lg text-center">Edit Warehouse</ModalHeader>
        <ModalCloseButton />
        <ModalBody className="p-4">
          <VStack spacing="4">
            <Box className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center mx-auto" onClick={handlePhotoIconClick}>
              {imagePreview || initialImageURL ? (
                <Image src={imagePreview || initialImageURL} alt="Warehouse image" className="w-full h-full rounded" />
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
                  <TimePicker value={OpenHour} onChange={setOpenHour} />
                </FormControl>
                <p> - </p>
                <FormControl id="closeHour" flex="1">
                  <TimePicker value={CloseHour} onChange={setCloseHour} />
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
            mt={{ base: '2', md: '1' }}
            _hover={{ bg: 'gray' }} // Add hover effect to change background color to gray
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditWarehouseModal;