import api from "../../api";

const confirmShip = async ({ orderId } = {}) => {
    try {
        const response = await api.admin.patch(`/order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error in confirmShip:", error);
        throw error;
    }
}

export default confirmShip;