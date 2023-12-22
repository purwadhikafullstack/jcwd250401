import { CalendarIcon } from "@chakra-ui/icons";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, Text, Box, Input, InputGroup, InputLeftElement, InputRightAddon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getWarehouseByAdmin from "../api/warehouse/getWarehouseByAdmin";
import getSingleAdmin from "../api/users/getSingleAdmin";
import getWarehouses from "../api/warehouse/getWarehouses";
import requestStockMutation from "../api/mutation/requestStockMutation";
import { toast } from "sonner";
import getProducts from "../api/products/getProducts";
import { useNavigate } from "react-router-dom";
import getSuperAdmin from "../api/users/getSuperAdmin";

export const RequestStockModal = ({ isOpen, onClose }) => {
  const isWarehouseAdmin = useSelector((state) => state?.account?.isWarehouseAdmin);
  const adminData = useSelector((state) => state?.account?.adminProfile?.data?.profile);
  const currentUTCDateTime = new Date();
  currentUTCDateTime.setHours(currentUTCDateTime.getHours() + 7);
  const formattedDateTime = currentUTCDateTime.toISOString().split("T");
  const currentDate = formattedDateTime[0];
  const currentTime = formattedDateTime[1].substring(0, 8);
  const [warehouseList, setWarehouseList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(`${currentDate}T${currentTime}`);
  const [selectedWarehouseIdOrigin, setSelectedWarehouseIdOrigin] = useState(null);
  const [selectedWarehouseNameOrigin, setSelectedWarehouseNameOrigin] = useState(null);
  const [selectedWarehouseIdDestination, setSelectedWarehouseIdDestination] = useState(null);
  const [selectedWarehouseNameDestination, setSelectedWarehouseNameDestination] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  const fetchWarehouses = async () => {
    try {
      const response = await getWarehouses();
      setWarehouseList(response.data);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 404 || error.response.status === 500)) {
        toast.error(error.response.data.message);
        if (error.response.status === 401 || error.response.status === 403) navigate("/adminlogin");
        if (error.response.status === 500) console.error(error);
      }
    }
  };

  const fetchAdminData = async () => {
    try {
      const response = await getSuperAdmin({
        username: adminData?.username,
        email: adminData?.email,
      });
      if (response.ok) {
        setAdmin(response.detail);
      }
    } catch (error) {
      if (error.response && (error.response.status === 404 || error.response.status === 500)) {
        toast.error(error.response.data.message);
        if (error.response.status === 500) console.error(error);
      }
    }
  };
  const fetchAdminWarehouseData = async () => {
    try {
      const response = await getSingleAdmin({
        username: adminData?.username,
        email: adminData?.email,
      });
      if (response.ok) {
        const adminIdFromResponse = response.detail.id;

        const response2 = await getWarehouseByAdmin({ adminId: adminIdFromResponse });
        if (response2.ok) {
          const warehouseIdFromResponse = response2.detail.id;
          setAdmin(response2.detail);
          setSelectedWarehouseIdDestination(warehouseIdFromResponse);
          setSelectedWarehouseNameDestination(response2.detail.name);
        }
      }
    } catch (error) {
      if (error.response && (error.response.status === 404 || error.response.status === 500)) {
        toast.error(error.response.data.message);
        if (error.response.status === 500) console.error(error);
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts({ limit: 1000 });
      if (response.ok) {
        setProductList(response.details);
      }
    } catch (error) {
      if (error.response && (error.response.status === 404 || error.response.status === 500)) {
        toast.error(error.response.data.message);
        if (error.response.status === 500) console.error(error);
      }
    }
  };

  const handleRequestStock = async () => {
    try {
      let adminIdValue = admin?.id;

      if (isWarehouseAdmin) {
        adminIdValue = admin.adminId;
      }
      const response = await requestStockMutation({
        adminId: adminIdValue,
        warehouseId: selectedWarehouseIdOrigin,
        destinationWarehouseId: selectedWarehouseIdDestination,
        productId: selectedProductId,
        mutationQuantity: quantity,
        date: selectedDate,
      });
      if (response.ok) {
        toast.success(response.message);
        onClose();
        setSelectedDate(new Date().toISOString().split("T")[0]);
        setSelectedWarehouseIdOrigin(null);
        setSelectedWarehouseNameOrigin(null);
        setSelectedProductId(null);
        setSelectedProductName(null);
        setQuantity(0);
      }
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 404)) {
        toast.error(error.response.data.message);
      } else if (error.response.status === 500) {
        toast.error(error.response.data.detail);
      }
    }
  };

  useEffect(() => {
    if (isWarehouseAdmin) {
      fetchAdminWarehouseData();
    } else {
      fetchAdminData();
    }
    fetchWarehouses();
    fetchProducts();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
      <ModalContent>
        <ModalHeader>
          <Text fontWeight="bold">Request Stock</Text>
        </ModalHeader>
        <ModalBody>
          <Box display={"flex"} flexDir={"column"} gap={2} w={"full"}>
            <Box display={"flex"} gap={2}>
              <Text minW={"120px"}>Transfer Date</Text>
              <InputGroup borderRadius={"md"}>
                <InputLeftElement pointerEvents="none">
                  <CalendarIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  type="datetime-local"
                  value={selectedDate}
                  onChange={(e) => {
                    const dateTimeValue = e.target.value;
                    const formattedDateTime = dateTimeValue.replace(/:00$/, "");
                    console.log(formattedDateTime);
                    setSelectedDate(formattedDateTime);
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  step="60" 
                />
              </InputGroup>
            </Box>
            <Box display={"flex"} gap={2} w={"full"}>
              <Text minW={"120px"}>Sent From</Text>
              <Box borderRadius={"md"} w={"full"}>
                <select
                  className="w-full rounded-md border border-gray-300 cursor-pointer focus:ring-[#40403F] focus:border-[#40403F]"
                  value={selectedWarehouseNameOrigin || "Select warehouse origin"}
                  onChange={(e) => {
                    const selectedWarehouse = warehouseList.find((warehouse) => warehouse.name === e.target.value);
                    setSelectedWarehouseIdOrigin(selectedWarehouse?.id);
                    setSelectedWarehouseNameOrigin(e.target.value);
                  }}>
                  <option disabled>Select warehouse origin</option>
                  {warehouseList?.map((warehouse, index) => (
                    <option key={index} value={warehouse.name}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </Box>
            </Box>

            <Box display={"flex"} gap={2} w={"full"}>
              <Text minW={"120px"}>Sent To</Text>
              <Box borderRadius={"md"} w={"full"}>
                <select
                  className="w-full rounded-md border border-gray-300 cursor-pointer focus:ring-[#40403F] focus:border-[#40403F]"
                  value={selectedWarehouseNameDestination || "Select warehouse destination"}
                  onChange={(e) => {
                    const selectedWarehouse = warehouseList.find((warehouse) => warehouse.name === e.target.value);
                    setSelectedWarehouseIdDestination(selectedWarehouse?.id);
                    setSelectedWarehouseNameDestination(e.target.value);
                  }}>
                  {isWarehouseAdmin ? (
                    <option>{selectedWarehouseNameDestination}</option>
                  ) : (
                    <>
                      <option disabled>Select warehouse destination</option>
                      {warehouseList?.map((warehouse, index) => (
                        <option key={index} value={warehouse.name}>
                          {warehouse.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </Box>
            </Box>

            <Box display={"flex"} gap={2} w={"full"}>
              <Text minW={"120px"}>Product</Text>
              <Box borderRadius={"md"} w={"200px"}>
                <select
                  className="w-full rounded-md border border-gray-300 cursor-pointer focus:ring-[#40403F] focus:border-[#40403F]"
                  value={selectedProductName || "Select product"}
                  onChange={(e) => {
                    const selectedProduct = productList.find((product) => product.name === e.target.value);
                    setSelectedProductId(selectedProduct?.id);
                    setSelectedProductName(e.target.value);
                  }}>
                  <option disabled>Select product</option>
                  {productList?.map((product, index) => (
                    <option key={index} value={product.name}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </Box>
              <InputGroup borderRadius={"md"} w={"50%"}>
                <Input type="number" placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} w={"full"} />
                <InputRightAddon children="item" />
              </InputGroup>
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            color={"#40403F"}
            borderColor={"#40403F"}
            variant={"outline"}
            _hover={{ opacity: 0.8 }}
            mr={3}
            onClick={() => {
              onClose();
            }}>
            Close
          </Button>
          <Button
            color={"white"}
            variant={"solid"}
            bgColor={"#40403F"}
            _hover={{ opacity: 0.8 }}
            onClick={() => {
              handleRequestStock();
            }}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
