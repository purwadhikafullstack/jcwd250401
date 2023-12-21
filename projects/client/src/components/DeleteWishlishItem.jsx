import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Button, Flex, Image, Img } from "@chakra-ui/react";

import { Text } from "@chakra-ui/react";
import api from "../api";
import { toast } from "sonner";
import { addProduct } from "../slices/productSlices";
import { useDispatch } from "react-redux";

function DeleteWishlistItem({ isOpen, isClose, productId, onSuccess }) {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/api/wishlist/${productId}`);
      const responseData = response.data.detail;
      isClose();
      onSuccess(); 
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
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={isClose} size="md" motionPreset="slideInBottom" isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(1px)" />
      <ModalContent>
        <ModalHeader>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Remove wishlist</h3>
        </ModalHeader>
        <ModalBody>
          <Text>Are you sure you want to delete this item on your wishlist?</Text>
        </ModalBody>
        <ModalFooter>
          <div className="flex gap-2">
            <Button px={4} py={2} bgColor="white" textColor="gray.900" size="medium" borderRadius="lg" boxShadow="lg" onClick={isClose}>
              Cancel
            </Button>
            <Button px={4} py={2} bgColor="red.600" _hover={{ bgColor: "red.800" }} textColor="white" size="medium" borderRadius="lg" boxShadow="lg" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </ModalFooter>

      </ModalContent>
    </Modal>
  );
}

export default DeleteWishlistItem;
