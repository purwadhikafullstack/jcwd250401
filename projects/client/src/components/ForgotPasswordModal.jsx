import React, { useState } from "react";

import { Button } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api";
import { toast } from "sonner";
import { hideForgotPasswordModal, setEmail } from "../slices/authModalSlices";
import { AiOutlineLoading } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { showLoginModal } from "../slices/authModalSlices";
import { showVerifyModal } from "../slices/authModalSlices";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";

function ForgotPasswordModal({ isOpen, isClose, userType="user" }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);

        const endpoint = userType === "admin" ? "/api/auth/forgot-password-admin": "/api/auth/forgotpassword"
        const response = await api.post(endpoint, {
          email: values.email,
        });

     
          setTimeout(() => {
            toast.success("Reset password link has been send to your email", {
              autoClose: 1000,
              onAutoClose: (t) => {
                dispatch(hideForgotPasswordModal());
                setIsSubmitting(false);
              },
            });
          }, 1000);
        
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            setTimeout(() => {
              toast.error("Invalid email");
              setIsSubmitting(false);
            }, 2000);
          }
          if (error.response.status === 403) {
            setTimeout(() => {
              setIsSubmitting(false);
              toast.error("This account has linked with google services, please login with google", {
                autoClose: 1000,
                onAutoClose: (t) => {
                  dispatch(hideForgotPasswordModal());
                  dispatch(showLoginModal());
                },
              });
            }, 1000);
            // Handle other HTTP errors
          }
          if (error.response.status === 405) {
            setTimeout(() => {
              api.post("/auth/sendverify", {
                email: values.email,
              });
              toast.error("This account not verified yet, sending you verify code to your email", {
                autoClose: 1000,
                onAutoClose: (t) => {
                  dispatch(hideForgotPasswordModal());
                  dispatch(showVerifyModal());
                  setEmail(values.email);
                  setIsSubmitting(false);
                },
              });
            }, 1000);
            // Handle other HTTP errors
          }
        }
        if (error.request) {
          // Handle request errors
          setTimeout(() => {
            toast.error("Network error, please try again later");
            setIsSubmitting(false);
          }, 2000);
        } 
      } finally {
        // Add a 1-second delay before closing the modal
        setTimeout(() => {
          setIsSubmitting(false);
        }, 6000);
      }
    },
  });
  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} size="md" onClose={isClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(2px)" />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <div className="space-y-4 px-4 mb-4">
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
                  {isSubmitting ? (
                    <Button className="w-full bg-[#40403F] enabled:hover:bg-[#40403F] outline-none" size="lg" isProcessing processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />}>
                      Sending email...
                    </Button>
                  ) : (
                    <Button className="w-full bg-[#40403F] enabled:hover:bg-[#777777]" size="lg" type="submit" disabled={isSubmitting}>
                      Forgot Password
                    </Button>
                  )}
                </div>
              </div>
            </form>
            <ModalFooter />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ForgotPasswordModal;
