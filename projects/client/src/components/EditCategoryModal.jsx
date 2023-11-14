import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import api from "../api";

export const EditCategoryModal = ({ isOpen, onClose, data }) => {
  const mainCategories = ["Jackets", "Tops", "Bottom", "Bags", "Accessories"];

  const handleCategoryChange = (e) => {
    const selectedValue = e.target.value;
    formik.setFieldValue("mainCategory", selectedValue);
  };

  const handleGenderChange = (e) => {
    const selectedValue = e.target.value
    formik.setFieldValue("gender", selectedValue)
  }

  const formik = useFormik({
    initialValues: {
      name: data?.name,
      mainCategory: data?.mainCategory,
      gender: data?.gender,
    },
    validationSchema: yup.object({
      name: yup.string().required("Please enter your category name"),
      mainCategory: yup.string().required("Please select the main category"),
      gender: yup.string().required("Please select a gender"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await api.put(`/category/${data.id}`, {
          name: values.name,
          mainCategory: values.mainCategory,
          gender: values.gender,
        });

        if (response.data.ok) {
          toast.success(response.data.message, {
            description: response.data.detail.name,
            onAutoClose: () => onClose(),
          });
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message, {
            description: error.response.data.detail,
          });
        } else if (error.response && error.response.status === 500) {
          toast.error(error.response.data.message, {
            description: error.response.data.detail,
          });
          console.error(error);
        }
      }
    },
  });
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay bg="none" backdropFilter="blur(1px)" />
        <ModalContent>
          <form onSubmit={formik.handleSubmit}>
            <ModalHeader>Edit Category</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="flex flex-col gap-4">
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="name">Category Name</label>
                  <input type="text" name="name" id="name" className="border border-black rounded-md p-2" placeholder="Category Name" {...formik.getFieldProps("name")} />
                  {formik.errors.name && formik.touched.name && <p className="text-red-500">{formik.errors.name}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="parentCategoryId">Main Category</label>
                  <select name="parentCategoryId" id="parentCategoryId" className="border border-black rounded-md p-2" {...formik.getFieldProps("parentCategoryId")} onChange={handleCategoryChange}>
                    <option value="">{formik.values.mainCategory}</option>
                    {mainCategories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {formik.errors.parentCategoryId && formik.touched.parentCategoryId && <p className="text-red-500">{formik.errors.parentCategoryId}</p>}
                </div>

                {/* Conditionally render the Gender select based on the selected Main Category */}
                {formik.values.mainCategory === "Bags" || formik.values.mainCategory === "Accessories" ? null : (
                  <div className="flex gap-18 justify-between items-center">
                    <div className="w-[20vw]">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">Gender</h4>
                    </div>
                    <div className="w-full">
                      <select id="gender" name="gender" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500" {...formik.getFieldProps("gender")} onChange={handleGenderChange}>
                        <option value="" disabled>
                          {formik.values.gender}
                        </option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                      </select>
                      {formik.touched.gender && formik.errors.gender ? <div className="text-red-500">{formik.errors.gender}</div> : null}
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <button className="bg-slate-900 hover:bg-slate-700 text-white p-2 rounded-md mr-2" onClick={onClose}>
                Cancel
              </button>
              <button className="bg-red-700 hover:bg-red-800 p-2 text-white rounded-md" type="submit">
                Save
              </button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
