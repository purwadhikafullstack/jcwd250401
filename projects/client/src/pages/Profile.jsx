import React, { useEffect, useState } from "react";
import { NavPage } from "../components/NavPage";
import { Link } from "react-router-dom";
import { UpdateProfileModal } from "../components/UpdateProfileModal";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import api from "../api";

export const Profile = () => {
  const [openModal, setOpenModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const listsMenu = ["Profile", "Address Book", "My Order", "Change my password"];
  const isLogin = useSelector((state) => state?.account?.isLogin);
  const userName = useSelector((state) => state?.account?.profile?.data?.profile?.username);
  const lastName = useSelector((state) => state?.account?.profile?.data?.profile?.lastName);
  const firstName = useSelector((state) => state?.account?.profile?.data?.profile?.firstName);
  const photoProfile = useSelector((state) => state?.account?.profile?.data?.profile?.photoProfile);
  const email = useSelector((state) => state?.account?.profile?.data?.profile?.email);

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (isLogin) {
          const response = await api.get(`/profile/${userName}`);
          setUserData(response.data.detail);
        } else {
          toast.error("You are not logged in");
        }
      } catch (error) {
        toast.error("Failed to get user data");
        console.error(String(error));
      }
    };
    getUserData();
  }, [userName, lastName, firstName, photoProfile, email]);

  const handleEdit = () => setOpenModal(true);
  return (
    <>
      <NavPage pageName={"Profile"} />
      <div className="flex justify-center font-sagoe">
        <div className="min-h-[70vh] lg:h-[70vh] w-[90vw] lg:w-[76vw] flex flex-row overflow-y-auto lg:overflow-y-hidden">
          <div className="hidden lg:flex flex-col w-[20vw]">
            {listsMenu.map((list, index) => {
              const joinedList = list.toLowerCase().replace(/\s/g, "-");
              return (
                <Link key={index} to={`/account/${joinedList}`} className="block py-2 text-sm font-medium font-sagoe text-gray-700 hover:underline">
                  {list}
                </Link>
              );
            })}
          </div>
          <div className="w-full lg:w-[53vw] h-15 overflow-y-hidden shadow-md">
            {isLogin ? (
              <>
                <div className="flex justify-between bg-gray-100 p-3">
                  <p className="font-bold">Profile</p>
                  <p className="text-sm text-gray-500 cursor-pointer" onClick={handleEdit}>
                    Edit
                  </p>
                </div>
                <div className="p-3 flex flex-col items-center sm:items-start sm:flex-row w-[90%] ml-4 mt-4">
                  <div className="w-[80%] sm:w-[50%] min-h-[50vh] shadow-md flex flex-col justify-center rounded-lg mb-5 border">
                    <img src={photoProfile ? `http://localhost:8000/public/${photoProfile}` : "https://via.placeholder.com/150"} alt={photoProfile} className="w-[250px] sm:w[60%] h-[250px] sm:h-[60%] mx-auto pt-2" />
                
                  </div>

                  <div className="ml-0 sm:ml-[2vw]">
                    <div className="flex gap-8 mb-3">
                      <p className="text-sm text-gray-500 min-w-[20vw] sm:min-w-[5vw]">Username</p>
                      <p className="text-sm text-gray-500">{userName}</p>
                    </div>

                    <div className="flex gap-8 mb-3">
                      <p className="text-sm text-gray-500 min-w-[20vw] sm:min-w-[5vw]">First name</p>
                      <p className="text-sm text-gray-500">{firstName ? firstName : "Not yet"}</p>
                    </div>

                    <div className="flex gap-8 mb-3">
                      <p className="text-sm text-gray-500 min-w-[20vw] sm:min-w-[5vw]">Last name</p>
                      <p className="text-sm text-gray-500">{lastName ? lastName : "Not yet"}</p>
                    </div>

                    <div className="flex gap-8 mb-3">
                      <p className="text-sm text-gray-500 min-w-[20vw] sm:min-w-[5vw]">Email</p>
                      <p className="text-sm text-gray-500">{email ? email : "Not yet"}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <p className="text-lg text-gray-500">You are not logged in.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <UpdateProfileModal isOpen={openModal} onClose={() => setOpenModal(false)} isLogin={isLogin} />
    </>
  );
};
