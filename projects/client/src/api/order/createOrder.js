import api from "../../api";

const createOrder = async ({ shippingCost, productOnCart, warehouseId, addressId, paymentBy } = {}) => {
  try {
    const response = await api.post("/api/order", { shippingCost, productOnCart, warehouseId, addressId, paymentBy});
    return response.data.detail;
  } catch (error) {
    console.error("Error in CreateOrder:", error);
    throw error;
  }
};

export default createOrder;
