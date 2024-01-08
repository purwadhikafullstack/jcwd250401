import api from "../../api";

const updatePassword = async ({ password, newPassword, username } = {}) => {
  try {
    const response = await api.patch(`/api/profile/password/${username}`, { password, newPassword });
    return response.data;
  } catch (error) {
    console.error("Error in updatePassword:", error);
    throw error;
  }
};

export default updatePassword;
