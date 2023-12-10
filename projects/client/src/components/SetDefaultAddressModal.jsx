import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { updateAddress } from "../slices/addressSlices";
import { useFormik } from "formik";
import editAddress from "../api/Address/editAddress";

export const SetDefaultAddressModal = ({ isOpen, onClose, addressData, userId }) => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      setAsDefault: addressData?.setAsDefault,
    },
    onSubmit: async (values) => {
      try {
        const response = await editAddress({
          userId,
          addressId: addressData.id,
          setAsDefault: values.setAsDefault,
          firstName: addressData?.firstName,
          lastName: addressData?.lastName,
          street: addressData?.street,
          province: addressData?.province,
          provinceId: addressData?.provinceId,
          city: addressData?.city,
          cityId: addressData?.cityId,
          district: addressData?.district,
          subDistrict: addressData?.subDistrict,
          phoneNumber: addressData?.phoneNumber,
          setAsDefault: values.setAsDefault,
        })

        if (values.setAsDefault) {
          if (response.ok) {
            dispatch(updateAddress(response.detail));
            formik.resetForm();
            toast.success("Set as default address successfully");
            onClose();
          }
        } else {
          toast.info("Please select the checkbox");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("Unable to set as default address");
        } else if (error.response && error.response.status === 500) {
          toast.error("Server error", {
            description: error.response.data.detail,
          });
          console.error(error);
        }
      }
    },
  });
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
      <ModalContent>
        <ModalHeader>Set Default Address</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <p>Are you sure you want to set this address as your default address?</p>
            <div className="border border-black rounded-md mt-2 p-2">
              <p className="text-md text-gray-600">{`${addressData?.firstName} ${addressData?.lastName}`}</p>
              <p className="text-md text-gray-600">{`${addressData?.street}, ${addressData?.district}, ${addressData?.subDistrict}, ${addressData?.city}, ${addressData?.province}, ${addressData?.phoneNumber}`}</p>
            </div>
            <label htmlFor="setAsDefault" className="flex items-center mt-2">
              <input type="checkbox" id="setAsDefault" name="setAsDefault" className="mr-2" {...formik.getFieldProps("setAsDefault")} />
              <span>Set as default address</span>
            </label>
          </ModalBody>
          <ModalFooter>
            <button type="submit" className="bg-red-700 hover:bg-red-800 p-2 text-white rounded-md">
              Set as default
            </button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
