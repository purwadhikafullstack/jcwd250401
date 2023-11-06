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
    onSubmit: async (values) => {
      try {
        // Make a POST request to your backend registration API using the api instance
        const response = await api.post("/auth/register", {
          email: values.email,
          
        });

        
    
       
        
      } catch (error) {
       
      
      }
    }
  });

  return (
    <>
      <Modal show={isOpen} size="md" onClose={isClose} popup>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4 px-4">
              <div className="space-y-3">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create an account</h3>
                <h4 className="text-sm text-gray-900 dark:text-white">You will receive a verification code to your email address associated with the account. Please make sure to check your incoming email from us.</h4>
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
                  Sign Up
                </Button>
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
                    <div className="text-center">Sign Up with Google</div>
                  </div>
                </Button>
              </div>
              <div>
                <span className="text-md font-bold">
                  Have an account?{" "}
                  <a className="text-md font-bold text-blue-600 hover:underline hover:cursor-pointer" onClick={openLoginModal}>
                    Login
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

export default SignUpModal;
