import api from "../../api";

const getAdminProfile = async ({ username }) => {
  try {
    const response = await api.get(`/api/profile/admin/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error in getAdminProfile:", error);
    throw error;
  }
};

export default getAdminProfile;
