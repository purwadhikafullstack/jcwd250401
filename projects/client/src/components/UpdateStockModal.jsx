import {
  Box,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getWarehouses from "../api/warehouse/getWarehouses";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronDownIcon } from "@chakra-ui/icons";
import getSingleAdmin from "../api/users/getSingleAdmin";
import getWarehouseByAdmin from "../api/warehouse/getWarehouseByAdmin";
import getStock from "../api/mutation/getStock";
import updateStock from "../api/mutation/updateStock";

export const UpdateStockModal = ({ isOpen, onClose, data }) => {
  const isWarehouseAdmin = useSelector((state) => state?.account?.isWarehouseAdmin);
  const adminData = useSelector((state) => state?.account?.adminProfile?.data?.profile);
  const totalStockEveryWarehouse = data?.Mutations;
  const [quantity, setQuantity] = useState(0);
  const [warehouseList, setWarehouseList] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedWarehouseName, setSelectedWarehouseName] = useState(null);
  const [selectedTotalStock, setSelectedTotalStock] = useState(0);
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();

  const handleUpdateStock = async () => {
    try {
      const response = await updateStock({
        productId: data?.id,
        warehouseId: selectedWarehouse,
        quantity,
        type: selectedType,
      });

      if (response.ok) {
        toast.success("Update stock success");
        onClose();
      }
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 401 || error.response.status === 403 || error.response.status === 404)) {
        toast.error(error.response.data.message);
        if (error.response.status === 401 || error.response.status === 403) navigate("/adminlogin");
      } else if (error.response.status === 500) {
        console.error(error);
        toast.error(error.response.data.detail);
      }
    }
  };
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

  // fetch admin warehouse data
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
          setWarehouseList(response2.detail);
          setSelectedWarehouse(warehouseIdFromResponse);
          setSelectedWarehouseName(response2.detail.name);
        }
      }
    } catch (error) {
      if (error.response && (error.response.status === 404 || error.response.status === 500)) {
        toast.error(error.response.data.message);
        if (error.response.status === 500) console.error(error);
      }
    }
  };

  const fetchTotalStockByWarehouseAndProductId = async () => {
    try {
      if (selectedTotalStock === 0) {
        const response = await getStock({
          productId: data?.id,
          warehouseId: selectedWarehouse,
        });
        if (response.ok) {
          const stock = response.detail.stock;
          setSelectedTotalStock(stock);
        }
      }
    } catch (error) {
      if (error.response && (error.response.status === 404 || error.response.status === 500)) {
        toast.error(error.response.data.message);
        if (error.response.status === 500) console.error(error);
      }
    }
  };

  useEffect(() => { // fetch warehouse
    if (isWarehouseAdmin) {
      fetchAdminWarehouseData();
    } else {
      fetchWarehouses();
    }
  }, []);

    useEffect(() => { // update total stock
      if(selectedWarehouse !== null) {
        fetchTotalStockByWarehouseAndProductId();
      }
    }, [selectedWarehouse]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={"2xl"}>
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
      <ModalContent>
        <ModalHeader>
          <Text fontWeight="bold">Update Stock</Text>
        </ModalHeader>
        <ModalBody display={"flex"} flexDirection={"column"} gap={3}>
          <Box display={"flex"} flexDir={{ base: "column", md: "row" }} gap={{ base: 0, md: 7 }}>
            <Text fontWeight={"bold"}>Product Information</Text>
            <Box>
              <Box display={"flex"}>
                <Text minW={"120px"}>Product name:</Text>
                <Text>{data?.name}</Text>
              </Box>
              <Box display={"flex"}>
                <Text minW={"120px"}>SKU:</Text>
                <Text>{data?.sku}</Text>
              </Box>
              <Box display={"flex"}>
                <Text minW={"120px"}>Total Stock:</Text>
                <Text>{data?.totalStockAllWarehouses}</Text>
              </Box>
            </Box>
          </Box>

          <Box>
            <Box display={"flex"} justifyContent={"space-evenly"}>
              <Text mb={2} fontWeight={"semibold"} w={"30%"}>
                Stock
              </Text>
              <Text mb={2} fontWeight={"semibold"} w={"30%"}>
                Warehouse Name
              </Text>
              <Text mb={2} fontWeight={"semibold"} w={"30%"}>
                Current Stock
              </Text>
            </Box>

            <Box display={"flex"} flexDirection={"column"} gap={3} h={"100px"} overflowY={"auto"}>
              {isWarehouseAdmin ? (
                <Box display={"flex"} justifyContent={"space-evenly"}>
                  <Box w={"30%"}></Box>
                  <Text w={"30%"}>{selectedWarehouseName}</Text>
                  <Text w={"30%"}>{selectedTotalStock ? selectedTotalStock : 0}</Text>
                </Box>
              ) : (
                totalStockEveryWarehouse?.map((item, index) => (
                  <Box key={index} display={"flex"} justifyContent={"space-evenly"}>
                    <Box w={"30%"}></Box>
                    <Text w={"30%"}>{item?.warehouseName}</Text>
                    <Text w={"30%"}>{item?.totalStock}</Text>
                  </Box>
                ))
              )}
            </Box>
          </Box>

          <Text fontWeight={"bold"}>Update Stock</Text>
          <Box display={"flex"} flexDir={{ base: "column", md: "row" }} gap={3}>
            <Box display={"flex"} gap={3} w={"100%"}>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} color={"#40403F"} borderColor={"#40403F"} variant={"outline"} _hover={{ opacity: 0.8 }} _expanded={{ bg: "#40403F", color: "white" }} w={{ base: "50%", md: "50%" }}>
                  {selectedWarehouseName ? selectedWarehouseName : "Warehouse"}
                </MenuButton>
                <MenuList>
                  {isWarehouseAdmin ? (
                    <MenuItem
                      onClick={() => {
                        setSelectedWarehouse(warehouseList?.id);
                        setSelectedWarehouseName(warehouseList?.name);
                      }}>
                      {warehouseList?.name}
                    </MenuItem>
                  ) : (
                    warehouseList?.map((warehouse, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => {
                          setSelectedWarehouse(warehouse?.id);
                          setSelectedWarehouseName(warehouse?.name);
                        }}>
                        {warehouse?.name}
                      </MenuItem>
                    ))
                  )}
                </MenuList>
              </Menu>

              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} color={"#40403F"} borderColor={"#40403F"} variant={"outline"} _hover={{ opacity: 0.8 }} _expanded={{ bg: "#40403F", color: "white" }} w={{ base: "50%", md: "50%" }}>
                  {selectedType ? selectedType : "Action"}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setSelectedType("add")}>Add</MenuItem>
                  <MenuItem onClick={() => setSelectedType("subtract")}>Subtract</MenuItem>
                </MenuList>
              </Menu>
            </Box>

            <Input type="number" placeholder="Enter new stock amount" onChange={(e) => setQuantity(e.target.value, 10)} w={{ base: "100%", md: "50%" }} />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            color={"#40403F"}
            borderColor={"#40403F"}
            variant={"outline"}
            _hover={{ opacity: 0.8 }}
            mr={3}
            w={"30%"}
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
            w={"30%"}
            onClick={() => {
              handleUpdateStock();
            }}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
