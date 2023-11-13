import { Link, useNavigate } from "react-router-dom";
import { NavPage } from "../components/NavPage";
import { useFormik } from "formik";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import api from "../api";
import { toast } from "sonner";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import { showLoginModal } from "../slices/authModalSlices";

export const ChangePassword = () => {
  const isLogin = useSelector((state) => state?.account?.isLogin);
  const username = useSelector((state) => state?.account?.profile?.data?.profile?.username);
  const listsMenu = ["Profile", "Address Book", "My Order", "Change Password"];
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const userRegistByGoogle = userData?.registBy === "google" ? true : false;
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleModalOpen = () => setOpenModal(true);

  if(!isLogin) {
    setTimeout(() => {
      navigate("/")
      dispatch(showLoginModal());
    }, 2000)
  }

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: yup.object({
      currentPassword: yup
        .string()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Must contain 8 characters, at least 1 letter, 1 number, and 1 symbol")
        .required("Required")
        .required("Required"),
      newPassword: yup
        .string()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "Must contain 8 characters, at least 1 letter, 1 number, and 1 symbol")
        .required("Required"),
      confirmNewPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await api.patch(`/profile/password/${username}`, {
          password: values.currentPassword,
          newPassword: values.newPassword,
        });

        if (response.data.ok) {
          toast.success("Change password success");
          formik.resetForm();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("Current password is incorrect");
        } else {
          toast.error("Change password failed");
        }
      }
    },
  });

  useEffect(() => {
    const getUsersProfile = async () => {
      try {
        const response = await api.get(`/profile/${username}`);
        setUserData(response.data.detail);
      } catch (error) {
        toast.error("Failed to get user data");
      }
    };
    getUsersProfile();
  }, []);
  return (
    <>
      <NavPage pageName={"Change my Password"} />
      <div className="flex justify-center">
        <div className="min-h-[70vh] lg:h-[70vh] w-[90vw] lg:w-[76vw] flex flex-row overflow-y-auto lg:overflow-y-hidden">
          <div className="hidden lg:flex flex-col w-[20vw]">
                {listsMenu.map((list, index) => {
                  const joinedList = list.toLowerCase().replace(/\s/g, "-");
                  const isChangePassword = list === "Change Password"; // Check if the current item is "Profile"
                  return (
                    <Link key={index} to={`/account/${joinedList}`} className={`block py-2 text-sm font-sagoe text-gray-700 hover:underline ${isChangePassword ? "font-black" : ""}`}>
                      {list}
                    </Link>
                  );
                })}
          </div>
          <div className="w-[90vw] lg:w-[53vw] min-h-[70vh] flex flex-col px-0 lg:px-5 rounded-lg shadow-md">
            {isLogin && !userRegistByGoogle ? (
              <form onSubmit={formik.handleSubmit}>
                <h1 className="text-2xl font-bold mt-4">Change My password</h1>

                <div className="flex flex-row mt-5 w-full">
                  <label htmlFor="current-password" className="w-[35%] font-bold">
                    Current Password<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[65%] relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="currentPassword"
                      id="current-password"
                      className="w-full h-10 border border-gray-300 rounded-md py-2 px-4"
                      placeholder="Enter your current password"
                      {...formik.getFieldProps("currentPassword")}
                    />
                    <span onClick={handleShowPassword} className="absolute top-3 right-3 cursor-pointer">
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    <p className="text-sm text-gray-500 mt-2"> Password must be at least 8 characters, and contain letters, numbers, and symbol.</p>
                    <p className="text-sm text-black font-bold hover:underline cursor-pointer" onClick={handleModalOpen}>
                      Forgot your password?
                    </p>
                    {formik.touched.currentPassword && formik.errors.currentPassword ? <p className="text-sm text-red-500">{formik.errors.currentPassword}</p> : null}
                  </div>
                </div>

                <div className="flex flex-row items-center mt-5 w-full relative">
                  <label htmlFor="newPassword" className="w-[35%] font-bold">
                    New Password<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[65%]">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      id="newPassword"
                      className="w-full h-10 border border-gray-300 rounded-md py-2 px-4"
                      placeholder="Enter your new password"
                      {...formik.getFieldProps("newPassword")}
                    />
                    <span onClick={handleShowPassword} className="absolute top-3 right-3 cursor-pointer">
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    {formik.touched.newPassword && formik.errors.newPassword ? <p className="text-sm text-red-500">{formik.errors.newPassword}</p> : null}
                  </div>
                </div>

                <div className="flex flex-row items-center mt-5 w-full">
                  <label htmlFor="confirmNewPassword" className="w-[35%] font-bold">
                    Confirm New Password<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[65%] relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmNewPassword"
                      id="confirmNewPassword"
                      className="w-full h-10 border border-gray-300 rounded-md py-2 px-4"
                      placeholder="Confirm your new password"
                      {...formik.getFieldProps("confirmNewPassword")}
                    />
                    <span onClick={handleShowPassword} className="absolute top-3 right-3 cursor-pointer">
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    <p className="text-sm text-gray-500 mt-2"> Password must be at least 8 characters, and contain letters, numbers, and symbol.</p>
                    {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword ? <p className="text-sm text-red-500">{formik.errors.confirmNewPassword}</p> : null}
                  </div>
                </div>

                <div className="flex flex-row items-center mt-5 mb-2">
                  <button className="w-[60%] sm:w-[35%] h-10 bg-black text-white rounded-md font-semibold" type="submit">
                    Change My Password
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full">
                {isLogin ? <p className="text-lg text-gray-500 text-center">Password cannot be updated for accounts registered through Google.</p> : <p className="text-lg text-gray-500">You are not logged in.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
      <ForgotPasswordModal isOpen={openModal} isClose={() => setOpenModal(false)} />
    </>
  );
};
