import api from "../../api";

const getWarehouses = async ({ mode, userId } = {}) => {
  try {
    let endpoint = "/api/warehouse";

    if (mode === "unassign") {
      endpoint += `?adminId=${userId}`;
    }

    const response = await api.admin.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error in getWarehouses:", error);
    throw error;
  }
};

export default getWarehouses