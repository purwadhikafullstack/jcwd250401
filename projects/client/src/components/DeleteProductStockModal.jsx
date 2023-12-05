import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronDownIcon } from "@chakra-ui/icons";
import getWarehouses from "../api/warehouse/getWarehouses";
import getStock from "../api/mutation/getStock";
import getSingleAdmin from "../api/users/getSingleAdmin";
import getWarehouseByAdmin from "../api/warehouse/getWarehouseByAdmin";
import deleteProductStock from "../api/mutation/deleteProductStock";

export const DeleteProductStockModal = ({ isOpen, onClose, data }) => {
  const isWarehouseAdmin = useSelector((state) => state?.account?.isWarehouseAdmin);
  const adminData = useSelector((state) => state?.account?.adminProfile?.data?.profile);
  const totalStockEveryWarehouse = data?.Mutations;
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedWarehouseName, setSelectedWarehouseName] = useState(null);
  const [warehouseList, setWarehouseList] = useState([]);
  const [selectedTotalStock, setSelectedTotalStock] = useState(0);
  const navigate = useNavigate();

  const handleDeleteStock = async () => {
    try {
      const response = await deleteProductStock({
        productId: data?.id,
        warehouseId: selectedWarehouse,
      });

      if (response.ok) {
        toast.success("Delete stock success");
        onClose();
      }
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 401 || error.response.status === 403 || error.response.status === 404 || error.response.status === 500)) {
        toast.error(error.response.data.message);
        if (error.response.status === 401 || error.response.status === 403) navigate("/adminlogin");
        if (error.response.status === 500) console.error(error);
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

  useEffect(() => {
    if (!isWarehouseAdmin) {
      fetchWarehouses();
    } else {
      fetchAdminWarehouseData();
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={"lg"}>
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
      <ModalContent>
        <ModalHeader>
          <Text fontWeight="bold">Delete Stock</Text>
        </ModalHeader>
        <ModalBody display={"flex"} flexDirection={"column"} gap={3}>
          <Box>
            <Text>Product: {data?.name}</Text>
            <Text>Total Stock: {data?.totalStockAllWarehouses}</Text>
            <Text>SKU: {data?.sku}</Text>
          </Box>

          <Box>
            <Text mb={2} fontWeight={"semibold"}>
              Total Stock Every Warehouse:
            </Text>
            <div className="px-3 h-[110px] overflow-y-auto scrollbar-hide border border-1-black rounded-md">
              <Accordion allowToggle>
                {isWarehouseAdmin ? (
                  <AccordionItem border={"solid 1px #40403F"} borderRadius={"md"} my={2}>
                    <h2>
                      <AccordionButton onClick={fetchTotalStockByWarehouseAndProductId}>
                        <Box as="span" flex="1" textAlign="left">
                          Warehouse: {selectedWarehouseName}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>Total Stock: {selectedTotalStock ? selectedTotalStock : 0} </AccordionPanel>
                  </AccordionItem>
                ) : (
                  totalStockEveryWarehouse?.map((item, index) => (
                    <AccordionItem key={index} border={"solid 1px #40403F"} borderRadius={"md"} my={2}>
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left">
                            Warehouse: {item?.warehouseName}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>Total Stock: {item?.totalStock}</AccordionPanel>
                    </AccordionItem>
                  ))
                )}
              </Accordion>
            </div>
          </Box>

          <Menu>
            <Text fontWeight={"semibold"}> Select Warehouse: </Text>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} color={"white"} variant={"solid"} bgColor={"#40403F"} _hover={{ opacity: 0.8 }} _expanded={{ bg: "#40403F", color: "white" }}>
              {selectedWarehouseName ? selectedWarehouseName : "Select Warehouse ..."}
            </MenuButton>
            <MenuList>
              {isWarehouseAdmin ? (
                <MenuItem
                  onClick={() => {
                    setSelectedWarehouse(warehouseList?.id);
                    setSelectedWarehouseName(warehouseList?.name);
                  }}>
                  {warehouseList.name}
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
              handleDeleteStock();
            }}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
