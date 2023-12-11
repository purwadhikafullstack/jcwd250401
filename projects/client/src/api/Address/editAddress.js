import api from "../../api";

const editAddress = async ({ userId, addressId, firstName, lastName, street, province, provinceId, city, cityId, district, subDistrict, phoneNumber, setAsDefault } = {}) => {
  try {
    const response = await api.patch(`/api/address/${userId}/${addressId}`, {
      firstName,
      lastName,
      street,
      province,
      provinceId,
      city,
      cityId,
      district,
      subDistrict,
      phoneNumber,
      setAsDefault,
    } );
    return response.data;
  } catch (error) {
    console.error("Error in updateAddress:", error);
    throw error;
  }
};

export default editAddress;