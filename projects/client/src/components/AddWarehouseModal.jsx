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
  useToast,
} from '@chakra-ui/react';
import { CameraIcon } from '@heroicons/react/solid'; 
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
    api.get('/address/province').then(response => {
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
    api.get(`/address/city/${provinceId}`).then(response => {
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
      const response = await api.post('/api/warehouse/', formData, {
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
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent className="bg-white">
        <ModalHeader className="font-bold text-lg">New Staff</ModalHeader>
        <ModalCloseButton />
        <ModalBody className="px-6 py-4">
          <div className="flex items-start space-x-6">
            <div className="shrink-0">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer" onClick={handlePhotoIconClick} >
                {imagePreview ? (
                  <Image src={imagePreview} alt="Uploaded image preview" className="w-full h-full object-cover" />
                ) : (
                  <CameraIcon className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden" // Hide the actual file input
              />
              <span className="block text-center text-sm text-gray-500 mt-2">Click to add your photo</span>
            </div>
            <div className="flex-1 space-y-4">
              <FormControl>
                <FormLabel>Warehouse Name</FormLabel>
                <Input placeholder="Enter warehouse name" />
              </FormControl>
              <FormControl>
                <FormLabel>Location</FormLabel>
                <div className="flex space-x-2 space-y-0">
                <Select placeholder='Select Province' onChange={handleProvinceChange} value={selectedProvince}>
                    {provinces.map((province) => (
                    <option key={province.province_id} value={province.province_id}>{province.province}</option>
                    ))}
                </Select>
                <Select placeholder='Select City' onChange={(e) => setSelectedCity(e.target.value)} value={selectedCity} disabled={!selectedProvince}>
                    {cities.map((city) => (
                    <option key={city.city_id} value={city.city_id}>{city.city_name}</option>
                    ))}
                </Select>
                </div>
                <Input placeholder="Street/building/number/block" className="mt-2" />
              </FormControl>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="px-6 py-4">
          <Button variant="outline" mr={3} onClick={onClose} className="border-gray-300 text-black">
            Discard
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={isSubmitting}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddWarehouseModal;