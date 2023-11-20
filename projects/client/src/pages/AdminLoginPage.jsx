import { useNavigate } from "react-router-dom";
import image from "../assets/image-5.jpg";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "flowbite-react";
import { loginAdmin } from "../slices/accountSlices";
import rains from "../assets/rains.png";
import api from "../api";
import { toast } from "sonner";
import { Switch } from "@chakra-ui/react";
import ForgotPasswordModal from "../components/ForgotPasswordModal";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleShowForgotPasswordModal = () => setShowForgotPasswordModal(!showForgotPasswordModal);

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
        const response = await api.post("/auth/admin", {
          email: values.email,
          password: values.password,
          remember: values.remember,
        });

        if (response.status === 200) {
          const responseData = response.data;
          setTimeout(() => {
            toast.success("Login success", {
              autoClose: 1000,
              onAutoClose: (t) => {
                setIsSubmitting(false);
                dispatch(loginAdmin(responseData));
                navigate("/dashboard");
              },
            });
          }, 600);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            setTimeout(() => {
              toast.error("Email or password incorrect");
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
        }, 6000);
      }
    },
  });

  return (
    <div className="flex justify-between items-center h-screen">
      <div className="hidden lg:flex lg:w-[60vw] h-screen bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}>
        &nbsp;
      </div>
      <div className="w-screen lg:w-[40vw] flex items-center justify-center px-10 lg:px-20">
        <div className="shadow-lg px-10 h-[70vh] flex justify-center items-center rounded-lg">
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-10">
              <div className="flex flex-col gap-2 mb-4">
                <img src={rains} alt="logo" className="w-[25%]"></img>
                <span className="text-sm font-bold text-gray-900 dark:text-white">Nice to see you again</span>
              </div>
              <div>
                <div className="mb-2 block">
                  <h4 className="text-sm text-gray-900 dark:text-white">Email</h4>
                </div>
                <input type="email" id="email" name="email" placeholder="Enter your email" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm" {...formik.getFieldProps("email")} />
                {formik.touched.email && formik.errors.email ? <div className="text-red-500">{formik.errors.email}</div> : null}
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch id="rememberme" colorScheme="gray" isChecked={formik.values.remember} onChange={() => formik.setFieldValue("remember", !formik.values.remember)} />
                  <span className="text-sm text-gray-900 dark:text-white">Remember me</span>
                </div>
                <a className="text-sm hover:underline mr-2 font-normal font-sagoe text-[#007AFF] cursor-pointer" onClick={handleShowForgotPasswordModal}>
                  Forgot password?
                </a>
              </div>
              <div>
                {isSubmitting ? (
                  <Button className="w-full bg-[#40403F] enabled:hover:bg-[#40403F] outline-none" size="lg" isProcessing processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />}>
                    Logging in...
                  </Button>
                ) : (
                  <Button className="w-full bg-[#40403F] enabled:hover:bg-[#777777]" size="lg" type="submit" disabled={isSubmitting}>
                    Login
                  </Button>
                )}
              </div>
              <div></div>
            </div>
          </form>
        </div>
      </div>
      <ForgotPasswordModal isOpen={showForgotPasswordModal} isClose={handleShowForgotPasswordModal} userType={"admin"} />
    </div>
  );
}

export default AdminLoginPage;
