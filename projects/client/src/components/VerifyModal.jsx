import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button, Checkbox, Label, Modal } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";

function VerifyModal() {
  const [openModal, setOpenModal] = useState(false);

  function onCloseModal() {
    setOpenModal(false);
  }

  const formik = useFormik({
    initialValues: {
      verifyCode: "",
    },
    validationSchema: Yup.object({
      verifyCode: Yup.string().required("Verify code is required"),
    }),
    onSubmit: (values) => {
      // Handle your form submission here
      console.log("Form submitted with values:", values);
      // You can add your login logic here
    },
  });

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Toggle modal Verify</Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4 px-4">
              <div className="space-y-3">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Verify your account</h3>
                <h4 className="text-sm text-gray-900 dark:text-white">We've already sent verification code to your email address associated with account. Please make sure to check your email from us.</h4>
              </div>
              <div>
                <div className="mb-2 block">
                  <h4 className="text-sm text-gray-900 dark:text-white">Verification code</h4>
                </div>
                <input type="verifyCode" id="verifyCode" name="verifyCode" placeholder="Enter your verification code" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500" {...formik.getFieldProps("verifyCode")} />
                {formik.touched.verifyCode && formik.errors.verifyCode ? <div className="text-red-500">{formik.errors.verifyCode}</div> : null}
              </div>
              
              <div>
                <Button className="w-full bg-[#40403F] hover:bg-red-600" size="lg" type="submit">
                    Verify
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default VerifyModal;
