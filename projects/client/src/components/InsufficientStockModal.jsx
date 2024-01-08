import React, { useEffect, useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, Box, Text, Flex, Spinner, ModalCloseButton, ModalFooter, ModalHeader } from "@chakra-ui/react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { deleteAllCartItem } from "../slices/cartSlices";
import { useDispatch } from "react-redux";


function InsufficientStockModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDeleteAll = () => {
    dispatch(deleteAllCartItem());
  };

  const handleClose = () => {
    handleDeleteAll();
    onClose();
    navigate("/account/shopping-cart");
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} size="md" onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <span className="font-bold">Insufficient Stock</span>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>
            <span className="text-sm"> Some of the products in your order have insufficient stock. Redirecting you to your shopping cart to review and adjust your order.</span>
          </div>
          <div className="flex justify-center mt-4 mb-4 gap-4">
            <Button
              className="w-full bg-gray-900 enabled:hover:bg-gray-700"
              size="sm"
              onClick={() => {
                navigate("/account/shopping-cart");
                handleDeleteAll();
              }}
            >
              Shopping Cart
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default InsufficientStockModal;
