import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BsImage } from "react-icons/bs";
import api from "../api";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoginModal } from "../slices/authModalSlices";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter } from "@chakra-ui/react";

export const PaymentProofModal = ({ orderId, isOpen, onClose }) => {
  const isLogin = useSelector((state) => state?.account?.isLogin);
  const userName = useSelector((state) => state?.account?.profile?.data?.profile?.username);
  const userDataInformation = useSelector((state) => state?.account?.profile?.data?.profile);
  const [userData, setUserData] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // create a simple object url from the image
  const createObjectURL = (file) => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxSize: 2000000,
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections && fileRejections.length > 0) {
        toast.error("Invalid file type. Please upload a JPEG or PNG file.");
      }

      formik.setFieldValue("paymentProofImage", acceptedFiles[0]);
      setSelectedImageName(acceptedFiles[0].name);
      
      setTimeout(() => {
        setPreview(createObjectURL(acceptedFiles[0]));
      }, 1000);
    },
  });

  const formik = useFormik({
    initialValues: {
      paymentProofImage: null,
    },
    onSubmit: async (values) => {
      try {
        const data = new FormData();
        data.append("paymentProofImage", values.paymentProofImage);
        setIsUploading(true);

        const response = await api.put(`/order/${userData.id}/${orderId}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.ok) {
          setTimeout(() => {
            toast.success(response.data.message);
            formik.resetForm();
            setSelectedImageName(null);
            setPreview(null);
            setIsUploading(false);
            onClose();
          }, 2000);
        }
      } catch (error) {
        if (error.response && (error.response.status === 400 || error.response.status === 404)) {
          toast.error(error.response.data.message);
          setIsUploading(false);
        } else if (error.response && error.response.status === 500) {
          toast.error("Unsupported file type, please upload jpg/jpeg or png file");
          setIsUploading(false);
          console.error(error.response.data.detail);
        }
      }
    },
  });

  useEffect(() => {
    if (!isLogin) {
      navigate("/");
      dispatch(showLoginModal());
    } else {
      const getUserData = async () => {
        try {
          const response = await api.get(`/profile/${userName}`);
          setUserData(response.data.detail);
        } catch (error) {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message);
          } else if (error.response && error.response.status === 500) {
            toast.error(error.response.data.message);
          }
        }
      };
      getUserData();
    }
  }, [userDataInformation]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={"lg"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Payment Confirmation</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <div className="flex flex-col justify-center items-center">
              <p className="text-center mb-5 font-bold text-lg">Please upload your payment proof</p>
              <div>
                <div {...getRootProps()} className="h-[35vh] w-[65vw] sm:w-[25vw] border-2 border-gray-400 rounded-md cursor-pointer hover:border-gray-600">
                  <input {...getInputProps()} name="paymentProofImage" />
                  {preview ? (
                    <div className="h-full w-full">
                      <img src={preview} alt="preview" className="h-full w-full object-cover rounded-md" />
                    </div>
                  ) : (
                    <div className="h-full w-full flex flex-col justify-center items-center">
                      <AiOutlineCloudUpload className="text-4xl" />
                      <p className="text-gray-400 text-center">JPG/JPEG Or PNG max 2MB</p>
                    </div>
                  )}
                  {formik.errors.paymentProofImage && formik.touched.paymentProofImage ? <div className="text-red-500">{formik.errors.paymentProofImage}</div> : null}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-5">
              {isUploading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                selectedImageName && (
                  <div className="flex gap-2 font-semibold">
                    <BsImage className="ml-2 text-2xl" />
                    <p>{selectedImageName}</p>
                  </div>
                )
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <button type="submit" className="bg-[#40403F] hover:bg-[#555554] text-white p-2 rounded-md font-semibold ">
              Submit
            </button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
