import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import React from "react";
import api from "../api";
import { toast } from "sonner";
import { removeAddress } from "../slices/addressSlices";
import { useDispatch } from "react-redux";

export const ConfirmModal = ({ isOpen, onClose, data, userId, deleteFor }) => {
  const dispatch = useDispatch();
  const handleDelete = async () => {
    try {
      if (deleteFor === "address") {
        const response = await api.delete(`/address/${userId}/${data?.id}`);
        dispatch(removeAddress(data?.id));
        toast.success(response.data.message);
      } else if (deleteFor === "admin") {
        const response = await api.admin.delete(`/users/admin/${userId}`);
        toast.success(response.data.message);
      }
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
            <p>Are you sure you want to delete this {deleteFor}?</p>
            <div className="font-bold rounded-md mt-2">
              {deleteFor === "address" ? (
                <>
                  <p className="text-md text-gray-600">{`${data?.firstName} ${data?.lastName}`}</p>
                  <p className="text-md text-gray-600">{`${data?.street}, ${data?.district}, ${data?.subDistrict}, ${data?.city}, ${data?.province}, ${data?.phoneNumber}`}</p>
                </>
              ) : (
                <>
                  <p className="text-md text-gray-600">Username: {data?.username}</p>
                  <p className="text-md text-gray-600">Email: {data?.email}</p>
                  <p className="text-md text-gray-600">Role: {data?.isWarehouseAdmin ? "Warehouse Admin" : "Super Admin"}</p>
                </>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="border border-[#40403F] text-[#40403F] p-2 rounded-md mr-2" onClick={onClose}>
              Cancel
            </button>
            <button className="bg-[#40403F] hover:bg-[#515150] p-2 text-white rounded-md" onClick={handleDelete}>
              Confirm
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
