import React, { useState } from "react";

const ZoomableImageOnModal = ({ imageUrl, alt }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const handleClick = () => {
    setIsHovered(!isHovered); // Toggle the zoom effect on click
  };

  return (
    <div className="h-[750px] w-[560px] relative overflow-hidden" onMouseMove={handleMouseMove} onMouseLeave={() => setIsHovered(false)}>
      <img
        src={imageUrl}
        alt={alt}
        className={`h-full w-full object-cover transition-transform duration-700 ${isHovered ? "hovered" : ""}`}
        style={{
          transformOrigin: `${position.x}px ${position.y}px`,
          transform: isHovered ? "scale(2)" : "scale(1)",
        }}
        onClick={handleClick}
      />
      <style jsx>
        {`
          .hovered {
            transform: scale(1.2);
          }
        `}
      </style>
    </div>
  );
};

export default ZoomableImageOnModal;
