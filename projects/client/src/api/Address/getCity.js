import api from "../../api";

const getCity = async () => {
  try {
    const response = await api.get("/address/city");
    return response.data;
  } catch (error) {
    console.error("Error in getCity:", error);
    throw error;
  }
};

export default getCity;
