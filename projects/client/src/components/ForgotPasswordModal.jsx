import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button, Modal } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";

function SignUpModal({ isOpen, isClose, openLoginModal }) {
  const [openModal, setOpenModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
    }),
    onSubmit: (values) => {
      // Handle your form submission here
      console.log("Form submitted with values:", values);
      // You can add your signup logic here
    },
  });

  return (
    <>
      <Modal show={isOpen} size="md" onClose={isClose} popup>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4 px-4">
              <div className="space-y-3">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Forgot Password</h3>
                <h4 className="text-sm text-gray-900 dark:text-white">You will receive a forgot password link to your email address associated with the account. Please make sure to check your incoming email from us.</h4>
              </div>
              <div>
                <div className="mb-2 block">
                  <h4 className="text-sm text-gray-900 dark:text-white">Email</h4>
                </div>
                <input type="email" id="email" name="email" placeholder="Enter your email" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500" {...formik.getFieldProps("email")} />
                {formik.touched.email && formik.errors.email ? <div className="text-red-500">{formik.errors.email}</div> : null}
              </div>

              <div>
                <Button className="w-full bg-[#40403F] hover:bg-red-600 enabled:hover:bg-[#777777]" size="lg" type="submit">
                  Forgot Password
                </Button>
              </div>




            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default SignUpModal;
