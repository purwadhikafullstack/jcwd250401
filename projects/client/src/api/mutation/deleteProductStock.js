import api from "../../api";

const deleteProductStock = async ({ productId, warehouseId }) => {
  try {
    const response = await api.admin.delete("/product/remove-product-stock", {
      data: {
        productId,
        warehouseId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in removeProductStock:", error);
    throw error;
  }
};

export default deleteProductStock;