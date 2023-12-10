import api from "../../api";

const deleteAddress = async ({ userId, addressId } = {}) => {
  try {
    const response = await api.delete(`/api/address/${userId}/${addressId}`);
    return response.data;
  } catch (error) {
    console.error("Error in deleteAddress:", error);
    throw error;
  }
};

export default deleteAddress;