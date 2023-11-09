import React from "react";
import notFoundImg from "../assets/not-found.png";
import Navigationbar from "../components/Navigationbar";

export const NotFound = () => {
  return (
    <>
      <Navigationbar />
      <div className="w-full h-[85vh] flex items-center justify-center">
        <div className="flex justify-center items-center flex-col h-[90%] w-[90%]">
          <img src={notFoundImg} alt="not-found" className="w-[50vw] lg:w-[30vw] mb-5" />
          <div className="flex flex-col justify-center items-center p-2">
            <p className="text-2xl">Page not found</p>
            <p className="text-xl text-center">The page you are looking for does not exist.</p>
            <a href="/" className="text-xl text-blue-500 hover:underline">
              Go back to homepage
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
