import api from "../../api";

const updateStock = async ({ productId, warehouseId, quantity, type }) => {
  try {
    const response = await api.admin.post("/api/product/update-product-stock", {
      productId,
      warehouseId,
      quantity,
      type,
    });
    return response.data;
  } catch (error) {
    console.error("Error in updateStock:", error);
    throw error;
  }
};

export default updateStock;
