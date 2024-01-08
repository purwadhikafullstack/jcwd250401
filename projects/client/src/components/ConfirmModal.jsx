import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import React from "react";
import { toast } from "sonner";
import { removeAddress } from "../slices/addressSlices";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import deleteAddress from "../api/Address/deleteAddress";
import deleteAdmin from "../api/users/deleteAdmin";
import { logoutAdmin } from "../slices/accountSlices";

export const ConfirmModal = ({ isOpen, onClose, data, userId, deleteFor }) => {
  const currentAdmin = useSelector((state) => state.account.adminProfile.data?.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleDelete = async () => {
    try {
      if (deleteFor === "address") {
        const response = await deleteAddress({ userId, addressId: data?.id });
        dispatch(removeAddress(data?.id));
        toast.success(response.message);
      } else if (deleteFor === "admin") {
        const response = await deleteAdmin({ userId });
        console.log(response);
        if (response.detail.email === currentAdmin.email && response.detail.username === currentAdmin.username) {
          dispatch(logoutAdmin());
          navigate("/adminlogin");
        }
        toast.success(response.message);
      }
      onClose();
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
  return (
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
  );
};
