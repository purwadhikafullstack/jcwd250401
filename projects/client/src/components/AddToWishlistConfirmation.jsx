import React, { useEffect, useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, Box, Text, Flex, Spinner, ModalCloseButton, ModalFooter, ModalHeader } from "@chakra-ui/react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { Checkmark } from "react-checkmark";
import WishlistModal from "./WishlistModal";

function AddToWishlistConfirmation({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [wishlistModalIsOpen, setWishlistModalIsOpen] = useState(false);

  const handleWishlistModalClose = () => {
    setWishlistModalIsOpen(false);
  };

  const handleWishListModalOpen = () => {
    setWishlistModalIsOpen(true);
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} size="md" onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <span className="font-bold">Wishlist</span>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col space-y-4 justify-center items-center">
            <Checkmark size="80px" color="#223344" />
            <div>
              <span className="text-center">An item has been added to wishlist</span>
            </div>
          </div>
          <div className="flex justify-between mt-4 mb-4 gap-4">
            <Button className="w-full border border-gray-500" color="light" size="sm" onClick={onClose}>
              Continue Shopping
            </Button>
            <Button className="w-full bg-gray-900 enabled:hover:bg-gray-700" size="sm" onClick={handleWishListModalOpen}>
              View Wishlist
            </Button>
          </div>
          <WishlistModal isOpen={wishlistModalIsOpen} isClose={handleWishlistModalClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default AddToWishlistConfirmation;
