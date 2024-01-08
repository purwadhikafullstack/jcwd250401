import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Button, Flex, Image, Img } from "@chakra-ui/react";

import { Text } from "@chakra-ui/react";
import api from "../api";
import { toast } from "sonner";
import { addProduct } from "../slices/productSlices";
import { useDispatch } from "react-redux";

function ArchiveProductModal({ isOpen, isClose, data }) {
  const dispatch = useDispatch();

  const handleArchive = async () => {
    try {
      const response = await api.admin.put(`/api/product/archive/${data.id}`);
      const responseData = response.data.details;

      dispatch(addProduct(responseData));
      isClose();
      toast.success(response.data.message);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message, {
          description: error.response.data.detail,
        });
      } else if (error.response && error.response.status === 500) {
        toast.error(error.response.data.message, {
          description: error.response.data.detail,
        });
      }
      else if (error.request) {
        // Handle request errors
        setTimeout(() => {
          toast.error("Network error, please try again later");
        }, 2000);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={isClose} size="md" motionPreset="slideInBottom" isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(1px)" />
      <ModalContent>
        <ModalHeader>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Archive Product</h3>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure you want to Archive this product?</Text>
          <div className="flex flex-col items-center justify-center mt-4">
            <div
              className="flex justify-center items-center h-[200px] w-[160px] shadow-lg"
              style={{ backgroundImage: `url(http://localhost:8000/public/${data.productImages[0]?.imageUrl})`, backgroundSize: "cover", backgroundRepeat: "no-repeat" }}
            ></div>
            <Flex mt={4} gap={2} flexDirection="column" justifyContent="center" alignItems="center">
              <Text fontWeight="bold">{data.name}</Text>
              <Text> SKU : {data.sku}</Text>
            </Flex>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex gap-2 mb-4">
            <Button px={4} py={2} bgColor="white" textColor="gray.900" size="medium" borderRadius="md" boxShadow="lg" onClick={isClose}>
              Cancel
            </Button>
            <Button px={4} py={2} bgColor="gray.700" _hover={{ bgColor: "gray.900" }} textColor="white" size="medium" borderRadius="md" boxShadow="lg" onClick={handleArchive}>
              Archive
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ArchiveProductModal;
