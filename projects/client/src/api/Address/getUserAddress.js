import api from "../../api";

const getUserAddress = async ({ userId } = {}) => {
  try {
    const response = await api.get(`/address/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error in getUserAddress:", error);
    throw error;
  }
};

export default getUserAddress;
