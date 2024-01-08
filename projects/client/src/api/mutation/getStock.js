import api from "../../api";

const getStock = async ({ productId, warehouseId }) => {
    try {
        const response = await api.admin.get(`/api/mutation/stock/${productId}/${warehouseId}`);
        return response.data;
    } catch (error) {
        console.error("Error in getStock:", error);
        throw error;
    }
}

export default getStock