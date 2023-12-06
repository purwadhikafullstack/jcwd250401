import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner'; // Assuming react-toastify for toasts
import getProfile from '../api/profile/getProfile';
import getUserAddress from '../api/Address/getUserAddress';
import { SetDefaultAddressModal } from "../components/SetDefaultAddressModal";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";

const AddressListModal = ({ isOpen, onClose, username, handleSetDefault }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [defaultAddressModal, setDefaultAddressModal] = useState(false);
  const [userData, setUserData] = useState(null);

  const userId = userData?.id;

  const handleDefaultAddressModal = (address) => {
    setSelectedAddress(address);
    setDefaultAddressModal(!defaultAddressModal);
  };

  const fetchAddress = useCallback(async () => {
    try {
      const profileResponse = await getProfile({ username });
      setUserData(profileResponse.detail);

      const addressesResponse = await getUserAddress({ userId: profileResponse.detail.id });
      setAddresses(addressesResponse.detail);
    } catch (error) {
      toast.error(error.message);
    }
  }, [username]);

  useEffect(() => {
    if (isOpen) {
      fetchAddress();
    }
  }, [isOpen, fetchAddress]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside" isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(1px)" />
        <ModalContent>
          <ModalHeader py={0}>
            <div className="px-4 lg:mt-7 mt-10 lg:mb-0 mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">User Addresses </h3>
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="scrollbar-hide">
        {addresses.filter((address) => address.setAsDefault).map((defaultAddress, index) => (
                    <div className="border border-gray-300 rounded-lg p-5 mt-5">
                      <div className="flex flex-col justify-between">
                        <div className="flex flex-row">
                          <div className="w-[30%]">
                            <p className="text-md text-gray-600">{`${defaultAddress.firstName.charAt(0).toUpperCase()}${defaultAddress.firstName.slice(1)} ${defaultAddress.lastName.charAt(0).toUpperCase()}${defaultAddress.lastName.slice(
                              1
                            )}`}</p>
                          </div>

                          <div className="w-[70%] flex">
                            <p className="text-md text-gray-600">{`${defaultAddress.street.charAt(0).toUpperCase()}${defaultAddress.street.slice(1)}, ${defaultAddress.district}, ${defaultAddress.subDistrict}, ${defaultAddress.city}, ${
                              defaultAddress.province
                            }, ${defaultAddress.phoneNumber}`}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2">
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col mt-5">
                    {addresses
                      .filter((address) => !address.setAsDefault)
                      .map((address, index) => (
                        <div key={index}>
                          <div className="flex flex-col rounded-lg p-5 mb-5 shadow-md">
                            <div className="flex flex-col lg:flex-row justify-between">
                              <div className="flex flex-row mr-2">
                                <div className="w-[30%]">
                                  <p className="text-md text-gray-600">{`${address.firstName.charAt(0).toUpperCase()}${address.firstName.slice(1)} ${address.lastName.charAt(0).toUpperCase()}${address.lastName.slice(1)}`}</p>
                                </div>

                                <div className="w-[70%] flex">
                                  <p className="text-md text-gray-600">{`${address.street.charAt(0).toUpperCase()}${address.street.slice(1)}, ${address.district}, ${address.subDistrict}, ${address.city}, ${address.province}, ${
                                    address.phoneNumber
                                  }`}</p>
                                </div>
                              </div>
                              <div className="flex lg:flex-col items-center justify-between w-[100%] gap-2 mt-2">
                                <div className="flex lg:flex-col gap-2">
                                  <button className="bg-white enabled:hover:bg-gray-100 text-black border border-gray-300 font-semibold py-2 px-4 rounded" onClick={() => handleDefaultAddressModal(address)}>
                                    Set As Default
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {selectedAddress && <SetDefaultAddressModal isOpen={defaultAddressModal} onClose={() => setDefaultAddressModal(false)} addressData={selectedAddress} userId={userId} />}
                      </div>
            </ModalBody>
            </ModalContent>
            </Modal>
  );
};

export default AddressListModal;