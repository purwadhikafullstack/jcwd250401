import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { Button, Checkbox, Label, Modal } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";

function LoginModal() {
  const [openModal, setOpenModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  function onCloseModal() {
    setOpenModal(false);
  }

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      // Handle your form submission here
      console.log("Form submitted with values:", values);
      // You can add your login logic here
    },
  });

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Toggle modal Login</Button>
      <Modal show={openModal} size="lg" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4 px-4">
              <div className="space-y-3 mb-4">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Hi, Welcome Back!</h3>
                <h4 className="text-sm text-gray-900 dark:text-white">Login with your email address and password</h4>
              </div>
              <div>
                <div className="mb-2 block">
                  <h4 className="text-sm text-gray-900 dark:text-white">Email</h4>
                </div>
                <input type="email" id="email" name="email" placeholder="Enter your email" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm" {...formik.getFieldProps("email")} />
                {formik.touched.email && formik.errors.email ? <div className="text-red-500">{formik.errors.email}</div> : null}
              </div>
              <div>
                <div className="mb-2 block">
                  <h4 className="text-sm text-gray-900 dark:text-white">Password</h4>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                    {...formik.getFieldProps("password")}
                  />
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                {formik.touched.password && formik.errors.password ? <div className="text-red-500">{formik.errors.password}</div> : null}
              </div>
              <div className="flex items-center gap-2">
                <Checkbox />
                <span className="text-sm text-gray-900 dark:text-white">Remember me</span>
              </div>
              <div>
                <Button className="w-full bg-[#40403F] hover:bg-red-600" size="lg" type="submit">
                  Login
                </Button>
              </div>
              <div>
                <a href="#" className="text-md font-bold text-black underline dark:text-cyan-500">
                  Forgot your password?
                </a>
              </div>
              <div>
                <div className="flex items-center space-x-4">
                  <div className="flex-grow border-t border-gray-900"></div>
                  <span className="text-sm text-gray-900 font-semibold">Or with</span>
                  <div className="flex-grow border-t border-gray-900"></div>
                </div>
              </div>
              <div>
                <Button className="w-full" color="light" size="lg">
                  <div className="flex items-center justify-center">
                    <div className="mr-2">
                      <FcGoogle style={{ fontSize: "24px" }} />
                    </div>
                    <div className="text-center">Login with Google</div>
                  </div>
                </Button>
              </div>
              <div>
                <span className="text-md font-bold">
                  Don't have an account?{" "}
                  <a href="#" className="text-md font-bold text-blue-600">
                    Sign Up
                  </a>
                </span>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default LoginModal;
