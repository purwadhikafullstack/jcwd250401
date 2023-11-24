import api from "../../api";

const deleteAdmin = async ({ userId } = {}) => {
  try {
    const response = await api.admin.delete(`/users/admin/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error in deleteAdmin:", error);
    throw error;
  }
};

export default deleteAdmin;