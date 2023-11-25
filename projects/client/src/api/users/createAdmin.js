import api from "../../api";

const createAdmin = async ({ username, email, password, isWarehouseAdmin }) => {
  try {
    const response = await api.admin.post("/users/admin", {
      username,
      email,
      password,
      isWarehouseAdmin,
    });
    return response.data;
  } catch (error) {
    console.error("Error in createAdmin:", error);
    throw error;
  }
};

export default createAdmin;
