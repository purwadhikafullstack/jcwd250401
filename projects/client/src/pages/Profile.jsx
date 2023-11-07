import React, { useState } from "react";
import { NavPage } from "../components/NavPage";
import { Link } from "react-router-dom";
import { UpdateProfileModal } from "../components/UpdateProfileModal";

export const Profile = () => {
  const [openModal, setOpenModal] = useState(false);
  const listsMenu = ["Profile", "Address Book", "My Order", "Change my password"];

  const handleEdit = () => setOpenModal(true)
  return (
    <>
      <NavPage pageName={"Profile"} />
      <div className="flex justify-center">
        <div className="min-h-[70vh] lg:h-[70vh] w-[90vw] lg:w-[76vw] flex flex-row overflow-y-auto lg:overflow-y-hidden">

          <div className="hidden lg:flex flex-col w-[20vw]">
            {listsMenu.map((list, index) => {
              const joinedList = list.toLowerCase().replace(/\s/g, "-");
              return (
                <Link key={index} to={`/account/${joinedList}`} className="block py-2 text-sm text-gray-700 hover:underline">
                  {list}
                </Link>
              );
            })}
          </div>

          <div className="w-full lg:w-[53vw] h-17 overflow-y-hidden shadow-md">
            <div className="flex justify-between bg-gray-100 p-3">
              <p className="font-bold">Profile</p>
              <p className="text-sm text-gray-500 cursor-pointer" onClick={handleEdit}>Edit</p>
            </div>

            <div className="p-3 flex flex-col items-center sm:items-start sm:flex-row w-[90%] ml-4 mt-4">
              <div className="w-[80%] sm:w-[50%] min-h-[50vh] shadow-md flex flex-col justify-center rounded-lg mb-5 border">
                <img src="https://via.placeholder.com/150" alt="profile" className="w-[90%] sm:w[60%] h-[70%] sm:h-[50%] mx-auto pt-2" />
                <button className="w-[60%] sm:w-[50%] h-[5vh] mt-2 mx-auto border border-gray-200 rounded-md font-semibold">Change Photo</button>
                <p className="text-sm text-gray-500 mt-2 mb-2 mx-auto w-[90%] text-center">JPG or PNG, max size of 1MB</p>
              </div>

              <div className="ml-0 sm:ml-[2vw]">
                <div className="flex gap-20 mb-3">
                  <p className="text-sm text-gray-500 min-w-[20vw] sm:min-w-[5vw]">Username</p>
                  <p className="text-sm text-gray-500">Johndoe</p>
                </div>

                <div className="flex gap-20 mb-3">
                  <p className="text-sm text-gray-500 min-w-[20vw] sm:min-w-[5vw]">First name</p>
                  <p className="text-sm text-gray-500">john</p>
                </div>

                <div className="flex gap-20 mb-3">
                  <p className="text-sm text-gray-500 min-w-[20vw] sm:min-w-[5vw]">Last name</p>
                  <p className="text-sm text-gray-500">Doe</p>
                </div>

                <div className="flex gap-20 mb-3">
                  <p className="text-sm text-gray-500 min-w-[20vw] sm:min-w-[5vw]">Email</p>
                  <p className="text-sm text-gray-500">john@mail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UpdateProfileModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};
