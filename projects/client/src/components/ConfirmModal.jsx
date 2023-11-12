import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import React from "react";
import api from "../api";
import { toast } from "sonner";
import { removeAddress } from "../slices/addressSlices";
import { useDispatch } from "react-redux";

export const ConfirmModal = ({ isOpen, onClose, addressData, userId }) => {
  const dispatch = useDispatch();
  const handleDeleteAddress = async () => {
    try {
      const response = await api.delete(`/address/${userId}/${addressData?.id}`);
      dispatch(removeAddress(addressData?.id));
      toast.success(response.data.message);
      onClose();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"md"} isCentered>
        <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
        <ModalContent>
          <ModalHeader>
            <h2>Confirmation</h2>
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this address?</p>
            <div className="border border-black rounded-md mt-2 p-2">
              <p className="text-md text-gray-600">{`${addressData?.firstName} ${addressData?.lastName}`}</p>
              <p className="text-md text-gray-600">{`${addressData?.street}, ${addressData?.district}, ${addressData?.subDistrict}, ${addressData?.city}, ${addressData?.province}, ${addressData?.phoneNumber}`}</p>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="bg-slate-900 hover:bg-slate-700 text-white p-2 rounded-md mr-2" onClick={onClose}>
              Cancel
            </button>
            <button className="bg-red-700 hover:bg-red-800 p-2 text-white rounded-md" onClick={handleDeleteAddress}>
              Confirm
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};