import React, { useState } from "react";
import { Button } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api";
import { toast } from "sonner";
import { AiOutlineLoading } from "react-icons/ai";
import { showLoginModal } from "../slices/authModalSlices";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { addCategory } from "../slices/categorySlices";
import { useDispatch } from "react-redux";

function AddCategoryModal({ isOpen, isClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mainCategories = ["Jackets", "Tops", "Bottom", "Bags", "Accessories"];
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      mainCategory: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter your category name"),
      mainCategory: Yup.string().required("Please select the main category"),
    }),

    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);

        const response = await api.post("/category", {
          name: values.name,
          mainCategory: values.mainCategory,
        });

        dispatch(addCategory(response.data.detail));

        if (response.status === 201) {
          setTimeout(() => {
            toast.success("Category added successfully", {
              duration: 700,
              autoClose: 1000,
              onAutoClose: (t) => {
                formik.resetForm();
                isClose();
                setIsSubmitting(false);
              },
            });
          }, 1000);
        }
      } catch (error) {
        if (error.response.status === 500) {
          toast.error(error.response.data.message, {
            description: error.response.data.detail,
          });
        } else if (error.response.status === 400) {
          toast.error(error.response.data.message, {
            description: error.response.data.detail,
          });
        } else if (error.response.status === 403) {
          toast.error(error.response.data.message, {
            description: error.response.data.detail,
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

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
                    <input type="text" id="name" name="name" placeholder="Enter category name" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500" {...formik.getFieldProps("name")} />
                    {formik.touched.name && formik.errors.name ? <div className="text-red-500">{formik.errors.name}</div> : null}
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
                      {mainCategories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {formik.touched.mainCategory && formik.errors.mainCategory ? <div className="text-red-500">{formik.errors.mainCategory}</div> : null}
                  </div>
                </div>

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
