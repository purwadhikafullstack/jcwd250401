import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import api from "../api";
import { toast } from "sonner";

export const ConfirmDeleteCategory = ({ isOpen, onClose, data }) => {
  const handleDeleteCategory = async () => {
    await api.delete(`/category/${data?.id}`);
    toast.success("Category deleted successfully", {
      duration: 700,
      autoClose: 500,
      onAutoClose: (t) => {
        onClose();
      },
    });
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={"md"}>
        <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
        <ModalContent>
          <ModalHeader>
            <h2>Delete Confirmation</h2>
          </ModalHeader>

          <ModalBody>
            <p>Are you sure you want to delete this category?</p>
            <div className="border border-black rounded-md mt-2 p-2">
              <p className="text-md text-gray-600">{data?.name}</p>
            </div>
          </ModalBody>

          <ModalFooter>
            <button className="bg-slate-900 hover:bg-slate-700 text-white p-2 rounded-md mr-2" onClick={onClose}>
              Cancel
            </button>
            <button className="bg-red-700 hover:bg-red-800 p-2 text-white rounded-md" onClick={handleDeleteCategory}>Confirm</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
