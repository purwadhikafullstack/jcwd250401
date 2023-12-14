import React, { useEffect, useState } from "react";
import { NavPage } from "../components/NavPage";
import { Link, useNavigate } from "react-router-dom";
import { UpdateProfileModal } from "../components/UpdateProfileModal";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { showLoginModal } from "../slices/authModalSlices";
import getProfile from "../api/profile/getProfile";

export const Profile = () => {
  const [openModal, setOpenModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const listsMenu = ["Profile", "Address Book", "My Order", "Change Password"];
  const isLogin = JSON.parse(localStorage.getItem("isLoggedIn"));
  const userDetail = useSelector((state) => state?.account?.profile?.data?.profile);
  const username = useSelector((state) => state?.account?.username);
  const token = useSelector((state) => state?.account?.profile?.data?.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    try {
      const response = await getProfile({ username, token });
      setUserData(response.detail);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 404 || error.response.status === 500)) {
        toast.error(error.response.data.message);
        if (error.response.status === 401 || error.response.status === 403) {
          setTimeout(() => {
            navigate("/");
            dispatch(showLoginModal());
          }, 2000);
        }
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userDetail]);

  const handleEdit = () => setOpenModal(true);

  return (
    <>
      <NavPage pageName={"Profile"} />
      <div className="flex lg:px-36 lg:justify-normal justify-center font-sagoe">
        <div className="min-h-[70vh] lg:h-[72vh] w-[90vw] lg:w-[76vw] flex flex-row overflow-y-auto lg:overflow-y-hidden">
          <div className="hidden lg:flex flex-col w-[20vw]">
            {listsMenu.map((list, index) => {
              const joinedList = list.toLowerCase().replace(/\s/g, "-");
              const isProfile = list === "Profile"; // Check if the current item is "Profile"
              return (
                <Link key={index} to={`/account/${joinedList}`} className={`block py-2 text-sm font-sagoe text-gray-700 hover:underline ${isProfile ? "font-black" : ""}`}>
                  {list}
                </Link>
              );
            })}
          </div>

          <div className="w-full lg:w-[53vw] lg:h-[70vh] overflow-y-hidden shadow-md">
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
                    <img
                      src={userData?.photoProfile ? `http://localhost:8000/public/${userData?.photoProfile}` : "https://via.placeholder.com/150"}
                      alt={userData?.photoProfile}
                      className="w-[250px] sm:w[60%] h-[250px] sm:h-[60%] mx-auto pt-2"
                    />
                  </div>
                  <div className="ml-0 sm:ml-[2vw]">
                    <div className="flex gap-8 mb-3">
                      <p className="text-sm text-gray-500 min-w-[20vw] sm:min-w-[5vw]">Username</p>
                      <p className="text-sm text-gray-500">{userDetail?.username ? userData?.username : "Not yet"}</p>
                    </div>

                    <div className="flex gap-8 mb-3">
                      <p className="text-sm text-gray-500 min-w-[20vw] sm:min-w-[5vw]">First name</p>
                      <p className="text-sm text-gray-500">{userDetail?.firstName ? userData?.firstName : "Not yet"}</p>
                    </div>

                    <div className="flex gap-8 mb-3">
                      <p className="text-sm text-gray-500 min-w-[20vw] sm:min-w-[5vw]">Last name</p>
                      <p className="text-sm text-gray-500">{userDetail?.lastName ? userData?.lastName : "Not yet"}</p>
                    </div>

                    <div className="flex gap-8 mb-3">
                      <p className="text-sm text-gray-500 min-w-[20vw] sm:min-w-[5vw]">Email</p>
                      <p className="text-sm text-gray-500">{userDetail?.email ? userData?.email : "Not yet"}</p>
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
      <UpdateProfileModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};
