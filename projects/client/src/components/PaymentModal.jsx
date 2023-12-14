import React from 'react';
import { Button } from 'flowbite-react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Image } from '@chakra-ui/react';

const PaymentModal = ({ isOpen, onClose, paymentProof }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="bg-white shadow-md rounded-lg">
        <ModalHeader className="text-gray-700 text-xl font-bold text-center">Payment Proof</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image 
            src={`http://localhost:8000/public/${paymentProof}`} 
            alt="Payment Proof" 
            className="w-full h-auto rounded-md" 
            fallback={
            <div className="w-full h-auto rounded-md flex items-center justify-center">
              <p className="text-gray-400" style={{ fontStyle: 'italic' }}>No payment proof</p>
            </div>
            } />
        </ModalBody>
        <ModalFooter>
          <Button className="w-full shadow-md shadow-gray-200 focus:ring-transparent bg-[#40403F] enabled:hover:bg-[#777777]" size="lg" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;