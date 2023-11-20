import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import api from '../api'; // Replace with your actual API module

const AddWarehouseModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [warehouseImage, setWarehouseImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

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
    formData.append('contact', contact);
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
        setContact('');
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

  const handleImageChange = (e) => {
    setWarehouseImage(e.target.files[0]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Warehouse</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Warehouse Name</FormLabel>
            <Input placeholder='Enter warehouse name' value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          {/* Other form inputs for contact, province, city, street, and file upload */}
          <FormControl mt={4}>
          <FormLabel>Location</FormLabel>
          <Select placeholder='Select Province' onChange={handleProvinceChange} value={selectedProvince}>
            {provinces.map((province) => (
              <option key={province.province_id} value={province.province_id}>{province.province}</option>
            ))}
          </Select>
          <Select mt={2} placeholder='Select City' onChange={(e) => setSelectedCity(e.target.value)} value={selectedCity} disabled={!selectedProvince}>
            {cities.map((city) => (
              <option key={city.city_id} value={city.city_id}>{city.city_name}</option>
            ))}
          </Select>
          <Input mt={2} placeholder='Street/building/number/block' /* ... */ />
        </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Discard
          </Button>
          <Button colorScheme='blue' onClick={handleSubmit} isLoading={isSubmitting}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddWarehouseModal;