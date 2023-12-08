import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { toast } from "sonner";
import api from "../api";
import { useFormik } from "formik";
import * as yup from "yup";
import { updateAddress } from "../slices/addressSlices";
import { useDispatch } from "react-redux";
import { AiFillCheckCircle } from "react-icons/ai";
import { useState } from "react";
import editAddress from "../api/Address/editAddress";

export const EditAddressModal = ({ isOpen, onClose, addressData, userId, cityLists, provinceLists }) => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState(addressData?.city);
  const [selectedCityByProvince, setSelectedCityByProvince] = useState([]);
  const provinceIdToName = provinceLists.filter((province) => province.province_id === selectedProvince)[0]?.province;

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      firstName: addressData?.firstName,
      lastName: addressData?.lastName,
      street: addressData?.street,
      province: addressData?.province,
      provinceId: addressData?.provinceId,
      city: addressData?.city,
      cityId: addressData?.cityId,
      district: addressData?.district,
      subDistrict: addressData?.subDistrict,
      phoneNumber: addressData?.phoneNumber,
      setAsDefault: addressData?.setAsDefault,
    },
    validationSchema: yup.object({
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      street: yup.string().required("Street address is required"),
      province: yup.string().required("Province is required"),
      city: yup.string().required("City is required"),
      district: yup.string().required("District is required"),
      subDistrict: yup.string().required("Sub District is required"),
      phoneNumber: yup.string().min(8, "Phone number must be at least 8 characters").required("Phone number is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await editAddress({
          userId,
          addressId: addressData.id,
          firstName: values.firstName,
          lastName: values.lastName,
          street: values.street,
          province: values.province,
          provinceId: values.provinceId,
          city: values.city,
          cityId: values.cityId,
          district: values.district,
          subDistrict: values.subDistrict,
          phoneNumber: values.phoneNumber,
          setAsDefault: values.setAsDefault,
        })

        if (response.ok) {
          toast.success("Update address success");
          dispatch(updateAddress(response.detail));
          formik.resetForm();
          onClose();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("Register address failed");
        } else if (error.response && error.response.status === 500) {
          toast.error("Server error", {
            description: error.response.data.detail,
          });
          console.error(error);
        }
      }
    },
  });

  const handleProvinceChange = (e) => {
    const selectedValue = e.target.value;
    formik.setFieldValue("province", selectedValue);

    setSelectedProvince(selectedValue);
    const selectedProvinceDetails = provinceLists.filter((province) => province.province === selectedValue);
    formik.setFieldValue("provinceId", selectedProvinceDetails[0]?.province_id);

    setSelectedCityByProvince(cityLists.filter((city) => city.province === selectedValue));
  };

  const handleCityChange = (e) => {
    const selectedValue = e.target.value;
    formik.setFieldValue("city", selectedValue);
    setSelectedCity(selectedValue);

    const selectedCityDetails = cityLists.find((city) => city.city_name === selectedValue);
    formik.setFieldValue("cityId", selectedCityDetails?.city_id);

    if (selectedCityDetails) {
      const correspondingProvince = provinceLists.find((province) => province.province_id === selectedCityDetails.province_id);
      if (correspondingProvince) {
        setSelectedProvince(correspondingProvince.province);
        formik.setFieldValue("province", correspondingProvince.province);
      }
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} size={"lg"} isCentered>
        <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
        <ModalContent>
          <ModalHeader>Edit Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="h-[70vh] px-3 overflow-y-auto">
              <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-row items-center mt-5 w-full">
                  <label htmlFor="firstName" className="text-md text-gray-600 w-[35%] font-semibold cursor-pointer">
                    First Name <span className="text-red-500">*</span>
                  </label>

                  <div className="w-[55%] sm:w-[65%]">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="Enter your first name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500"
                      {...formik.getFieldProps("firstName")}
                    />
                    {formik.touched.firstName && formik.errors.firstName ? <div className="text-red-500">{formik.errors.firstName}</div> : null}
                  </div>
                </div>

                <div className="flex flex-row items-center mt-5">
                  <label htmlFor="lastName" className="text-md text-gray-600 w-[35%] font-semibold cursor-pointer">
                    Last Name <span className="text-red-500">*</span>
                  </label>

                  <div className="w-[55%] sm:w-[65%]">
                    <input type="text" id="lastName" name="lastName" placeholder="Enter your last name" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500" {...formik.getFieldProps("lastName")} />
                    {formik.touched.lastName && formik.errors.lastName ? <div className="text-red-500">{formik.errors.lastName}</div> : null}
                  </div>
                </div>

                <div className="flex flex-row items-center mt-5">
                  <label htmlFor="street" className="text-md text-gray-600 w-[35%] font-semibold cursor-pointer">
                    Street / Address Detail <span className="text-red-500">*</span>
                  </label>

                  <div className="w-[55%] sm:w-[65%]">
                    <input
                      type="text"
                      id="street"
                      name="street"
                      placeholder="Enter your street or address detail"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500"
                      {...formik.getFieldProps("street")}
                    />
                    {formik.touched.street && formik.errors.street ? <div className="text-red-500">{formik.errors.street}</div> : null}
                  </div>
                </div>

                <div className="flex flex-row items-center mt-5">
                  <label htmlFor="province" className="text-md text-gray-600 w-[35%] font-semibold">
                    Province <span className="text-red-500">*</span>
                  </label>

                  <div className="w-[55%] sm:w-[65%]">
                    <select name="province" id="province" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500 cursor-pointer" {...formik.getFieldProps("province")} onChange={handleProvinceChange}>
                      {selectedProvince ? <option value={selectedProvince}>{selectedProvince}</option> : <option value={formik.values.province}>{formik.values.province}</option>}
                      {provinceLists.map((province, index) => {
                        if (province.province_id !== formik.values.provinceId) {
                          return (
                            <option key={index} value={province.province}>
                              {province.province}
                            </option>
                          );
                        }
                        return null;
                      })}
                    </select>
                    {formik.touched.province && formik.errors.province ? <div className="text-red-500">{formik.errors.province}</div> : null}
                  </div>
                </div>

                <div className="flex flex-row items-center mt-5">
                  <label htmlFor="city" className="text-md text-gray-600 w-[35%] font-semibold">
                    City <span className="text-red-500">*</span>
                  </label>

                  <div className="w-[55%] sm:w-[65%]">
                    <select name="city" id="city" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500 cursor-pointer" {...formik.getFieldProps("city")} onChange={handleCityChange}>
                      {selectedCity ? <option value={selectedCity}>{selectedCity}</option> : <option value={formik.values.city}>{formik.values.city}</option>}
                      {selectedCityByProvince.length === 0
                        ? cityLists.map((city, index) => {
                            if (city.city_name !== formik.values.city) {
                              return (
                                <option key={index} value={city.city_name}>
                                  {city.city_name}
                                </option>
                              );
                            }
                            return null;
                          })
                        : selectedCityByProvince.map((city, index) => (
                            <option key={index} value={city.city_name}>
                              {city.city_name}
                            </option>
                          ))}
                    </select>
                    {formik.touched.city && formik.errors.city ? <div className="text-red-500">{formik.errors.city}</div> : null}
                  </div>
                </div>

                <div className="flex flex-row items-center mt-5">
                  <label htmlFor="district" className="text-md text-gray-600 w-[35%] font-semibold cursor-pointer">
                    District <span className="text-red-500">*</span>
                  </label>

                  <div className="w-[55%] sm:w-[65%]">
                    <input type="text" id="district" name="district" placeholder="Enter your district" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500" {...formik.getFieldProps("district")} />
                    {formik.touched.district && formik.errors.district ? <div className="text-red-500">{formik.errors.district}</div> : null}
                  </div>
                </div>

                <div className="flex flex-row items-center mt-5">
                  <label htmlFor="subDistrict" className="text-md text-gray-600 w-[35%] font-semibold cursor-pointer">
                    Sub District <span className="text-red-500">*</span>
                  </label>

                  <div className="w-[55%] sm:w-[65%]">
                    <input
                      type="text"
                      id="subDistrict"
                      name="subDistrict"
                      placeholder="Enter your Sub District"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500"
                      {...formik.getFieldProps("subDistrict")}
                    />
                    {formik.touched.subDistrict && formik.errors.subDistrict ? <div className="text-red-500">{formik.errors.subDistrict}</div> : null}
                  </div>
                </div>

                <div className="flex flex-row items-center mt-5">
                  <label htmlFor="phoneNumber" className="text-md text-gray-600 w-[35%] font-semibold cursor-pointer">
                    Phone Number <span className="text-red-500">*</span>
                  </label>

                  <div className="w-[55%] sm:w-[65%]">
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500"
                      {...formik.getFieldProps("phoneNumber")}
                      onChange={(e) => {
                        const sanitizedValue = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                        formik.setFieldValue("phoneNumber", sanitizedValue);
                      }}
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? <div className="text-red-500">{formik.errors.phoneNumber}</div> : null}
                  </div>
                </div>

                <div className="flex flex-row items-center mt-5">
                  <label htmlFor="setAsDefault" className="text-md text-gray-600 w-[35%] font-semibold cursor-pointer">
                    Set as default address
                  </label>
                  {formik.values.setAsDefault ? <AiFillCheckCircle className="text-green-500 text-2xl" /> : <input type="checkbox" id="setAsDefault" name="setAsDefault" className="w-6 h-6" {...formik.getFieldProps("setAsDefault")} />}
                </div>

                <div className="flex flex-row items-center mt-5">
                  <button type="submit" className="w-[25%] sm:w-[35%] h-[7vh] border bg-[#40403F] hover:bg-[#555554] text-white rounded-md font-semibold mb-3">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
