import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "flowbite-react";
import * as yup from "yup";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { setUsername, updatePhotoProfile, updateProfile } from "../slices/accountSlices";
import { FiUpload } from "react-icons/fi";
import { AiOutlineLoading } from "react-icons/ai";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import getProfile from "../api/profile/getProfile";
import updateUserProfile from "../api/profile/updateUserProfile";
import { useLocation, useNavigate } from "react-router-dom";

export const UpdateProfileModal = ({ isOpen, onClose }) => {
  const username = useSelector((state) => state?.account?.username);
  const token = useSelector((state) => state?.account?.profile?.data?.token);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createObjectURL = (file) => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    maxSize: 2000000,
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections && fileRejections.length > 0) {
        toast.error("Invalid file type. Please upload a JPEG or PNG file.");
      }

      formik.setFieldValue("photoProfile", acceptedFiles[0]);
      setSelectedImage(acceptedFiles[0]?.name);

      setTimeout(() => {
        setPreview(createObjectURL(acceptedFiles[0]));
      }, 1000);
    },
  });
  const formik = useFormik({
    initialValues: {
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
      photoProfile: "",
    },
    validationSchema: yup.object({
      userName: yup.string().required("Username is required"),
      firstName: yup.string().optional(),
      lastName: yup.string().optional(),
      email: yup.string().email("Invalid email address").required("Email is required"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const data = new FormData();
        data.append("userName", values.userName);
        data.append("email", values.email);

        if (values.firstName) {
          data.append("firstName", values.firstName);
        }

        if (values.lastName) {
          data.append("lastName", values.lastName);
        }

        if (values.photoProfile) {
          data.append("photoProfile", values.photoProfile);
        }

        data.append("token", token);
        const response = await updateUserProfile({ username, data });

        if (response.ok) {
          setTimeout(() => {
            toast.success("Update profile success", {
              autoClose: 2000,
              onAutoClose: (t) => {
                setSelectedImage(null);
                setPreview(null);
                setIsSubmitting(false);
                dispatch(setUsername(values.userName));
                dispatch(updateProfile(response));
                if(values.photoProfile) {
                  dispatch(updatePhotoProfile(values.photoProfile));
                }
                onClose();
              },
            });
          }, 2000);
        } else {
          toast.error("Please provide valid data", {
            duration: 2500,
            description: "Check your data again.",
          });
        }
      } catch (error) {
        console.error(error);

        if (error?.response?.status === 400) {
          toast.error("Please provide valid data", {
            duration: 2500,
            description: "Check your data again, username might be taken.",
          });
        } else if (error?.response?.status === 404) {
          toast.error("Update profile failed", {
            duration: 2500,
            description: "User not found.",
            onAutoClose: (t) => {
              setSelectedImage(null);
              setPreview(null);
            },
          });
        } else {
          toast.error("Update profile failed", {
            duration: 2500,
            description: "An error occurred while updating your profile. Please try again later.",
          });
        }
      } finally {
        setTimeout(() => {
          setIsSubmitting(false);
        }, 4000);
      }
    },
  });

  const fetchProfileDetail = async () => {
    try {
      const response = await getProfile({ username, token });
      const profile = response.detail;

      const values = {
        userName: profile.username,
        email: profile.email,
        photoProfile: profile.photoProfile,
      };

      if (profile.firstName !== null) {
        values.firstName = profile.firstName;
      }

      if (profile.lastName !== null) {
        values.lastName = profile.lastName;
      }

      formik.setValues(values);
    } catch (error) {
      if ( error.response && error?.response?.status === 401) {
        toast.error("You are not authorized to access this page. Please login first.", {
          duration: 1500,
        });
      } else {
        toast.error("An error occurred while fetching your profile. Please try again later.", {
          duration: 1500,
        });
      }
    }
  }

  useEffect(() => {
    fetchProfileDetail();
  }, [username]);

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} size="md" onClose={onClose} scrollBehavior="inside" isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(2px)" />
        <ModalContent>
          <ModalHeader>
            <div className="px-2 mt-2">
              <h3>Update Profile</h3>
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <div className="space-y-4 px-4">
                <div>
                  <div className="mb-2 block">
                    <h4 className="text-sm text-gray-900 dark:text-white">Username</h4>
                  </div>
                  <input type="text" id="userName" name="userName" placeholder="Enter your username" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500" {...formik.getFieldProps("userName")} />
                  {formik.touched.userName && formik.errors.userName ? <div className="text-red-500">{formik.errors.userName}</div> : null}
                </div>
                <div>
                  <div className="mb-2 block">
                    <h4 className="text-sm text-gray-900 dark:text-white">First name</h4>
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500"
                    {...formik.getFieldProps("firstName")}
                  />
                  {formik.touched.firstName && formik.errors.firstName ? <div className="text-red-500">{formik.errors.firstName}</div> : null}
                </div>
                <div>
                  <div className="mb-2 block">
                    <h4 className="text-sm text-gray-900 dark:text-white">Last name</h4>
                  </div>
                  <input type="text" id="lastName" name="lastName" placeholder="Enter your last name" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500" {...formik.getFieldProps("lastName")} />
                  {formik.touched.lastName && formik.errors.lastName ? <div className="text-red-500">{formik.errors.lastName}</div> : null}
                </div>
                <div>
                  <div className="mb-2 block">
                    <h4 className="text-sm text-gray-900 dark:text-white">Email</h4>
                  </div>
                  <input type="email" id="email" name="email" placeholder="Enter your email" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500" {...formik.getFieldProps("email")} />
                  {formik.touched.email && formik.errors.email ? <div className="text-red-500">{formik.errors.email}</div> : null}
                </div>

                <div className="my-4 block">
                  <div {...getRootProps()} className="border-solid border-2 border-gray-300 shadow-lg rounded-lg w-full p-4 hover:outline hover:outline-2 hover:outline-gray-600">
                    <input {...getInputProps()} name="photoProfile" />
                    <div>
                      {preview && (
                        <div className="flex justify-center">
                          <img src={preview} alt={selectedImage} className="h-[80%] w-[80%] rounded-lg shadow-lg" />
                        </div>
                      )}
                    </div>
                    {preview ? null : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FiUpload color="gray" alt="upload" className="w-10 h-10 mx-auto" />
                        <span> JPG/JPEG or PNG max 2MB</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-2">
                    Selected File: <b>{selectedImage}</b>
                  </p>
                  {formik.touched.photoProfile && formik.errors.photoProfile ? <div className="text-red-500">{formik.errors.photoProfile}</div> : null}
                </div>

                <div>
                  {isSubmitting ? (
                    <Button className="w-full bg-[#40403F] enabled:hover:bg-[#40403F] outline-none" size="md" isProcessing processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />}>
                      Updating...
                    </Button>
                  ) : (
                    <Button className="w-full bg-[#40403F] enabled:hover:bg-[#777777]" size="md" type="submit" disabled={isSubmitting}>
                      Update
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
};
