import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { Button, Checkbox } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { showSignUpModal } from "../slices/authModalSlices";
import { showForgotPasswordModal } from "../slices/authModalSlices";
import { hideLoginModal } from "../slices/authModalSlices";
import { toast } from "sonner";
import api from "../api";
import { AiOutlineLoading } from "react-icons/ai";
import { login } from "../slices/accountSlices";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyBM35r6DuH1V6QUWcw-J8UkNarOEQ6Sg9w",
  authDomain: "graceful-splice-404407.firebaseapp.com",
  projectId: "graceful-splice-404407",
  storageBucket: "graceful-splice-404407.appspot.com",
  messagingSenderId: "291727587114",
  appId: "1:291727587114:web:97b2041a779d26afd61053",
  measurementId: "G-HENXSNV7D9",
};

const firebaseApp = initializeApp(firebaseConfig);

// NOTE create hook for firebase auth...

const auth = getAuth(firebaseApp);

function LoginModal({ isOpen, isClose }) {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const signUpButton = () => {
    dispatch(showSignUpModal());
    dispatch(hideLoginModal());
  };

  const forgotButton = () => {
    dispatch(showForgotPasswordModal());
    dispatch(hideLoginModal());
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const response = await api.post("/auth/google", {
        email: user.email,
        remember: true,
      });
      const responseData = response.data;
      setTimeout(() => {
        toast.success("Login success", {
          autoClose: 1000,
          onAutoClose: (t) => {
            dispatch(hideLoginModal());
            setIsSubmitting(false);
            dispatch(login(responseData));
            navigate(location.pathname);
          },
        });
      }, 600);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setTimeout(() => {
            toast.error("Email doesn't exist, please sign up with your google first.", {
              autoClose: 1000,
              onAutoClose: (t) => {
                dispatch(showSignUpModal());
                dispatch(hideLoginModal());
              },
            });
          }, 2000);
        }
      }
      if (error.request) {
        toast.error("Network error, please try again later");
      }
    }
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

    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const response = await api.post("/auth", {
          email: values.email,
          password: values.password,
          remember: values.remember || false,
        });
        const responseData = response.data;
        setTimeout(() => {
          toast.success("Login success", {
            autoClose: 1000,
            onAutoClose: (t) => {
              dispatch(hideLoginModal());
              setIsSubmitting(false);
              dispatch(login(responseData));
              navigate(location.pathname);
            },
          });
        }, 600);
      } catch (error) {
        if (error.response.status === 401) {
          setTimeout(() => {
            toast.error("Email or password incorrect");
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
        }, 6000);
      }
    },
  });

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} size="md" onClose={isClose} motionPreset="slideInBottom" isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(2px)" />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4 px-4">
              <div className="space-y-3 mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Hi, Welcome Back!</h3>
                <h4 className="text-sm text-gray-900 dark:text-white">Login with your email address and password</h4>
              </div>
              <div>
                <div className="mb-2 block">
                  <h4 className="text-sm text-gray-900 dark:text-white">Email</h4>
                </div>
                <input type="email" id="email" name="email" placeholder="Enter your email" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm" {...formik.getFieldProps("email")} />
                {formik.touched.email && formik.errors.email && <div className="text-red-500">{formik.errors.email}</div>}
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
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {formik.touched.password && formik.errors.password ? <div className="text-red-500">{formik.errors.password}</div> : null}
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="remember" {...formik.getFieldProps("remember")} />
                <span className="text-sm text-gray-900 dark:text-white">Remember me</span>
              </div>
              <div>
                {isSubmitting ? (
                  <Button className="w-full bg-Grey-1 enabled:hover:bg-[#777777] outline-none" size="lg" isProcessing processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />}>
                    Logging in...
                  </Button>
                ) : (
                  <Button className="w-full bg-Grey-1 enabled:hover:bg-[#777777]" size="lg" type="submit" disabled={isSubmitting}>
                    Login
                  </Button>
                )}
              </div>
              <div>
                <a onClick={forgotButton} className="text-md font-medium text-gray-900 hover:underline hover:cursor-pointer dark:text-cyan-500">
                  Forgot your password ?
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
                <Button className="w-full" color="light" size="lg" onClick={handleGoogleSignIn}>
                  <div className="flex items-center justify-center">
                    <div className="mr-2">
                      <FcGoogle style={{ fontSize: "24px" }} />
                    </div>
                    <div className="text-center">Login with Google</div>
                  </div>
                </Button>
              </div>
              <div>
                <span className="text-md font-medium text-[#777777]">
                  Don't have an account ?{" "}
                  <a onClick={signUpButton} className="text-md font-bold text-gray-900 hover:underline hover:cursor-pointer">
                    Sign Up
                  </a>
                </span>
              </div>
            </div>
          </form>
          <ModalFooter />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default LoginModal;
