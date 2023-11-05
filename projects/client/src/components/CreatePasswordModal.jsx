import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { Button, Checkbox, Label, Modal } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";



function CreatePasswordModal() {
  const [openModal, setOpenModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  function onCloseModal() {
    setOpenModal(false);
  }

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  function onCloseModal() {
    setOpenModal(false);
  }

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: (values) => {
      // Handle your form submission here
      console.log("Form submitted with values:", values);
      // You can add your login logic here
    },
  });

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Toggle modal create password</Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4 px-4">
              <div className="space-y-3">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create your password</h3>
                <h4 className="text-sm text-gray-900 dark:text-white">One more step to finalize your account. Create the password.</h4>
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
             <div>
                <div className="mb-2 block">
                  <h4 className="text-sm text-gray-900 dark:text-white">Confirm password</h4>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                    {...formik.getFieldProps("confirmPassword")}
                  />
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className="text-red-500">{formik.errors.confirmPassword}</div> : null}
             </div>
              
              <div>
                <Button className="w-full bg-[#40403F] hover:bg-red-600" size="lg" type="submit">
                    Submit
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreatePasswordModal;
