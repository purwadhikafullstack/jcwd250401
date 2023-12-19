import api from "../../api";

const cancelUnpaidOrder = async ({ orderId }) => {
  try {
    const response = await api.patch("/order/cancel-unpaid-order", {
      orderId,
    });

    return response.data;
  } catch (error) {
    console.error("Error in cancelUnpaidOrder:", error);
    throw error;
  }
};

export default cancelUnpaidOrder;
