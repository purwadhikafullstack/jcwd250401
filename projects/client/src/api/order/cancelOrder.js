import api from "../../api";

const cancelOrder = async ({ orderId, products }) => {
    try {
        const response = await api.admin.patch("/api/order/cancel-order", {
        orderId,
        products,
        });
    
        return response.data;
    } catch (error) {
        console.error("Error in cancelOrder:", error);
        throw error;
    }
};

export default cancelOrder;