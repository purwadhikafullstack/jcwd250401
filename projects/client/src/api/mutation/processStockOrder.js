import api from "../../api";

const processStockOrder = async ({ mutationId, action }) => {
  try {
    const response = await api.admin.post("/api/mutation/stock/process-mutation", {
      mutationId,
      action,
    });

    return response.data;
  } catch (error) {
    console.error("Error in processStockOrder:", error);
    throw error;
  }
};

export default processStockOrder;
