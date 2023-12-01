import React, { useEffect, useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, Box, Text, Flex, Spinner, ModalCloseButton, ModalFooter, ModalHeader } from "@chakra-ui/react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

function AddToCartConfirmation({ isOpen, onClose, quantity, price }) {

  const navigate = useNavigate();

  const formatToRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(price);
  };


  const totalPrice = formatToRupiah(price * quantity);

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} size="md" onClose={onClose} isCentered >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <span className="font-bold">{quantity} Item(s) Added To Your Cart</span>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex justify-between">
            <div className="space-x-2 text-md">
              <span className="font-bold">Sub total</span>
              <span>{quantity} item(s)</span>
            </div>
            <div>
              <span className="font-bold text-md"> {totalPrice} </span>
            </div>
          </div>
          <div className="flex justify-between mt-4 mb-4 gap-4">
            <Button className="w-full border border-gray-500" color="light" size="sm" onClick={onClose}>
              Continue Shopping
            </Button>
            <Button className="w-full bg-gray-900 enabled:hover:bg-gray-700" size="sm" onClick={() => navigate("/account/shopping-cart")}>
              View Cart
            </Button>
          </div>

        </ModalBody>
        
      </ModalContent>
    </Modal>
  );
}

export default AddToCartConfirmation;
