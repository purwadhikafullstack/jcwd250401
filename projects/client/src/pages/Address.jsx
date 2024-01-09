import { Link, useNavigate } from "react-router-dom";
import { NavPage } from "../components/NavPage";
import { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { AddAddressModal } from "../components/AddAddressModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { EditAddressModal } from "../components/EditAddressModal";
import { addAddress } from "../slices/addressSlices";
import { BsFillPinAngleFill, BsFillTrash3Fill } from "react-icons/bs";
import { SetDefaultAddressModal } from "../components/SetDefaultAddressModal";
import { showLoginModal } from "../slices/authModalSlices";
import getProfile from "../api/profile/getProfile";
import getUserAddress from "../api/Address/getUserAddress";
import addNewAddress from "../api/Address/addNewAddress";
import getProvince from "../api/Address/getProvince";
import getCity from "../api/Address/getCity";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const Address = () => {
  const isLogin = useSelector((state) => state?.account?.isLogin);
  const username = useSelector((state) => state?.account?.profile?.data?.profile?.username);
  const token = useSelector((state) => state?.account?.profile?.data?.token);
  const listsMenu = ["Profile", "Address Book", "My Order", "Change Password"];
  const [addressForm, setAddressForm] = useState(false);
  const [provinceLists, setProvinceLists] = useState([]);
  const [cityLists, setCityLists] = useState([]);
  const [userData, setUserData] = useState(null);
  const [userAddressLists, setUserAddressLists] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [defaultAddressModal, setDefaultAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCityByProvince, setSelectedCityByProvince] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const defaultAddress = userAddressLists.find((address) => address.setAsDefault);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = userData?.id;
  const addressLists = useSelector((state) => state?.address?.addressLists);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      street: "",
      province: "",
      provinceId: "",
      city: "",
      cityId: "",
      district: "",
      subDistrict: "",
      phoneNumber: "",
      setAsDefault: false,
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
        setIsSubmitting(true);
        const response = await addNewAddress({
          userId,
          street: values.street,
          firstName: values.firstName,
          lastName: values.lastName,
          province: values.province,
          provinceId: values.provinceId,
          city: values.city,
          cityId: values.cityId,
          district: values.district,
          subDistrict: values.subDistrict,
          phoneNumber: values.phoneNumber,
          setAsDefault: values.setAsDefault,
        });
        if (response.ok) {
          toast.success("Register address success");
          dispatch(addAddress(response.detail));
          formik.resetForm();
          setSelectedProvince("");
        }
      } catch (error) {
        if (error.response && (error.response.status === 400 || error.response.status === 401 || error.response.status === 403 || error.response.status === 500)) {
          toast.error(error.response.data.message);
          if (error.response.status === 500) console.error(error);
          if (error.response.status === 401 || error.response.status === 403) {
            setTimeout(() => {
              navigate("/");
              dispatch(showLoginModal());
            }, 2000);
          }
        }
      } finally {
        setTimeout(() => {
          setIsSubmitting(false);
        }, 2000);
      }
    },
  });

  const handleRegisterAddressBtn = () => setAddressForm(!addressForm);
  const handleAddAddress = () => setOpenModal(!openModal);
  const handleConfirmModal = (address) => {
    setSelectedAddress(address);
    setConfirmModal(true);
  };
  const handleEditModal = (address) => {
    setSelectedAddress(address);
    setEditModal(true);
  };
  const handleCloseEditModal = () => {
    setSelectedAddress(null);
    setEditModal(false);
  };

  const handleDefaultAddressModal = (address) => {
    setSelectedAddress(address);
    setDefaultAddressModal(!defaultAddressModal);
  };

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
      const response = await getProfile({ username, token });
      setUserData(response.detail);

      const responseLists = await getUserAddress({ userId: response.detail.id });
      setUserAddressLists(responseLists.detail);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          toast.error(error.response.data.message);
          setTimeout(() => {
            navigate("/");
            dispatch(showLoginModal());
          }, 2000);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  const fetchProvinceList = useCallback(async () => {
    const response = await getProvince();
    setProvinceLists(response.detail);
  }, []);

  const fetchCityList = useCallback(async () => {
    const response = await getCity();
    setCityLists(response.detail);
  }, []);

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
  }, [addressLists, fetchUserData, fetchProvinceList, fetchCityList]);

  return (
    <>
      <NavPage pageName={"Address Book"} />
      <div className="flex lg:px-36 lg:justify-normal justify-center">
        <div className="h-[70vh] w-[90vw] lg:w-[76vw] flex flex-row overflow-y-hidden">
          <div className="hidden lg:flex flex-col w-[20vw]">
            {listsMenu.map((list, index) => {
              const joinedList = list.toLowerCase().replace(/\s/g, "-");
              const isAddress = list === "Address Book"; // Check if the current item is "Profile"
              return (
                <Link key={index} to={`/account/${joinedList}`} className={`block py-2 text-sm font-sagoe text-gray-700 hover:underline ${isAddress ? "font-black" : ""}`}>
                  {list}
                </Link>
              );
            })}
          </div>

          {isLogin ? (
            <>
              {isLoading ? (
                <div className="w-[90vw] h-[70vh] lg:w-[53vw] lg:h-[70vh] rounded-lg shadow-md flex flex-col px-5 border overflow-y-auto">
                  <Skeleton height={80} className="mt-5" count={5} />
                </div>
              ) : userAddressLists.length > 0 ? (
                <div className="w-[90vw] h-[70vh] lg:w-[53vw] lg:h-[70vh] rounded-lg shadow-md flex flex-col px-5 border overflow-y-auto">
                  <h1 className="font-bold text-2xl mt-5">Address Book</h1>
                  <p className="text-sm text-gray-600 mt-2">
                    Disclaimer: We are able to serve home delivery service and Cash On Delivery (COD) except in very limited areas. Any order placed on out of service area will be cancelled automatically.
                  </p>

                  <div className="border border-gray-300 rounded-lg p-5 mt-5">
                    <h1 className="font-bold text-2xl">Register a New Address</h1>
                    <button className="w-[55vw] sm:w-[45vw] lg:w-[15vw] px-2 h-[7vh] mt-2 border bg-[#40403F] hover:bg-[#555554] text-white rounded-md font-semibold" onClick={handleAddAddress}>
                      Register New Address
                    </button>
                  </div>

                  {defaultAddress && (
                    <div className="border border-gray-300 rounded-lg p-5 mt-5">
                      <div className="flex flex-col justify-between">
                        <div className="flex flex-row">
                          <div className="w-[30%]">
                            <p className="text-md text-gray-600">{`${defaultAddress.firstName.charAt(0).toUpperCase()}${defaultAddress.firstName.slice(1)} ${defaultAddress.lastName.charAt(0).toUpperCase()}${defaultAddress.lastName.slice(
                              1
                            )}`}</p>
                          </div>

                          <div className="w-[70%] flex">
                            <p className="text-md text-gray-600">{`${defaultAddress.street.charAt(0).toUpperCase()}${defaultAddress.street.slice(1)}, ${defaultAddress.district}, ${defaultAddress.subDistrict}, ${defaultAddress.city}, ${
                              defaultAddress.province
                            }, ${defaultAddress.phoneNumber}`}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2">
                            <button className="w-[25vw]  md:w-[15vw] lg:w-[12vw] h-[5vh] border border-gray-300 hover:bg-gray-100 rounded-md font-semibold" onClick={() => handleEditModal(defaultAddress)}>
                              Edit Address
                            </button>
                            <button className="w-[25vw]  md:w-[15vw] lg:w-[12vw] h-[5vh] border border-gray-300 hover:bg-gray-100 rounded-md font-semibold" onClick={() => handleConfirmModal(defaultAddress)}>
                              Delete
                            </button>
                          </div>
                          <BsFillPinAngleFill className="text-2xl text-gray-500" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col mt-5">
                    {userAddressLists
                      .filter((address) => !address.setAsDefault)
                      .map((address, index) => (
                        <div key={index}>
                          <div className="flex flex-col rounded-lg p-5 mb-5 shadow-md">
                            <div className="flex flex-col lg:flex-row justify-between">
                              <div className="flex flex-row mr-2">
                                <div className="w-[30%]">
                                  <p className="text-md text-gray-600">{`${address.firstName.charAt(0).toUpperCase()}${address.firstName.slice(1)} ${address.lastName.charAt(0).toUpperCase()}${address.lastName.slice(1)}`}</p>
                                </div>

                                <div className="w-[70%] flex">
                                  <p className="text-md text-gray-600">{`${address.street.charAt(0).toUpperCase()}${address.street.slice(1)}, ${address.district}, ${address.subDistrict}, ${address.city}, ${address.province}, ${
                                    address.phoneNumber
                                  }`}</p>
                                </div>
                              </div>
                              <div className="flex lg:flex-col items-center justify-between w-[100%] gap-2 mt-2">
                                <div className="flex lg:flex-col gap-2">
                                  <button className="w-[25vw] md:w-[15vw] lg:w-[12vw] h-[5vh] border border-gray-300 hover:bg-gray-100 rounded-md font-semibold" onClick={() => handleEditModal(address)}>
                                    Edit Address
                                  </button>
                                  <button className="w-[25vw] md:w-[15vw] lg:w-[12vw] h-[5vh] border border-gray-300 hover:bg-gray-100 rounded-md font-semibold" onClick={() => handleDefaultAddressModal(address)}>
                                    Set As Default
                                  </button>
                                </div>
                                <BsFillTrash3Fill className="text-xl text-gray-500 lg:self-end lg:mt-2 cursor-pointer" onClick={() => handleConfirmModal(address)} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    <ConfirmModal isOpen={confirmModal} onClose={() => setConfirmModal(!confirmModal)} data={selectedAddress} userId={userId} deleteFor={"address"} />
                    {selectedAddress && <EditAddressModal isOpen={editModal} onClose={handleCloseEditModal} addressData={selectedAddress} userId={userId} cityLists={cityLists} provinceLists={provinceLists} />}
                    {selectedAddress && <SetDefaultAddressModal isOpen={defaultAddressModal} onClose={() => setDefaultAddressModal(false)} addressData={selectedAddress} userId={userId} />}
                  </div>
                </div>
              ) : (
                <>
                  {addressForm ? (
                    <div className="w-[90vw] h-[70vh] lg:w-[53vw] lg:h-[70vh] rounded-lg shadow-md flex flex-col px-5 border overflow-y-auto">
                      <h1 className="font-bold text-2xl mt-5">Register a New Address</h1>
                      <p className="text-sm text-gray-600 mt-2">
                        Disclaimer: We are able to serve home delivery service and Cash On Delivery (COD) except in very limited areas. Any order placed on out of service area will be cancelled automatically.
                      </p>
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
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              placeholder="Enter your last name"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500"
                              {...formik.getFieldProps("lastName")}
                            />
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
                            <select
                              name="province"
                              id="province"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500 cursor-pointer"
                              {...formik.getFieldProps("province")}
                              onChange={handleProvinceChange}>
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
                            <select name="city" id="city" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500 cursor-pointer" {...formik.getFieldProps("city")} onChange={handleCityChange} disabled={!selectedProvince}>
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
                            <input
                              type="text"
                              id="district"
                              name="district"
                              placeholder="Enter your district"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500"
                              {...formik.getFieldProps("district")}
                            />
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
                          <button type="submit" disabled={isSubmitting} className="w-[25%] sm:w-[35%] h-[7vh] border bg-[#40403F] hover:bg-[#555554] text-white rounded-md font-semibold mb-3">
                            Register
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="w-[80vw] lg:w-[53vw] h-[30vh] rounded-lg shadow-md flex flex-col justify-evenly p-5 border">
                      <h1 className="font-bold text-2xl">Address Book</h1>
                      <p className="text-sm text-gray-500">Currently there is not address yet to destine. Register new address please.</p>
                      <button className="w-[55vw] sm:w-[45vw] lg:w-[15vw] px-2 h-[7vh] mt-2 border bg-[#40403F] hover:bg-[#555554] text-white rounded-md font-semibold" onClick={handleRegisterAddressBtn}>
                        Register New Address
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <p className="text-lg text-gray-500">You are not logged in.</p>
            </div>
          )}
        </div>
      </div>
      <AddAddressModal isOpen={openModal} onClose={handleAddAddress} />
    </>
  );
};
