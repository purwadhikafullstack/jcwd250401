import React, { useState, useEffect } from "react";

const ZoomableImageOnModal = ({ imageUrl, alt }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [shouldApplyDelay, setShouldApplyDelay] = useState(true);

  const handleMouseMove = (e) => {
    setPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const handleMouseEnter = () => {
    if (shouldApplyDelay) {
      // Terapkan delay hanya saat pertama kali kursor digerakkan setelah rendering
      const timeout = setTimeout(() => {
        setIsHovered(true);
        setShouldApplyDelay(false); // Matikan delay setelah pertama kali
      }, 1300); // Ganti nilai timeout sesuai kebutuhan
      return () => clearTimeout(timeout);
    } else {
      setIsHovered(true); // Jika tidak ada delay, aktifkan efek zoom segera
    }
  };

  return (
    <div className="h-[750px] w-[560px] relative overflow-hidden" onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={() => setIsHovered(false)}>
      <img
        src={imageUrl}
        alt={alt}
        className={`h-full w-full object-cover transition-transform duration-700 ${isHovered ? "hovered" : ""}`}
        style={{
          transformOrigin: `${position.x}px ${position.y}px`,
          transform: isHovered ? "scale(2)" : "scale(1)",
        }}
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
