import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import api from "../api";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { addAddress } from "../slices/addressSlices";
import addNewAddress from "../api/Address/addNewAddress";
import getProvince from "../api/Address/getProvince";
import getCity from "../api/Address/getCity";
import getProfile from "../api/profile/getProfile";

export const AddAddressModal = ({ isOpen, onClose, onSuccess }) => {
  const username = useSelector((state) => state?.account?.profile?.data?.profile?.username);
  const [userData, setUserData] = useState(null);
  const [provinceLists, setProvinceLists] = useState([]);
  const [cityLists, setCityLists] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCityByProvince, setSelectedCityByProvince] = useState([]);
  const userId = userData?.id;
  const dispatch = useDispatch();
  const provinceIdToName = provinceLists.filter((province) => province.province_id === selectedProvince)[0]?.province;

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      street: "",
      province: "",
      city: "",
      provinceId: "",
      cityId: "",
      district: "",
      subDistrict: "",
      phoneNumber: "",
      setAsdefault: false,
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
        const response = await addNewAddress({
          userId,
          ...values,
        })

        if (response.ok) {
          toast.success("Register address success");
          dispatch(addAddress(response.detail));
          formik.resetForm();
          onClose();
          onSuccess();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("Register address failed", {
            description: error.response.data.message,
          });
        } else if (error.response && error.response.status === 500) {
          toast.error("Server error", {
            description: error.response.data.message,
          });
          console.error(error);
        }
      }
    },
  });

  const fetchProvinceList = useCallback(async () => {
    const response = await getProvince();
    setProvinceLists(response.detail);
  }, []);

  const fetchCityList = useCallback(async () => {
    const response = await getCity();
    setCityLists(response.detail);
  }, []);

  const handleProvinceChange = (e) => {
    const selectedValue = e.target.value;
    formik.setFieldValue("province", selectedValue);
    
    setSelectedProvince(selectedValue);
    console.log(selectedProvince);
    const selectedProvinceDetails = provinceLists.filter((province) => province.province === selectedValue);
    formik.setFieldValue("provinceId", selectedProvinceDetails[0]?.province_id);

    setSelectedCityByProvince(cityLists.filter((city) => city.province === selectedValue));
  };

  const handleCityChange = (e) => {
    const selectedValue = e.target.value;
    formik.setFieldValue("city", selectedValue);

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

  const fetchUserData = useCallback(async () => {
    try {
      const response = await getProfile({ username });
      setUserData(response.detail);

    } catch (error) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          toast.error(error.response.data.message);
        }
      }
    }
  }, [username]);

  useEffect(() => {
    try {
      fetchUserData();
      fetchProvinceList();
      fetchCityList();
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 404 || error.response.status === 500)) {
        toast.error(error.response.data.message);
        if (error.response.status === 500) console.error(error);
      }
    }
  }, [fetchUserData, fetchProvinceList, fetchCityList]);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
        <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
        <ModalContent>
          <ModalHeader>
            <h1 className="font-bold text-2xl mt-5">Register a New Address</h1>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="h-[65vh] px-3 overflow-y-auto">
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
                      {selectedProvince ? (
                        <option value={selectedProvince}>{selectedProvince}</option>
                      ) : (
                        <option value="" disabled>
                          Select a Province
                        </option>
                      )}
                      {provinceLists.map((province, index) => (
                        <option key={index} value={province.province}>
                          {province.province}
                        </option>
                      ))}
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
                      <option value="" disabled>
                        Select a City
                      </option>
                      {selectedCityByProvince.length === 0
                        ? cityLists.map((city, index) => (
                            <option key={index} value={city.city_name}>
                              {city.city_name}
                            </option>
                          ))
                        : selectedCityByProvince?.map((city, index) => (
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
                        const sanitizedValue = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                        formik.setFieldValue("phoneNumber", sanitizedValue);
                      }}
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? <div className="text-red-500">{formik.errors.phoneNumber}</div> : null}
                  </div>
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
