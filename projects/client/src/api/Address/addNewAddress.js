import api from "../../api";

const addNewAddress = async ({ userId, street, firstName, lastName, province, provinceId, city, cityId, district, subDistrict, phoneNumber, setAsDefault }) => {
  try {
    const response = await api.post(`/api/address/${userId}`, {
      firstName,
      lastName,
      province,
      provinceId,
      street,
      city,
      cityId,
      district,
      subDistrict,
      phoneNumber,
      setAsDefault,
    });
    return response.data;
  } catch (error) {
    console.error("Error in addAddress:", error);
    throw error;
  }
};

export default addNewAddress;
