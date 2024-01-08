import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { Button } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "sonner";
import api from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showForgotPasswordModal, showLoginModal } from "../slices/authModalSlices";
import image from "../assets/image-4.jpg";
import imagemobile from "../assets/image-1.jpg";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";

function ResetPassword({ userType }) {
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = useSelector((state) => state.authModal.email);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      console.log("Code from query params:", code);
    } else {
      console.log("Code not found in query params");
    }
  }, [searchParams]);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isClose = () => {
    navigate("/");
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password cannot exceed 20 characters")
        .matches(/[$&+,:;=?@#|'<>.^*()%!-]/, "Password must contain at least one symbol")
        .matches(/\d/, "Password must contain at least one number")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),

    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);

        const endpoint = userType === "admin" ? "/api/auth/reset-password-admin" : "/api/auth/resetpassword";
        const response = await api.post(endpoint, {
          uniqueCode: searchParams.get("code"),
          password: values.password,
        });

        if (response.data) {
          setTimeout(() => {
            toast.success("New password has been created, Directing you to login page...", {
              autoClose: 3000,
              onAutoClose: (t) => {
                userType === "admin" ? navigate("/adminlogin") : navigate("/"); 
                dispatch(showLoginModal());
              },
            });
          }, 3000);
        }
      } catch (error) {
          if (error.response.status === 401) {
            setTimeout(() => {
              toast.error("User already has password!");
              setIsSubmitting(false);
            }, 2000);
          } else if (error.response.status === 400) {
            setTimeout(() => {
              toast.error("Reset password code already expired, please request a new one", {
                autoClose: 1000,
                onAutoClose: (t) => {
                  setIsOpen(false);
                  navigate("/");
                  dispatch(showForgotPasswordModal());
                },
              });
            }, 1000);
          } else if (error.request) {
            setTimeout(() => {
              toast.error("Network error, please try again later");
              setIsSubmitting(false);
            }, 2000);
          }
      } finally {
        // Add a 1-second delay before closing the modal
        setTimeout(() => {
          setIsSubmitting(false);
        }, 9000);
      }
    },
  });

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
        className="hidden lg:block"></div>
      <div
        style={{
          backgroundImage: `url(${imagemobile})`,
          backgroundSize: "cover",
          minHeight: "100vh",
        }}
        className="block lg:hidden"></div>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} size="md" onClose={isClose} motionPreset="slideInBottom" isCentered>
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <div className="space-y-4 px-4 mb-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">Reset your password</h3>
                  <h4 className="text-sm text-gray-900 dark:text-white">We heard you forgotting your password, don't worry, let's create new one.</h4>
                </div>
                <div>
                  <div className="mb-2 block">
                    <h4 className="text-sm text-gray-900 dark:text-white">New password</h4>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Enter your new password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                      {...formik.getFieldProps("password")}
                    />
                    <span className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer" onClick={togglePasswordVisibility}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
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
                      placeholder="Confirm your new password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                      {...formik.getFieldProps("confirmPassword")}
                    />
                    <span className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer" onClick={togglePasswordVisibility}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className="text-red-500">{formik.errors.confirmPassword}</div> : null}
                </div>

                <div>
                  {isSubmitting ? (
                    <Button className="w-full bg-[#40403F] enabled:hover:bg-[#40403F] outline-none" size="lg" isProcessing processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />}>
                      Creating Password...
                    </Button>
                  ) : (
                    <Button className="w-full bg-[#40403F] enabled:hover:bg-[#777777]" size="lg" type="submit">
                      Create Password
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

export default ResetPassword;
