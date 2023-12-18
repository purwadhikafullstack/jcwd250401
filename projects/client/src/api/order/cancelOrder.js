import api from "../../api";

const cancelOrder = async ({ orderId, productId }) => {
    try {
        const response = await api.patch("/order/cancel-order", {
        orderId,
        productId,
        });
    
        return response.data;
    } catch (error) {
        console.error("Error in cancelOrder:", error);
        throw error;
    }
};

export default cancelOrder;