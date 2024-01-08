import React from "react";
import notFoundImg from "../assets/not-found.png";

export const NotFound = () => {
  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex justify-center items-center flex-col h-[90%] w-[90%]">
          <img src={notFoundImg} alt="not-found" className="w-[50vw] lg:w-[30vw] mb-5" />
          <div className="flex flex-col justify-center items-center p-2">
            <p className="text-2xl">Page not found</p>
            <p className="text-xl text-center">The page you are looking for does not exist.</p>
            <button className="bg-slate-900 hover:bg-slate-700 text-white p-2 rounded-md mt-5" onClick={() => window.location.replace("/")}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
