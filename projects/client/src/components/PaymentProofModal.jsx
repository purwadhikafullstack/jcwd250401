import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BsImage } from "react-icons/bs";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoginModal } from "../slices/authModalSlices";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter } from "@chakra-ui/react";
import getProfile from "../api/profile/getProfile";
import uploadPayProof from "../api/order/uploadPayProof";

export const PaymentProofModal = ({ orderId, paymentBy, totalPrice, isOpen, onClose }) => {
  const isLogin = useSelector((state) => state?.account?.isLogin);
  const userName = useSelector((state) => state?.account?.profile?.data?.profile?.username);
  const token = useSelector((state) => state?.account?.profile?.data?.token);
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

        const response = await uploadPayProof({
          orderId,
          data,
          userDataId: userData?.id,
        });

        if (response.ok) {
          setTimeout(() => {
            toast.success(response.message);
            formik.resetForm();
            setSelectedImageName(null);
            setPreview(null);
            setIsUploading(false);
            navigate("/account/my-order");
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
          const response = await getProfile({ username: userName, token });
          setUserData(response.detail);
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

  const handleCloseModal = () => {
    onClose();
    navigate("/account/my-order");
  };

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered size={"lg"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Payment Confirmation</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <div className="flex flex-col justify-center items-center">
              <p className="text-center mb-5 font-semibold text-lg">Please upload your payment proof</p>
              {paymentBy !== null && (
                <div className="flex flex-col justify-center items-center gap-2">
                  {paymentBy === "MANDIRI" && (
                    <div className="flex flex-col items-center">
                      <span className="font-bold"> Bank Mandiri 15900039222</span>
                      <span>PT. RAINS INDONESIA Tbk.</span>
                    </div>
                  )}
                  {paymentBy === "BCA" && (
                    <div className="flex flex-col items-center">
                      <span className="font-bold"> Bank Central Asia 122938888022</span>
                      <span>PT. RAINS INDONESIA Tbk.</span>
                    </div>
                  )}
                  {paymentBy === "BNI" && (
                    <div className="flex flex-col items-center">
                      <span className="font-bold"> Bank Negara Indonesia 128273777779</span>
                      <span>PT. RAINS INDONESIA Tbk.</span>
                    </div>
                  )}
                </div>
              )}
              <span className="font-bold"> {formatToRupiah(totalPrice)} </span>
              <div>
                <div {...getRootProps()} className=" mt-4 h-[35vh] w-[65vw] sm:w-[25vw] border-2 border-gray-400 rounded-md cursor-pointer hover:border-gray-600">
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
                <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-[#40403F] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
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
            <button type="submit" disabled={!selectedImageName} className={`bg-[#40403F] hover:bg-[#555554] text-white p-2 rounded-md font-semibold ${selectedImageName ? "cursor-pointer" : "cursor-not-allowed"} `}>
              Submit
            </button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
