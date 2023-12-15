import api from "../../api";

const rejectPayment = async ({ orderId } = {}) => {
    try {
        const response = await api.admin.patch(`/order/reject/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error in rejectPayment:", error);
        throw error;
    }
}

export default rejectPayment;