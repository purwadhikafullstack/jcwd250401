import api from "../../api";

const getSummaryTotalStock = async ({ warehouseId = null, month, year } = {}) => {
  try {
    const url = `/api/mutation/total-stock${warehouseId ? `?warehouseId=${warehouseId}` : ""}${month ? `${warehouseId ? "&" : "?"}month=${month}` : ""}${year ? `${warehouseId || month ? "&" : "?"}year=${year}` : ""}`;

    const response = await api.admin.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in getSummaryTotalStock:", error);
    throw error;
  }
};

export default getSummaryTotalStock;
