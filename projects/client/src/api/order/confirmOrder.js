import api from "../../api";

const confirmOrder = async ({ orderId, products }) => {
  try {
    const response = await api.admin.patch("/api/order/confirm-payment", {
      orderId,
      products,
    });

    return response.data;
  } catch (error) {
    console.error("Error in confirmOrder:", error);
    throw error;
  }
};

export default confirmOrder;
