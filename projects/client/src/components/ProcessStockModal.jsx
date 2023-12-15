import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import processStockOrder from "../api/mutation/processStockOrder";
import {toast} from "sonner";

export const ProcessStockModal = ({ isOpen, onClose, data, action }) => {
  const handleProcessOrder = async () => {
    try {
      const response = await processStockOrder({
        mutationId: data?.mutationId,
        action,
      });

      if (response.ok) {
        toast.success(response.message);
        onClose();
      }
    } catch (error) {
      onClose();
      if ((error.response && error.response.status === 400) || error.response.status === 404 || error.response.status === 500) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={"md"}>
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
      <ModalContent>
        <ModalHeader>
          <h2>{action} Confirmation</h2>
        </ModalHeader>

        <ModalBody>
          <p>Are you sure you want to {action} this order?</p>
          <div className="font-bold rounded-md mt-2">
            <p className="text-md text-gray-600">{data?.Product?.name}</p>
            <p className="text-md text-gray-600">Total Request: {data?.mutationQuantity}</p>
            <p className="text-md text-gray-600">Sent From: {data?.sourceWarehouseData.name}</p>
            <p className="text-md text-gray-600">Sent To: {data?.destinationWarehouseData.name}</p>
          </div>
        </ModalBody>

        <ModalFooter>
          <button className="border border-[#40403F] text-[#40403F] p-2 rounded-md mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-[#40403F] hover:bg-[#515150] p-2 text-white rounded-md" onClick={handleProcessOrder}>
            Confirm
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
