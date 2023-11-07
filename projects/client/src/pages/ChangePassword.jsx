import { Link } from "react-router-dom";
import { NavPage } from "../components/NavPage";
import { useFormik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const ChangePassword = () => {
  const listsMenu = ["Profile", "Address Book", "My Order", "Change my password"];
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: yup.object({
      currentPassword: yup
        .string()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "Must contain 8 characters, at least 1 letter and 1 number")
        .required("Required")
        .required("Required"),
      newPassword: yup
        .string()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "Must contain 8 characters, at least 1 letter and 1 number")
        .required("Required"),
      confirmNewPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <>
      <NavPage pageName={"Change my Password"} />
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

          <form onSubmit={formik.handleSubmit}>
            <div className="w-[90vw] lg:w-[53vw] min-h-[70vh] flex flex-col px-0 lg:px-5 rounded-lg shadow-md">
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
                  <p className="text-sm text-gray-500 mt-2"> Password must be at least 8 characters, and contain both letters and numbers</p>
                  <a href="#" className="text-sm text-black font-bold hover:underline">
                    Forgot your password?
                  </a>
                  {formik.touched.currentPassword && formik.errors.currentPassword ? <p className="text-sm text-red-500">{formik.errors.currentPassword}</p> : null}
                </div>
              </div>

              <div className="flex flex-row items-center mt-5 w-full relative">
                <label htmlFor="newPassword" className="w-[35%] font-bold">
                  New Password<span className="text-red-500">*</span>
                </label>
                <div className="w-[65%]">
                  <input type={showPassword ? "text" : "password"} name="newPassword" id="newPassword" className="w-full h-10 border border-gray-300 rounded-md py-2 px-4" placeholder="Enter your new password" {...formik.getFieldProps("newPassword")} />
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
                  <p className="text-sm text-gray-500 mt-2"> Password must be at least 8 characters, and contain both letters and numbers</p>
                  {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword ? <p className="text-sm text-red-500">{formik.errors.confirmNewPassword}</p> : null}
                </div>
              </div>

              <div className="flex flex-row items-center mt-5 mb-2">
                <button className="w-[60%] sm:w-[35%] h-10 bg-black text-white rounded-md font-semibold" type="submit">
                  Change My Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
