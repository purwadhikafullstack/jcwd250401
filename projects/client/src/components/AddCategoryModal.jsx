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

function AddCategoryModal({ isOpen, isClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      categoryName: "",
      mainCategory: "",
      gender: "",
    },
    validationSchema: Yup.object({
      categoryName: Yup.string().required("Please enter your category name"),
      mainCategory: Yup.string().required("Please select the main category"),
      gender: Yup.string().required("Please select a gender"),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);

        // Modify the API call according to your needs
        const response = await api.post("/api/addCategory", {
          categoryName: values.categoryName,
          mainCategory: values.mainCategory,
          gender: values.gender,
        });

        if (response.status === 200) {
          setTimeout(() => {
            toast.success("Category added successfully", {
              autoClose: 1000,
              onAutoClose: (t) => {
                // Adjust the dispatch accordingly
                isClose();
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
      <Modal closeOnOverlayClick={false} isOpen={isOpen} size="xl" onClose={isClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(1px)" />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <div className="space-y-4 px-4 mb-6">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add Category</h3>
                  <h4 className="text-sm font-light text-gray-900 dark:text-white">Add a new category to your products</h4>
                </div>
                <div className="flex gap-18 justify-between items-center">
                  <div className="w-[20vw]">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Category Name</h4>
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      id="categoryName"
                      name="categoryName"
                      placeholder="Enter category name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500"
                      {...formik.getFieldProps("categoryName")}
                    />
                    {formik.touched.categoryName && formik.errors.categoryName ? <div className="text-red-500">{formik.errors.categoryName}</div> : null}
                  </div>
                </div>

                <div className="flex gap-18 justify-between items-center">
                  <div className="w-[20vw]">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Main Category</h4>
                  </div>
                  <div className="w-full">
                    <select id="mainCategory" name="mainCategory" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500" {...formik.getFieldProps("mainCategory")}>
                      <option value="" disabled>
                        Select main category
                      </option>
                      <option value="Jackets">Jackets</option>
                      <option value="Tops">Tops</option>
                      <option value="Bottom">Bottom</option>
                      <option value="Bags">Bags</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                    {formik.touched.mainCategory && formik.errors.mainCategory ? <div className="text-red-500">{formik.errors.mainCategory}</div> : null}
                  </div>
                </div>

                {/* Conditionally render the Gender select based on the selected Main Category */}
                {formik.values.mainCategory === "Bags" || formik.values.mainCategory === "Accessories" ? null : (
                  <div className="flex gap-18 justify-between items-center">
                    <div className="w-[20vw]">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">Gender</h4>
                    </div>
                    <div className="w-full">
                      <select id="gender" name="gender" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500" {...formik.getFieldProps("gender")}>
                        <option value="" disabled>
                          Select product gender
                        </option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                      {formik.touched.gender && formik.errors.gender ? <div className="text-red-500">{formik.errors.gender}</div> : null}
                    </div>
                  </div>
                )}

                <div>
                  {isSubmitting ? (
                    <Button className="w-full shadow-md bg-[#40403F] enabled:hover:bg-[#40403F] outline-none" size="lg" isProcessing processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />}>
                      Adding Category...
                    </Button>
                  ) : (
                    <Button className="w-full shadow-md bg-[#40403F] enabled:hover:bg-[#777777]" size="lg" type="submit" disabled={isSubmitting}>
                      Add Category
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

export default AddCategoryModal;
