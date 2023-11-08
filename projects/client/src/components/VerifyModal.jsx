import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button, Checkbox, Label, Modal } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api";
import { toast } from "sonner";
import { setEmail } from "../slices/authModalSlices";

import { useDispatch } from 'react-redux';
import { hideModal } from '../slices/authModalSlices';
import { AiOutlineLoading } from "react-icons/ai";
import { useSelector } from "react-redux";
import { hideVerifyModal } from "../slices/authModalSlices";
import { showCreatePasswordModal } from "../slices/authModalSlices";


function VerifyModal({isOpen, isClose}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = useSelector((state) => state.authModal.email);
  const dispatch = useDispatch();
  

  const formik = useFormik({
    initialValues: {
      verifyCode: "",
    },
    validationSchema: Yup.object({
      verifyCode: Yup.string().required("Verify code is required"),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const response = await api.get("/auth/verify", {
          params: {
            verifyCode: values.verifyCode,
            email: email,
          },
        });
    
        if (response.data) {
          setTimeout(() => {
            toast.success("Account has been verified", {
              autoClose: 3000,
              onAutoClose: (t) => {
                dispatch(showCreatePasswordModal());
                dispatch(hideVerifyModal());
              },
            });
          }, 3000);
        }

      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            setTimeout(() => {
              toast.error("Invalid verification code");
              setIsSubmitting(false);
            }, 2000);
          } else if (error.response.status === 400) {
            setTimeout(() => {
              toast.error("This account is already verified");
              setIsSubmitting(false);
            }, 2000);
          } else {
          }
        } else if (error.request) {
          // Handle network errors (request was made but no response received)
        } else {
          // Handle other non-network, non-HTTP-related errors
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
      <Modal show={isOpen} onClose={isClose} size="md" popup>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4 px-4 mb-4">
              <div className="space-y-3">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Verify your account</h3>
                <h4 className="text-sm text-gray-900 dark:text-white">We've already sent verification code to your email address associated with account. Please make sure to check your email from us.</h4>
              </div>
              <div>
                <div className="mb-2 block">
                  <h4 className="text-sm text-gray-900 dark:text-white">Verification code</h4>
                </div>
                <input
                  type="verifyCode"
                  id="verifyCode"
                  name="verifyCode"
                  placeholder="Enter your verification code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500"
                  {...formik.getFieldProps("verifyCode")}
                />
                {formik.touched.verifyCode && formik.errors.verifyCode ? <div className="text-red-500">{formik.errors.verifyCode}</div> : null}
              </div>

              <div>
                {isSubmitting ? (
                  <Button className="w-full bg-[#40403F] enabled:hover:bg-[#40403F] outline-none" size="lg" isProcessing processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />}>
                    Verifying...
                  </Button>
                ) : (
                  <Button className="w-full bg-[#40403F] enabled:hover:bg-[#777777]" size="lg" type="submit" disabled={isSubmitting}>
                    Verify
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default VerifyModal;
