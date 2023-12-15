import api from "../../api";

const confirmPayment = async ({ orderId } = {}) => {
    try {
        const response = await api.admin.patch(`/order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error in confirmPayment:", error);
        throw error;
    }
}

export default confirmPayment;