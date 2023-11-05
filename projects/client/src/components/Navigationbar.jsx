import React, { useState } from "react";
import { BsCart, BsSearch, BsPersonCircle } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import rains from "../assets/rains.png";
import LoginModal from "./LoginModal";

function Navigationbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // State to manage the login modal visibility

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const isLogin = true;

  return (
    <div className="w-full bg-white h-20 flex items-center justify-between px-[150px]">
      <div className="flex items-center gap-16">
        <img src={rains} alt="Logo" className="w-26 h-10" />
        <div className="flex space-x-4">
          <a href="#" className="text-black text-xl font-semibold hover:underline">
            NEW IN
          </a>
          <a href="#" className="text-black text-xl font-semibold hover:underline">
            MEN
          </a>
          <a href="#" className="text-black text-xl font-semibold hover:underline">
            WOMEN
          </a>
          <a href="#" className="text-black text-xl font-semibold hover:underline">
            BAGS
          </a>
          <a href="#" className="text-black text-xl font-semibold hover:underline">
            ACCESSORIES
          </a>
        </div>
      </div>
      {isLogin ? (
        <div className="flex items-center gap-8">
          <BsSearch className="text-xl cursor-pointer" />
          <MdFavoriteBorder className="text-xl cursor-pointer" />
          <BsCart className="text-xl cursor-pointer" />
          <BsPersonCircle className="text-xl cursor-pointer" />
        </div>
      ) : (
        <a onClick={openLoginModal} className="text-black text-xl font-semibold hover:underline">
          Log in
        </a>
      )}
      {isLoginModalOpen && <LoginModal isOpen={isLoginModalOpen} isClose={() => setIsLoginModalOpen(false)} />}
    </div>
  );
}

export default Navigationbar;
