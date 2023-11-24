import api from "../../api";

const getProvince = async () => {
  try {
    const response = await api.get("/address/province");
    return response.data;
  } catch (error) {
    console.error("Error in getProvince:", error);
    throw error;
  }
};

export default getProvince;
