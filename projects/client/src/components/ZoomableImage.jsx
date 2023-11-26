import React, { useEffect, useState } from "react";
import ImagePopup from "./ImagePopupModal";

const ZoomableImage = ({ imageUrl, alt, images }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showPopup, setShowPopup] = useState(false);

  const handleMouseMove = (e) => {
    setPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  useEffect(() => {
    if (showPopup) {
      setIsHovered(false);
    }
  }, [showPopup]);

  return (
    <div className=" h-[480px] w-[480px] relative overflow-hidden" onMouseEnter={() => !showPopup && setIsHovered(true)} onMouseLeave={() => !showPopup && setIsHovered(false)} onMouseMove={handleMouseMove}>
      <img
        src={imageUrl}
        alt={alt}
        className={`h-full w-full object-cover transition-transform duration-500 ${isHovered ? "hovered" : ""}`}
        style={{
          transformOrigin: `${position.x}px ${position.y}px`,
          transform: isHovered ? "scale(1.5)" : "scale(1)",
        }}
        onClick={() => {
          setShowPopup(true);
          setIsHovered(false);
        }}
      />
      <style jsx>
        {`
          .hovered {
            transform: scale(1.2);
          }
        `}
      </style>
      {showPopup && <ImagePopup images={images} onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default ZoomableImage;
