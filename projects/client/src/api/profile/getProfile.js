import api from "../../api";

const getProfile = async ({ username, token } = {}) => {
  try {
    const response = await api.get(`/api/profile/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in getProfile:", error);
    throw error;
  }
};

export default getProfile;