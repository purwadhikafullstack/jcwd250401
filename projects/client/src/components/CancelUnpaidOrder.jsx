import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Button, Flex, Image, Img } from "@chakra-ui/react";

import { Text } from "@chakra-ui/react";
import { toast } from "sonner";
import cancelUnpaidOrder from "../api/order/cancelUnpaidOrder";

function CancelUnpaidOrder({ isOpen, onClose, orderId, onSuccess }) {
  const handleDelete = async () => {
    try {
      const response = await cancelUnpaidOrder({ orderId });
      onClose();
      onSuccess();
      toast.success(response.message);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.message, {
          description: error.response.detail,
        });
      } else if (error.response && error.response.status === 500) {
        toast.error(error.response.message, {
          description: error.response.detail,
        });
      } else if (error.request) {
        // Handle request errors
        setTimeout(() => {
          toast.error("Network error, please try again later");
        }, 2000);
      }
    }
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size="md" motionPreset="slideInBottom" isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(1px)" />
      <ModalContent>
        <ModalHeader>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Cancel Order</h3>
        </ModalHeader>
        <ModalBody>
          <Text>Are you sure you want to cancel this order?</Text>
        </ModalBody>
        <ModalFooter>
          <div className="flex gap-2">
            <Button px={4} py={2} bgColor="white" textColor="gray.900" size="medium" borderRadius="lg" boxShadow="lg" onClick={onClose}>
              Go back
            </Button>
            <Button px={4} py={2} bgColor="red.600" _hover={{ bgColor: "red.800" }} textColor="white" size="medium" borderRadius="lg" boxShadow="lg" onClick={handleDelete}>
              Proceed
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CancelUnpaidOrder;
