import { Modal } from "flowbite-react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import api from "../api";
import * as yup from "yup";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../slices/accountSlices";
import {FiUpload } from "react-icons/fi";

export const UpdateProfileModal = ({ isOpen, onClose }) => {
  const username = useSelector((state) => state?.account?.profile?.data?.profile?.username);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const dispatch = useDispatch();

  const createObjectURL = (file) => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png, image/jpg",
    maxSize: 2000000,
    onDrop: (acceptedFiles) => {
      formik.setFieldValue("photoProfile", acceptedFiles[0]);
      setSelectedImage(acceptedFiles[0].name);
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

        const response = await api.patch(`/profile/${username}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.ok) {
          toast.success("Update profile success", {
            autoClose: 2500,
            onAutoClose: (t) => {
              setSelectedImage(null);
              setPreview(null);
              console.log(response);
              dispatch(updateProfile(response.data));
              onClose();
            },
          });
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
      }
    },
  });

  useEffect(() => {
    const getProfileDetail = async () => {
      try {
        const response = await api.get(`/profile/${username}`);
        const profile = response.data.detail;

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
        if (error?.response?.status === 401) {
          toast.error("You are not authorized to access this page. Please login first.", {
            duration: 1500,
          });
        } else {
          toast.error("An error occurred while fetching your profile. Please try again later.", {
            duration: 1500,
          });
        }
      }
    };
    getProfileDetail();
  }, []);

  return (
    <>
      <Modal show={isOpen} size="md" onClose={onClose} popup>
        <Modal.Header>
          <div className="p-4">
            <h3>Update Profile</h3>
          </div>
        </Modal.Header>
        <Modal.Body>
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
                <input type="text" id="firstName" name="firstName" placeholder="Enter your first name" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500" {...formik.getFieldProps("firstName")} />
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
                        <img src={preview} alt={selectedImage} className="h-[60%] w-[60%] rounded-lg shadow-lg"/>
                      </div>
                    )}
                  </div>
                  {preview ? null : 
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FiUpload color="gray" alt="upload" className="w-10 h-10 mx-auto" />
                    <span> JPG/JPEG or PNG max 2MB</span>
                    </div>}
                </div>
                <p className="mt-2">Selected File: <b>{selectedImage}</b></p>
                {formik.touched.photoProfile && formik.errors.photoProfile ? <div className="text-red-500">{formik.errors.photoProfile}</div> : null}
              </div>

              <div className="flex justify-between">
                <button className="w-[40%] h-[5vh] rounded-md text-white bg-black hover:bg-gray-600" onClick={onClose}>
                  Cancel
                </button>
                <button className="w-[40%] h-[5vh] rounded-md text-white bg-black hover:bg-gray-600" type="submit">
                  Update
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
