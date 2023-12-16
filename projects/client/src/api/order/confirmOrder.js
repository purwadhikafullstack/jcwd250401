import api from "../../api";

const confirmOrder = async ({ orderId, productId }) => {
  try {
    const response = await api.admin.patch("/order/confirm-payment", {
      orderId,
      productId,
    });

    return response.data;
  } catch (error) {
    console.error("Error in confirmOrder:", error);
    throw error;
  }
};

export default confirmOrder;
