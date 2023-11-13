import { useFormik } from "formik";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BsImage } from "react-icons/bs";

export const PaymentProof = () => {
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // create a simple object url from the image
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
      formik.setFieldValue("paymentImage", acceptedFiles[0]);
      setSelectedImageName(acceptedFiles[0].name);
      setTimeout(() => {
        setPreview(createObjectURL(acceptedFiles[0]));
      }, 1000);
    },
  });

  const formik = useFormik({
    initialValues: {
      paymentImage: null,
    },
    onSubmit: (values) => {
      setIsUploading(true); // set isUploading to true to show a spinner
      console.log(values);

      // Simulate a 2 second delay
      setTimeout(() => {
        setIsUploading(false); // set isUploading to false to hide the spinner
      }, 2000);
    },
  });
  return (
    <div className="h-[88vh] w-full flex justify-center items-center">
      <form onSubmit={formik.handleSubmit}>

        <div className="flex flex-col justify-evenly h-[75vh] w-[80vw]">

          <div>
            <h1 className="text-3xl font-bold text-center">Payment Confirmation</h1>
            <p className="text-center">Please upload your payment proof here</p>
          </div>

          <div className="flex justify-center items-center mt-2">
            <div>
              <div {...getRootProps()} className="h-[40vh] w-[65vw] lg:w-[45vw] border-2 border-gray-400 rounded-md cursor-pointer hover:border-gray-600">
                <input {...getInputProps()} name="paymentImage" />
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
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            {isUploading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              selectedImageName && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 bg-[#40403F] w-[65vw] lg:w-[45vw] h-[5vh] overflow-x-auto text-white rounded-md mt-5 font-semibold">
                    <BsImage className="ml-2 text-2xl" />
                    <p className="w-[60vw] lg:w-[45vw]">{selectedImageName}</p>
                  </div>
                  <button type="submit" className="bg-[#40403F] hover:bg-[#555554] text-white p-2 rounded-md w-[40%] lg:w-[20%] mt-2 self-end font-semibold">Submit</button>
                </div>
              )
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
