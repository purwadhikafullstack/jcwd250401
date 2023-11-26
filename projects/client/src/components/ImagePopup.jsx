// ImagePopup.js
import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Flex, Image } from "@chakra-ui/react";
import Slider from "react-slick";
import { Carousel } from "flowbite-react";

function ImagePopup({ images, activeIndex, onClose }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: activeIndex,
  };

  return (
    <Modal isOpen onClose={onClose} size="4xl" isCentered motionPreset="slideInLeft">
      <ModalOverlay backdropFilter="blur(1px)" />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody style={{margin:0, padding:3}}>
          <Flex flexDirection={"row"} overflowY="auto" >
            {images.map((image, idx) => (
              <Image src={`http://localhost:8000/public/${image.imageUrl}`} alt={`Popup Image ${idx}`} w="480px" boxShadow="md" />
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ImagePopup;
