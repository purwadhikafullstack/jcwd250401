import { Box, Button, Heading, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import assignAdmin from "../api/users/assignAdmin";
import unAssignAdmin from "../api/users/unAssignAdmin";
import getWarehouses from "../api/warehouse/getWarehouses";
export const AdminAssignmentModal = ({ isOpen, onClose, data = null, userId = null, mode }) => {
  const [warehouseList, setWarehouseList] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const navigate = useNavigate();

  const handleAssignment = async () => {
    try {
      if (mode === "assign") {
        const response = await assignAdmin({
          userId,
          warehouseId: selectedWarehouse,
        });

        if (response.ok) {
          toast.success("Assign admin success");
          setSelectedWarehouse(null);
          onClose();
        }
      } else if (mode === "unassign") {
        const response = await unAssignAdmin({
          warehouseId: selectedWarehouse,
        });

        if (response.ok) {
          toast.success("Unassign admin success");
          setSelectedWarehouse(null);
          onClose();
        }
      }
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 404 || error.response.status === 500 || error.response.status === 401 || error.response.status === 403)) {
        toast.error(error.response.data.message, {
          description: error.response.data.detail,
        });
        if (error.response.status === 401 || error.response.status === 403) navigate("/adminlogin");
        if (error.response.status === 500) console.error(error);
      }
    }
  };

  const handleCancel = () => {
    setSelectedWarehouse(null);
    onClose();
  };

  const fetchWarehouses = async () => {
    try {
      const response = await getWarehouses({
        mode,
        userId,
      });
      setWarehouseList(response.data);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 404 || error.response.status === 500)) {
        toast.error(error.response.data.message);
        if (error.response.status === 401 || error.response.status === 403) navigate("/adminlogin");
        if (error.response.status === 500) console.error(error);
      }
    }
  };
  useEffect(() => {
    fetchWarehouses();
  }, [userId]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"md"} isCentered>
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
      <ModalContent>
        <ModalHeader>
          <Heading as="h2" size="lg" mb={4}>
            {mode === "assign" ? "Assign Admin" : "Unassign Admin"}
          </Heading>
        </ModalHeader>
        <ModalBody>
          <Box>
            <Text mb={2}>
              "{data?.username}" will be {mode === "assign" ? "assigned" : "unassigned"} {mode === "assign" ? "to" : "from"}
            </Text>
            <Menu>
              <MenuButton bgColor={"white"} _hover={{ bgColor: "white" }} border={"1px solid #40403F"} color={"#40403F"} borderRadius={"5px"} p={2} w={"50%"}>
                {selectedWarehouse ? warehouseList.find((warehouse) => warehouse.id === selectedWarehouse)?.name : "Select Warehouse"}
              </MenuButton>
              {warehouseList?.length > 0 ? (
                <MenuList>
                  {warehouseList?.map((warehouse) => (
                    <MenuItem key={warehouse.id} onClick={() => setSelectedWarehouse(warehouse.id)}>
                      {warehouse.name}
                    </MenuItem>
                  ))}
                </MenuList>
              ) : (
                <MenuList>
                  <MenuItem>No warehouse found</MenuItem>
                </MenuList>
              )}
            </Menu>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" borderColor="#40403F" color="#40403F" p={2} rounded="md" mr={2} onClick={handleCancel}>
            Cancel
          </Button>

          <Button bg="#40403F" _hover={{ bg: "#515150" }} color="white" p={2} rounded="md" onClick={handleAssignment}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
