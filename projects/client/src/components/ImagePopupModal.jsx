// ImagePopup.js
import React from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Flex, Image } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ZoomableImageOnModal from "./ZoomableImageOnModal";

function ImagePopup({ images, activeIndex, onClose }) {
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          zIndex: "20",
          marginRight: "-40px",
          transform: "scale(3)",
        }}
        onClick={onClick}
      ></div>
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          zIndex: "20",
          marginLeft: "-40px",
          transform: "scale(3)",
        }}
        onClick={onClick}
      ></div>
    );
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <Modal isOpen onClose={onClose} size="xl" isCentered motionPreset="scale">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bgColor={"transparent"} boxShadow={"none"} >
        <ModalCloseButton zIndex="overlay" />
        <ModalBody style={{ margin: 0, padding: 3, borderRadius: "md" }} bg={"transparent"}>
          <Flex flexDirection={"row"} justifyContent="center" borderRadius={"md"}>
            <Slider {...settings} className="h-[750px] w-[560px] shadow-xl rounded-xl cursor-zoom-in">
              {images.map((image, idx) => (
                <ZoomableImageOnModal imageUrl={`http://localhost:8000/public/${image.imageUrl}`} alt={`Product Image ${idx}`} />
              ))}
            </Slider>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ImagePopup;
