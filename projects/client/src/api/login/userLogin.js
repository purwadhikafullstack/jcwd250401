import api from "../../api";

const userLogin = async ({ email, password, remember }) => {
  try {
    const response = await api.post("/api/auth", { email, password, remember });
    return response.data;
  } catch (error) {
    console.error("Error in userLogin:", error);
    throw error;
  }
};

export default userLogin;
