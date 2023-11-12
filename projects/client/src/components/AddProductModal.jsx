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
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { PiImage, PiImageThin } from "react-icons/pi";

function AddProductModal({ isOpen, isClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      productName: "",
      productCategory: "",
      productDescription: "",
    },
    validationSchema: Yup.object({
      productName: Yup.string().required("Please enter your product name"),
      productCategory: Yup.string().required("Please enter your product category"),
      productDescription: Yup.string().required("Please enter your description"),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);

        const response = await api.post("/auth/forgotpassword", {
          email: values.email,
        });

        if (response.status === 200) {
          setTimeout(() => {
            toast.success("Reset password link has been sent to your email", {
              autoClose: 1000,
              onAutoClose: (t) => {
                dispatch(hideForgotPasswordModal());
                setIsSubmitting(false);
              },
            });
          }, 1000);
        }
      } catch (error) {
        // Handle different error scenarios based on the HTTP status code
      } finally {
        // Reset form and set submitting to false
        formik.resetForm();
        setIsSubmitting(false);
      }
    },
  });

  // React Dropzone Configuration
  const onDrop = (acceptedFiles) => {
    // Handle the dropped files here
    console.log(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} size="6xl" onClose={isClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(1px)" />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <div className="space-y-4 px-4 mb-8">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add Product</h3>
                  <h4 className="text-sm font-light text-gray-900 dark:text-white">Add a new product to your store</h4>
                </div>
                <div className="flex gap-20 justify-between items-center">
                  <div className="w-[20vw]">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Product Name</h4>
                  </div>
                  <div className="w-full">
                    <input
                      type="productName"
                      id="productName"
                      name="productName"
                      placeholder="Enter product name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500"
                      {...formik.getFieldProps("productName")}
                    />
                    {formik.touched.productName && formik.errors.productName ? <div className="text-red-500">{formik.errors.productName}</div> : null}
                  </div>
                </div>
                <div className="flex gap-20 justify-between items-center">
                  <div className="w-[20vw]">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Product Category</h4>
                  </div>
                  <div className="w-full">
                  <input
                    type="productCategory"
                    id="productCategory"
                    name="productCategory"
                    placeholder="Select product category"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500"
                    {...formik.getFieldProps("productCategory")}
                  />
                  {formik.touched.productCategory && formik.errors.productCategory ? <div className="text-red-500">{formik.errors.productCategory}</div> : null}
                  </div>
                </div>
                <div className="flex gap-20 justify-between ">
                  <div className="w-[20vw] space-y-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Product Description</h4>
                    <h4 className="text-xs font-light text-gray-900 dark:text-white">Make sure the product description contains a detailed explanation regarding your product so that buyers can easily understand and find your product.</h4>
                  </div>
                  <div className="w-full">

                  <textarea
                    type="productDescription"
                    id="productDescription"
                    name="productDescription"
                    placeholder="Describe the product"
                    className="w-full h-36 px-4 py-2 border border-gray-300 rounded-lg shadow-sm resize-none focus:border-gray-500"
                    {...formik.getFieldProps("productDescription")}
                    />
                  {formik.touched.productDescription && formik.errors.productDescription ? <div className="text-red-500">{formik.errors.productDescription}</div> : null}
                    </div>
                </div>
                <div className="flex gap-20 justify-between">
                  <div className="w-[20vw] flex flex-col space-y-2">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Product Image</h4>
                    <h4 className="text-xs font-light text-gray-900 dark:text-white">Add at least 3 photos of the product to showcase its unique qualities and grab the attention of your followers.</h4>
                  </div>
                  <div className="flex w-full space-x-5">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <div key={index} className="w-[139px] h-[139px] relative">
                        <div {...getRootProps()} className={`w-full h-full border-dashed border-2 border-gray-300 rounded-md flex shadow-md items-center justify-center bg-transparent ${isDragActive ? "bg-gray-100" : ""}`}>
                          <input {...getInputProps()} />
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            {index === 0 ? (
                              <>
                                <PiImageThin className="text-gray-400" size={38} />
                                <p className="text-gray-400">Main Photo</p>
                              </>
                            ) : (
                              <>
                                <PiImageThin className="text-gray-400" size={38} />
                                <p className="text-gray-400">Photo {index}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {isSubmitting ? (
                    <Button className="w-full shadow-md bg-[#40403F] enabled:hover:bg-[#40403F] outline-none" size="lg" isProcessing processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />}>
                      Adding Product...
                    </Button>
                  ) : (
                    <Button className="w-full shadow-md bg-[#40403F] enabled:hover:bg-[#777777]" size="lg" type="submit" disabled={isSubmitting}>
                      Add Product
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddProductModal;
