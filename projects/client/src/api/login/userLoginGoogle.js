import api from "../../api";

const userLoginGoogle = async ({ email, remember }) => {
  try {
    const response = await api.post("/api/auth/google", { email, remember });
    return response.data;
  } catch (error) {
    console.error("Error in userLoginGoogle:", error);
    throw error;
  }
};

export default userLoginGoogle;
