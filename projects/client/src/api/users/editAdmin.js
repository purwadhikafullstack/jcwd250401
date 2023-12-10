import api from "../../api";

const editAdmin = async ({ id, username, email, password, isWarehouseAdmin }) => {
  try {
    const response = await api.admin.patch(`/api/users/admin/${id}`, {
      username,
      email,
      password,
      isWarehouseAdmin,
    });
    return response.data;
  } catch (error) {
    console.error("Error in editAdmin:", error);
    throw error;
  }
};

export default editAdmin;