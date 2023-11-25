import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { removeCategory } from "../slices/categorySlices";
import deleteCategory from "../api/categories/deleteCategory";

export const ConfirmDeleteCategory = ({ isOpen, onClose, data }) => {
  const dispatch = useDispatch();

  const handleDeleteCategory = async () => {
    await deleteCategory({
      id: data?.id,
    });
    dispatch(removeCategory(data?.id));
    toast.success("Category deleted successfully", {
      duration: 800,
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
            <div className="font-bold rounded-md mt-2">
              <p className="text-md text-gray-600">{data?.name}</p>
            </div>
          </ModalBody>

          <ModalFooter>
            <button className="border border-[#40403F] text-[#40403F] p-2 rounded-md mr-2" onClick={onClose}>
              Cancel
            </button>
            <button className="bg-[#40403F] hover:bg-[#515150] p-2 text-white rounded-md" onClick={handleDeleteCategory}>
              Confirm
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
