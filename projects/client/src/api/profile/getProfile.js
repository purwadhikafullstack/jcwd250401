import api from "../../api";

const getProfile = async ({ username } = {}) => {
  try {
    const response = await api.get(`/profile/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error in getProfile:", error);
    throw error;
  }
};

export default getProfile;