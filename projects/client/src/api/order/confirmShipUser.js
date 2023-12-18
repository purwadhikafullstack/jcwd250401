import api from "../../api";

const confirmShipUser = async ({ orderId } = {}) => {
    try {
        const response = await api.patch(`/order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error in confirmShipUser:", error);
        throw error;
    }
}