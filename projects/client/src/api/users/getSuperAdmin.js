import api from "../../api";

const getSuperAdmin = async ({ username, email }) => {
  try {
    const response = await api.admin.get(`/api/users/super-admin/${username}/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error in getSuperAdmin:", error);
    throw error;
  }
};

export default getSuperAdmin;
