import api from "../../api";

const updateUserProfile = async ({ username, data } = {}) => {
  try {
    const response = await api.patch(`/api/profile/${username}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
};

export default updateUserProfile;