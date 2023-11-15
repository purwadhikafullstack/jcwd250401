import React, { useEffect, useRef, useState } from "react";
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
  const [subCategories, setSubCategories] = useState([]);

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
      productImages: [],
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

        if (response.status === 201) {
          setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Successfully added new product", {
              autoClose: 1000,
              onAutoClose: (t) => {
                formik.resetForm();
                setDropzoneImages([]);
                setPreviewImages([]);
                setFormattedValue("");
                isClose();
              },
            });
          }, 3000);
        }
      } catch (error) {
        // Handle different error scenarios based on the HTTP status code
      } finally {
        setTimeout(() => {
          setIsSubmitting(false);
        }, 8000);
      }
    },
  });

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await api.get("/category/sub-categories", {
          params: {
            mainCategory: formik.values.productMainCategory,
          },
        });

        if (response.data.ok) {
          setSubCategories(response.data.detail);
        } else {
          toast.error(response.data.message, {
            description: response.data.detail,
          });
        }
      } catch (error) {
        // Handle different error scenarios based on the HTTP status code
      }
    };

    fetchSubCategories();
  }, [formik.values.productMainCategory]);

  // React Dropzone Configuration

  useEffect(() => {
    // Update component or perform actions after state changes
    console.log("State updated:", dropzoneImages);
  }, [dropzoneImages]);

  const fileInputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    if (activeIndex !== null) {
      const file = acceptedFiles[0];

      if (file) {
        if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
          console.error("Invalid file type. Please upload a JPEG or PNG file.");
          return;
        }

        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSizeInBytes) {
          console.error("File size exceeds the 2MB limit.");
          return;
        }

        const newPreviewImage = {
          file,
          preview: URL.createObjectURL(file),
          index: activeIndex,
        };

        // Update the dropzoneImages state
        setDropzoneImages((prevImages) => {
          const updatedImages = [...prevImages];
          const currentImageIndex = updatedImages.findIndex((img) => img.index === activeIndex);

          if (currentImageIndex !== -1) {
            updatedImages[currentImageIndex] = newPreviewImage;
          } else {
            updatedImages.push(newPreviewImage);
          }

          // Update the productImages array in formik values
          formik.setFieldValue(
            "productImages",
            updatedImages.map((img) => img.file)
          );

          return updatedImages;
        });

        // Reset the activeIndex after updating the preview image
        setActiveIndex(null);
      } else {
        console.error("Invalid file dropped.");
      }
    }
  };

  const handleClick = (index) => {
    setActiveIndex(index);
    fileInputRef.current.click();
  };

  const genders = [
    { label: "Men", value: "Men" },
    { label: "Women", value: "Women" },
  ];

  const mainCategories = [
    { label: "Jackets", value: "Jackets" },
    { label: "Tops", value: "Tops" },
    { label: "Bottom", value: "Bottom" },
    { label: "Bags", value: "Bags" },
    { label: "Accessories", value: "Accessories" },
    // ... more main categories
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
                              {subCategories.map((subcategory) => (
                                <option key={subcategory.id} value={subcategory.name}>
                                  {subcategory.name}
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
                      const previewImage = dropzoneImages.find((img) => img.index === index);

                      return (
                        <div key={index} className="lg:w-[131px] lg:h-[131px] w-[80%] h-[250px] relative">
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
