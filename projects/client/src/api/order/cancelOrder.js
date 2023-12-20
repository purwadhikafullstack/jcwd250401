import api from "../../api";

const cancelOrder = async ({ orderId }) => {
    try {
        const response = await api.patch("/api/order/cancel-order", {
        orderId,
        });
    
        return response.data;
    } catch (error) {
        console.error("Error in cancelOrder:", error);
        throw error;
    }
};

export default cancelOrder;