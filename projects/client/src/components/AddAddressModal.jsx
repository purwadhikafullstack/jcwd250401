import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import api from "../api";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { addAddress } from "../slices/addressSlices";

export const AddAddressModal = ({ isOpen, onClose }) => {
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
      district: "",
      subDistrict: "",
      phoneNumber: 0,
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
      phoneNumber: yup.number().min(8, "Phone number must be at least 8 characters").required("Phone number is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await api.post(`/address/${userId}`, {
          firstName: values.firstName,
          lastName: values.lastName,
          street: values.street,
          province: provinceIdToName,
          city: values.city,
          district: values.district,
          subDistrict: values.subDistrict,
          phoneNumber: 0 + values.phoneNumber.toString(),
          setAsdefault: values.setAsdefault,
        });

        if (response.data.ok) {
          toast.success("Register address success");
          dispatch(addAddress(response.data.detail));
          formik.resetForm();
          onClose();
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

  const getProvinceLists = async () => {
    try {
      const response = await api.get("/address/province");
      setProvinceLists(response.data.detail);
    } catch (error) {
      toast.error("Get address lists failed");
    }
  };

  const getCityLists = async () => {
    try {
      const response = await api.get(`/address/city`);
      setCityLists(response.data.detail);
    } catch (error) {
      toast.error("Get city lists failed");
    }
  };

  const handleProvinceChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedProvince(selectedValue);
    formik.setFieldValue("province", selectedValue);

    setSelectedCityByProvince(cityLists.filter((city) => city.province_id === selectedValue));
  };

  const handleCityChange = (e) => {
    const selectedValue = e.target.value;
    formik.setFieldValue("city", selectedValue);

    const selectedCityDetails = cityLists.find((city) => city.city_name === selectedValue);

    if (selectedCityDetails) {
      const correspondingProvince = provinceLists.find((province) => province.province_id === selectedCityDetails.province_id);
      if (correspondingProvince) {
        setSelectedProvince(correspondingProvince.province_id);
        formik.setFieldValue("province", correspondingProvince.province_id);
      }
    }
  };

  const getUsersProfile = async () => {
    try {
      const response = await api.get(`/profile/${username}`);
      setUserData(response.data.detail);
    } catch (error) {
      toast.error("Failed to get user data");
    }
  };

  useEffect(() => {
    getUsersProfile();
    getProvinceLists();
    getCityLists();
  }, []);
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
                        <option value={selectedProvince}>{provinceIdToName}</option>
                      ) : (
                        <option value="" disabled>
                          Select a Province
                        </option>
                      )}
                      {provinceLists.map((province, index) => (
                        <option key={index} value={province.province_id}>
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
                      type="number"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500"
                      {...formik.getFieldProps("phoneNumber")}
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? <div className="text-red-500">{formik.errors.phoneNumber}</div> : null}
                  </div>
                </div>

                <div className="flex flex-row items-center mt-5">
                  <button type="submit" className="w-[25%] sm:w-[35%] h-[7vh] border bg-[#40403F] hover:bg-[#555554] text-white rounded-md font-semibold mb-3">
                    Register
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
