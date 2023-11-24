import api from "../../api";

const adminLogin = async ({ email, password, remember }) => {
  try {
    const response = await api.post("/auth/admin", { email, password, remember });
    return response.data;
  } catch (error) {
    console.error("Error in adminLogin:", error);
    throw error;
  }
};

export default adminLogin;
