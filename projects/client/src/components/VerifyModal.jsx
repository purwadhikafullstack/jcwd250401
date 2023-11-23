import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api";
import { toast } from "sonner";
import { setEmail } from "../slices/authModalSlices";
import { useDispatch } from "react-redux";
import { hideModal } from "../slices/authModalSlices";
import { AiOutlineLoading } from "react-icons/ai";
import { useSelector } from "react-redux";
import { hideVerifyModal } from "../slices/authModalSlices";
import { showCreatePasswordModal } from "../slices/authModalSlices";
import OtpInput from "./OtpInput";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";

function VerifyModal({ isOpen, isClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [resendCooldown, setResendCooldown] = useState(0); // Countdown timer state
  const email = useSelector((state) => state.authModal.email);
  const dispatch = useDispatch();

  // Function to start the resend countdown
  const startResendCooldown = () => {
    setResendCooldown(30); // Set the countdown timer to 30 seconds
  };

  const handleOtpChange = (newOtp) => {
    const otpString = newOtp.join(""); // Join the array into a string
    console.log("newOtp:", newOtp);
    console.log("otpString:", otpString);
    formik.setFieldValue("verifyCode", otpString);
  };

  // Function to handle the "Resend" option
  const handleResend = async () => {
    if (resendCooldown === 0) {
      // Start the countdown when "Resend" is clicked
      startResendCooldown();

      // Send the resend request to your API
      await api.post("/auth/sendverify", {
        email: email,
      });

      toast.success("Verification code has been sent to your email");
    }
  };

  // Update the countdown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [resendCooldown]);

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

        setTimeout(() => {
          toast.success("Account has been verified", {
            autoClose: 3000,
            onAutoClose: (t) => {
              dispatch(showCreatePasswordModal());
              dispatch(hideVerifyModal());
            },
          });
        }, 3000);
      } catch (error) {
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
        } else if (error.request) {
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
        }, 8000);
      }
    },
  });

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} size="md" onClose={isClose} isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(2px)" />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4 px-4">
              <div className="space-y-3">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Verify your account</h3>
                <h4 className="text-sm text-gray-900 dark:text-white">We've already sent a verification code to your email address associated with your account. Please make sure to check your email from us.</h4>
              </div>
              <div>
                <div className="mb-2 block">
                  <h4 className="text-sm text-gray-900 dark:text-white text-center">Verification code</h4>
                </div>
                <div className="flex items-center justify-center mt-4 mb-6">
                  <OtpInput
                    value={formik.values.verifyCode} // Pass the OTP value as a prop
                    onChange={handleOtpChange}
                  />
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
                <div className="flex items-center justify-center gap-4 mt-4">
                  <span className="text-sm font-medium text-[#777777]">
                    Didn't get the code ? {""}
                    {resendCooldown === 0 ? ( // Show "Resend" when the cooldown is 0
                      <a className="text-sm font-bold text-gray-900 hover:underline hover:cursor-pointer" onClick={handleResend}>
                        Resend
                      </a>
                    ) : (
                      `${resendCooldown}s`
                    )}
                  </span>
                </div>
              </div>
            </div>
          </form>
          <ModalFooter />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default VerifyModal;
