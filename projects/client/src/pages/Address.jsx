import { Link } from "react-router-dom";
import { NavPage } from "../components/NavPage";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";

export const Address = () => {
  const isLogin = useSelector((state) => state?.account?.isLogin);
  const listsMenu = ["Profile", "Address Book", "My Order", "Change my password"];
  const [addressForm, setAddressForm] = useState(false);
  const handleRegisterAddressBtn = () => setAddressForm(!addressForm);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      streetAddressDetail: "",
      province: "",
      city: "",
      DistrictOrSubDistrict: "",
      phoneNumber: 0,
    },
    validationSchema: yup.object({
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      streetAddressDetail: yup.string().required("Street address is required"),
      province: yup.string().required("Province is required"),
      city: yup.string().required("City is required"),
      DistrictOrSubDistrict: yup.string().required("District or Sub-District is required"),
      phoneNumber: yup.number().min(8, "Phone number must be at least 8 characters").required("Phone number is required"),
    }),
    onSubmit: (values) => {
      // Handle your form submission here
      console.log("Form submitted with values:", values);
      // You can add your login logic here
      // handleRegisterAddressBtn()
    },
  });
  return (
    <>
      <NavPage pageName={"Address Book"} />
      <div className="flex justify-center">
        <div className="h-[70vh] w-[90vw] lg:w-[76vw] flex flex-row overflow-y-hidden">
          <div className="hidden lg:flex flex-col w-[20vw]">
            {listsMenu.map((list, index) => {
              const joinedList = list.toLowerCase().replace(/\s/g, "-");
              return (
                <Link key={index} to={`/account/${joinedList}`} className="block py-2 text-sm text-gray-700 hover:underline">
                  {list}
                </Link>
              );
            })}
          </div>

          {isLogin ? (
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
                          {...formik.getFieldProps("streetAddressDetail")}
                        />
                        {formik.touched.streetAddressDetail && formik.errors.streetAddressDetail ? <div className="text-red-500">{formik.errors.streetAddressDetail}</div> : null}
                      </div>
                    </div>

                    <div className="flex flex-row items-center mt-5">
                      <label htmlFor="province" className="text-md text-gray-600 w-[35%] font-semibold">
                        Province <span className="text-red-500">*</span>
                      </label>

                      <div className="w-[55%] sm:w-[65%]">
                        <select name="province" id="province" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500 cursor-pointer" {...formik.getFieldProps("province")}>
                          <option value="jawaBarat">Jawa Barat</option>
                          <option value="jawaTengah">Jawa Tengah</option>
                        </select>
                        {formik.touched.province && formik.errors.province ? <div className="text-red-500">{formik.errors.province}</div> : null}
                      </div>
                    </div>

                    <div className="flex flex-row items-center mt-5">
                      <label htmlFor="city" className="text-md text-gray-600 w-[35%] font-semibold">
                        City <span className="text-red-500">*</span>
                      </label>

                      <div className="w-[55%] sm:w-[65%]">
                        <select name="city" id="city" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500 cursor-pointer" {...formik.getFieldProps("city")}>
                          <option value="jakarta">DKI Jakarta</option>
                          <option value="bandung">Bandung</option>
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
                          placeholder="Enter your district or sub-district"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500"
                          {...formik.getFieldProps("DistrictOrSubDistrict")}
                        />
                        {formik.touched.DistrictOrSubDistrict && formik.errors.DistrictOrSubDistrict ? <div className="text-red-500">{formik.errors.DistrictOrSubDistrict}</div> : null}
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
                      <label htmlFor="defaultAddress" className="text-md text-gray-600 w-[35%] font-semibold cursor-pointer">
                        Set as default address
                      </label>
                      <input type="checkbox" name="defaultAddress" className="w-[5%] h-[5vh] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-gray-500" />
                    </div>

                    <div className="flex flex-row items-center mt-5">
                      <button type="submit" className="w-[25%] sm:w-[35%] h-[7vh] border bg-[#40403F] hover:bg-[#555554] text-white rounded-md font-semibold mb-3">
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
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <p className="text-lg text-gray-500">You are not logged in</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
