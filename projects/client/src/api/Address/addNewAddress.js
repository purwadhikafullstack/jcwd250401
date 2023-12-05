import api from "../../api";

const addNewAddress = async ({ userId, street, firstName, lastName, province, city, district, subDistrict, phoneNumber, setAsDefault }) => {
  try {
    const response = await api.post(`/address/${userId}`, {
      firstName,
      lastName,
      province,
      street,
      city,
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
