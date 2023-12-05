import api from "../../api";

const requestStockMutation = async ({ adminId, warehouseId, destinationWarehouseId, productId, mutationQuantity, date }) => {
  try {
    const response = await api.admin.post("/api/mutation/stock/manual-mutation", {
      adminId,
      warehouseId,
      destinationWarehouseId,
      productId,
      mutationQuantity,
      date
    });
    return response.data;
  } catch (error) {
    console.error("Error in requestMutation:", error);
    throw error;
  }
};

export default requestStockMutation;
