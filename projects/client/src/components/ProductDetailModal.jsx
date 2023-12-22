import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Button } from 'flowbite-react';

function ProductDetailModal({ isOpen, onClose, Products }) {
  const formatToRupiah = (price) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(price);
    }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent className="bg-white p-6 rounded-lg shadow">
        <ModalHeader className="text-gray-700">Product Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody className="text-gray-600">
        <div className="flex justify-start items-start md:space-x-10 md:overflow-x-auto py-4 md:flex-row flex-col">
        {/* Iterate over the Products */}
        {Products.map(({ Product, quantity }, index) => (
            <div key={index} className="flex flex-col">
            {/* Product Image and Basic Info */}
            <div className="flex gap-2 mb-4">
                <img 
                src={`http://localhost:8000/public/${Product.productImages[0].imageUrl}`} 
                alt={Product.productName} 
                className="w-20 h-20 object-cover rounded-md" 
                />
                <div className="flex flex-col ml-2">
                <p className="text-sm font-bold">{Product.productName}</p>
                <p className="text-sm">{Product.productSku}</p>
                <p className="text-sm">{formatToRupiah(Product.productPrice)} x {quantity}</p>
                </div>
            </div>

            {/* Additional Product Details */}
            <div className='flex flex-col ml-2'>
                <div className='mb-5'>
                <p className='text-sm font-bold'>Product Gender</p>
                <p className='text-sm'>{Product.productGender}</p>
                </div>
                <div className='mb-5'>
                <p className='text-sm font-bold'>Product Size</p>
                <p className='text-sm'>{Product.productLength} x {Product.productWidth} x {Product.productHeight} cm</p>
                </div>
                <div className='mb-5'>
                <p className='text-sm font-bold'>Product Weight</p>
                <p className='text-sm'>{Product.productWeight} kg</p>
                </div>
                <div className='mb-5'>
                <p className='text-sm font-bold'>Product Material</p>
                <p className='text-sm'>{Product.productMaterial}</p>
                </div>
                <div className='mb-5'>
                <p className='text-sm font-bold'>Waterproof Rating</p>
                <p className='text-sm'>{Product.productWaterproofRating}</p>
                </div>
            </div>
            </div>
        ))}
        </div>
        </ModalBody>
        <ModalFooter>
          <Button color="dark" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ProductDetailModal;