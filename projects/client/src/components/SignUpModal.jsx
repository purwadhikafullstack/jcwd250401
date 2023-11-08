import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading } from "react-icons/ai";
import { Button, Modal } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { showLoginModal } from "../slices/authModalSlices";
import { hideSignUpModal } from "../slices/authModalSlices";
import { showVerifyModal } from "../slices/authModalSlices";
import { setEmail } from "../slices/authModalSlices";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

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
const auth = getAuth(firebaseApp);

function SignUpModal({ isOpen, isClose, openLoginModal, openVerifyModal }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const loginButton = () => {
    dispatch(showLoginModal());
    dispatch(hideSignUpModal());
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const auth = getAuth();
      const response = await api.post("/auth/registergoogle", {
        email: user.email,
      });

      if (response.status === 201) {
        await signOut(auth);
        localStorage.clear();
        setTimeout(() => {
          toast.success("Sign up with google success, redirecting you to login page", {
            autoClose: 1000,
            onAutoClose: (t) => {
              dispatch(showLoginModal());
              dispatch(hideSignUpModal());
            },
          });
        }, 1000);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setTimeout(() => {
            toast.error("Email already exists");
            signOut(auth);
            localStorage.clear();
          }, 2000);
        } else {
          // Handle other HTTP errors
        }
      } else if (error.request) {
        // Handle network errors (request was made but no response received)
      } else {
        // Handle other non-network, non-HTTP-related errors
      }
    }
  };

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
        const response = await api.post("/auth/register", {
          email: values.email,
        });

        if (response.status === 201) {
          setTimeout(() => {
            toast.success("Verification code has been send to your email", {
              autoClose: 1000,
              onAutoClose: (t) => {
                dispatch(showVerifyModal());
                dispatch(hideSignUpModal());
                setIsSubmitting(false);
              },
            });
            dispatch(setEmail(response.data.user.email));
          }, 1000);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            setTimeout(() => {
              toast.error("Email already exists");
              setIsSubmitting(false);
            }, 2000);
          } else {
            // Handle other HTTP errors
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
        }, 5000);
      }
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
                {isSubmitting ? (
                  <Button className="w-full bg-[#40403F] enabled:hover:bg-[#40403F] outline-none" size="lg" isProcessing processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />}>
                    Signing Up...
                  </Button>
                ) : (
                  <Button className="w-full bg-[#40403F] enabled:hover:bg-[#777777]" size="lg" type="submit" disabled={isSubmitting}>
                    Sign Up
                  </Button>
                )}
              </div>

              <div>
                <div className="flex items-center space-x-4">
                  <div className="flex-grow border-t border-gray-900"></div>
                  <span className="text-sm text-gray-900 font-semibold">Or with</span>
                  <div className="flex-grow border-t border-gray-900"></div>
                </div>
              </div>
              <div>
                <Button className="w-full" color="light" size="lg" onClick={handleGoogleSignUp}>
                  <div className="flex items-center justify-center">
                    <div className="mr-2">
                      <FcGoogle style={{ fontSize: "24px" }} />
                    </div>
                    <div className="text-center">Sign Up with Google</div>
                  </div>
                </Button>
              </div>
              <div>
                <span className="text-md font-medium text-[#777777]">
                  Have an account ?{" "}
                  <a className="text-md font-bold text-gray-900 hover:underline hover:cursor-pointer" onClick={loginButton}>
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
