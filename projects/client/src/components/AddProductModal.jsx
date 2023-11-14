import React, { useRef, useState } from "react";
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
import { PiImage, PiImageThin, PiWarningCircleBold } from "react-icons/pi";

function AddProductModal({ isOpen, isClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const dispatch = useDispatch();
  const [formattedValue, setFormattedValue] = useState("");
  const [dropzoneImages, setDropzoneImages] = useState([]);

  const handleInputChange = (event) => {
    const rawValue = event.target.value.replace(/[^\d]/g, ""); // Remove non-numeric characters
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(rawValue);

    setFormattedValue(formatted);
    // You can also update the formik field value if needed
    formik.setFieldValue("productPrice", rawValue);
  };

  const formik = useFormik({
    initialValues: {
      productName: "",
      productGender: "",
      productMainCategory: "",
      productSubCategory: "",
      productDescription: "",
      productPrice: "",
    },
    validationSchema: Yup.object({
      productName: Yup.string().required("Please enter your product name"),
      productGender: Yup.string().required("Please enter your product gender"),
      productMainCategory: Yup.string().required("Please enter your product main category"),
      productSubCategory: Yup.string().required("Please enter your product sub category"),
      productDescription: Yup.string().required("Please enter your description"),
      productPrice: Yup.string().required("Please enter your product price"),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);

        const data = new FormData();
        data.append("productName", values.productName);
        data.append("productGender", values.productGender);
        data.append("productMainCategory", values.productMainCategory);
        data.append("productSubCategory", values.productSubCategory);
        data.append("productDescription", values.productDescription);
        data.append("productPrice", values.productPrice);

        if (values.productImages) {
          values.productImages.forEach((image) => {
            data.append("productImages", image);
          });
        }

        const response = await api.post("/product", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
  const fileInputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    if (activeIndex !== null) {
      const file = acceptedFiles[0];

      // Check if any files were dropped and meet the criteria
      if (file) {
        // Check file type
        if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
          // Handle incorrect file type (show a message or reject the file)
          console.error("Invalid file type. Please upload a JPEG or PNG file.");
          return;
        }

        // Check file size (2MB limit)
        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSizeInBytes) {
          // Handle oversized file (show a message or reject the file)
          console.error("File size exceeds the 2MB limit.");
          return;
        }

        const newPreviewImage = {
          ...file,
          preview: URL.createObjectURL(file),
          index: activeIndex,
        };

        // Update the dropzoneImages state
        setDropzoneImages((prevImages) => {
          const updatedImages = [...prevImages];
          const currentImageIndex = updatedImages.findIndex((img) => img.index === activeIndex);

          if (currentImageIndex !== -1) {
            // Replace existing photo for the clicked index
            updatedImages[currentImageIndex] = newPreviewImage;
          } else {
            // Add new image if it doesn't exist
            updatedImages.push(newPreviewImage);
          }

          return updatedImages;
        });

        // Set the Formik form field value
        formik.setFieldValue("productImages", dropzoneImages);
        // Reset the activeIndex after updating the preview image
        setActiveIndex(null);
      } else {
        // Handle case where no valid files were dropped
        console.error("Invalid file dropped.");
      }
    }
  };

  const handleClick = (index) => {
    setActiveIndex(index);
    // Trigger the file input click
    fileInputRef.current.click();
  };

  const genders = [
    { label: "Men", value: "men" },
    { label: "Women", value: "women" },
  ];

  const mainCategories = [
    { label: "Jackets", value: "jackets" },
    { label: "Tops", value: "tops" },
    { label: "Bottom", value: "bottom" },
    { label: "Bags", value: "bags" },
    { label: "Accessories", value: "accessories" },
    // ... more main categories
  ];

  const subCategories = [
    { label: "Shirts", value: "shirts" },
    { label: "Pants", value: "pants" },
    { label: "Dresses", value: "dresses" },
    { label: "Skirts", value: "skirts" },
    // ... more subcategories
  ];
  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} size={{ lg: "6xl" }} scrollBehavior="inside" onClose={isClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(1px)" />
        <ModalContent>
          <ModalHeader py={0}>
            <div className="px-4 lg:mt-7 mt-10 lg:mb-0 mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add Product</h3>
              <h4 className="text-sm font-light text-gray-900 dark:text-white">Add a new product to your store</h4>
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <div className="space-y-4 lg:space-y-3 px-4 mb-6">
                <div className="lg:flex flex lg:flex-row lg:space-x-20 lg:space-y-0 space-y-4 lg:justify-between lg:items-center flex-col">
                  <div className="lg:w-[20vw] w-full">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Product Name</h4>
                  </div>
                  <div className="w-full">
                    <input
                      type="productName"
                      id="productName"
                      name="productName"
                      placeholder="Enter product name..."
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg shadow-md shadow-gray-200 focus:ring-transparent focus:border-gray-500"
                      {...formik.getFieldProps("productName")}
                    />
                    {formik.touched.productName && formik.errors.productName ? (
                      <div className="ml-2 text-xs flex items-center gap-1 text-red-500">
                        <PiWarningCircleBold /> {formik.errors.productName}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="lg:flex flex lg:flex-row lg:space-x-20 lg:space-y-0 space-y-4 lg:justify-between lg:items-center flex-col">
                  <div className="lg:w-[20vw] w-full">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Product Price</h4>
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      id="productPrice"
                      name="productPrice"
                      placeholder="Enter product price..."
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg shadow-md shadow-gray-200 focus:ring-transparent focus:border-gray-500"
                      value={formattedValue}
                      onChange={handleInputChange}
                    />
                    {formik.touched.productPrice && formik.errors.productPrice ? (
                      <div className="ml-2 text-xs flex items-center gap-1 text-red-500">
                        <PiWarningCircleBold />
                        {formik.errors.productPrice}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="lg:flex lg:flex-row flex flex-col lg:space-x-20 space-y-2 lg:space-y-0 justify-between items-center">
                  <div className="lg:w-[20vw] w-full">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Product Category</h4>
                    <h4 className="text-xs font-light text-gray-900 dark:text-white">Select product main category, sub category, and gender if needed.</h4>
                  </div>
                  <div className="flex lg:flex-row space-y-2 lg:space-y-0 flex-col w-full ">
                    {formik.values.productMainCategory !== "bags" && formik.values.productMainCategory !== "accessories" ? (
                      <>
                        <div className="flex flex-col w-full">
                          <div>
                            <select
                              id="productMainCategory"
                              name="productMainCategory"
                              className="w-full px-4 py-2 border-2 border-gray-300 outline-none  lg:rounded-l-lg lg:rounded-none rounded-lg shadow-md shadow-gray-200 focus:ring-transparent focus:border-gray-500"
                              {...formik.getFieldProps("productMainCategory")}
                            >
                              <option value="" disabled className="text-gray-400">
                                Select main category
                              </option>
                              {mainCategories.map((category) => (
                                <option key={category.value} value={category.value}>
                                  {category.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          {formik.touched.productMainCategory && formik.errors.productMainCategory ? (
                            <div className="ml-2 text-xs flex items-center gap-1 text-red-500">
                              <PiWarningCircleBold />
                              {formik.errors.productMainCategory}
                            </div>
                          ) : null}
                        </div>
                        <div className="flex w-full flex-col">
                          <div>
                            <select
                              id="productSubCategory"
                              name="productSubCategory"
                              className="w-full px-4 py-2 border-2 border-gray-300 shadow-md shadow-gray-200  lg:rounded-none rounded-lg focus:ring-transparent focus:border-gray-500"
                              {...formik.getFieldProps("productSubCategory")}
                            >
                              <option value="" disabled className="text-gray-400">
                                Select sub category
                              </option>
                              {subCategories.map((category) => (
                                <option key={category.value} value={category.value}>
                                  {category.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          {formik.touched.productSubCategory && formik.errors.productSubCategory ? (
                            <div className="ml-2 text-xs flex items-center gap-1 text-red-500">
                              <PiWarningCircleBold />
                              {formik.errors.productSubCategory}
                            </div>
                          ) : null}
                        </div>
                        <div className="flex w-full flex-col">
                          <div>
                            <select
                              id="productGender"
                              name="productGender"
                              className="w-full px-4 py-2 border-2 border-gray-300 lg:rounded-r-lg lg:rounded-none rounded-lg shadow-md shadow-gray-20 focus:ring-transparent focus:border-gray-500"
                              {...formik.getFieldProps("productGender")}
                            >
                              <option value="" disabled className="text-gray-400">
                                Select gender
                              </option>
                              {genders.map((category) => (
                                <option key={category.value} value={category.value}>
                                  {category.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          {formik.touched.productGender && formik.errors.productGender ? (
                            <div className="ml-2 text-xs flex items-center gap-1 text-red-500">
                              <PiWarningCircleBold />
                              {formik.errors.productGender}
                            </div>
                          ) : null}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col w-full">
                          <div>
                            <select
                              id="productMainCategory"
                              name="productMainCategory"
                              className="w-full px-4 py-2 border-2 border-gray-300 outline-none lg:rounded-l-lg lg:rounded-none rounded-lg  shadow-md shadow-gray-200 focus:ring-transparent focus:border-gray-500"
                              {...formik.getFieldProps("productMainCategory")}
                            >
                              <option value="" disabled className="text-gray-400">
                                Select main category
                              </option>
                              {mainCategories.map((category) => (
                                <option key={category.value} value={category.value}>
                                  {category.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          {formik.touched.productMainCategory && formik.errors.productMainCategory ? (
                            <div className="ml-2 text-xs flex items-center gap-1 text-red-500">
                              <PiWarningCircleBold />
                              {formik.errors.productMainCategory}
                            </div>
                          ) : null}
                        </div>
                        <div className="flex w-full flex-col">
                          <div>
                            <select
                              id="productSubCategory"
                              name="productSubCategory"
                              className="w-full px-4 py-2 border-2 border-gray-300 shadow-md shadow-gray-200 lg:rounded-none lg:rounded-r-lg rounded-lg focus:ring-transparent focus:border-gray-500"
                              {...formik.getFieldProps("productSubCategory")}
                            >
                              <option value="" disabled className="text-gray-400">
                                Select sub category
                              </option>
                              {subCategories.map((category) => (
                                <option key={category.value} value={category.value}>
                                  {category.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          {formik.touched.productSubCategory && formik.errors.productSubCategory ? (
                            <div className="ml-2 text-xs flex items-center gap-1 text-red-500">
                              <PiWarningCircleBold />
                              {formik.errors.productSubCategory}
                            </div>
                          ) : null}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="lg:flex lg:flex-row flex flex-col lg:space-x-20 lg:space-y-0 space-y-4 justify-between ">
                  <div className="lg:w-[20vw] w-full space-y-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Product Description</h4>
                    <h4 className="text-xs font-light text-gray-900 dark:text-white">Make sure the product description contains a detailed explanation regarding your product so that buyers can easily understand and find your product.</h4>
                  </div>
                  <div className="w-full">
                    <textarea
                      type="productDescription"
                      id="productDescription"
                      name="productDescription"
                      placeholder="Describe the product..."
                      className="w-full h-36 px-4 py-2 border-2 border-gray-300 rounded-lg shadow-md shadow-gray-200 focus:ring-transparent resize-none focus:border-gray-500"
                      {...formik.getFieldProps("productDescription")}
                    />
                    {formik.touched.productDescription && formik.errors.productDescription ? (
                      <div className="ml-2 text-xs flex items-center gap-1 text-red-500">
                        <PiWarningCircleBold />
                        {formik.errors.productDescription}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="lg:flex flex lg:flex-row flex-col lg:space-x-20 lg:space-y-0 space-y-4 justify-between">
                  <div className="w-full flex-col space-y-2">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Product Image</h4>
                    <h4 className="text-xs font-light text-gray-900 dark:text-white">Add at least 3 photos of the product to showcase its unique qualities and grab the attention of your followers.</h4>
                  </div>
                  <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={(e) => onDrop([e.target.files[0]])} />
                  <div className="lg:flex flex lg:flex-row flex-col lg:justify-center lg:items-center justify-center items-center lg:space-x-5 space-y-4 lg:space-y-0">
                    {[0, 1, 2, 3, 4].map((index) => {
                      const previewImage = previewImages.find((img) => img.index === index);
                      return (
                        <div key={index} className="lg:w-[139px] lg:h-[139px] w-[80%] h-[250px] relative">
                          <div
                            onClick={() => handleClick(index)}
                            className={`w-full h-full border-dashed border-2 border-gray-300 rounded-md flex shadow-md shadow-gray-200 focus:ring-transparent items-center justify-center bg-transparent ${
                              activeIndex === index ? "bg-gray-100" : ""
                            }`}
                          >
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              {previewImage ? (
                                <img src={previewImage.preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md shadow-lg" />
                              ) : (
                                <>
                                  {index === 0 ? (
                                    <>
                                      <PiImageThin className="text-gray-400" size={38} />
                                      <p className="text-gray-400">Main Photo</p>
                                    </>
                                  ) : (
                                    <>
                                      <PiImageThin className="text-gray-400" size={38} />
                                      <p className="text-gray-400">Photo {index + 1}</p>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  {isSubmitting ? (
                    <Button
                      className="w-full shadow-md shadow-gray-200 focus:ring-transparent bg-[#40403F] enabled:hover:bg-[#40403F] outline-none"
                      size="lg"
                      isProcessing
                      processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />}
                    >
                      Adding Product...
                    </Button>
                  ) : (
                    <Button className="w-full shadow-md shadow-gray-200 focus:ring-transparent bg-[#40403F] enabled:hover:bg-[#777777]" size="lg" type="submit" disabled={isSubmitting}>
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
