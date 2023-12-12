import api from "../../api";

const getNearestWarehouses = async ({} = {}) => {
  try {
    let url = "/api/warehouse/user/nearest-warehouse";

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in getNearestWarehouses:", error);
    throw error;
  }
};

export default getNearestWarehouses;