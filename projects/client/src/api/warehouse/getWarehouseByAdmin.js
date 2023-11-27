import api from "../../api"

const getWarehouseByAdmin = async ({ adminId } = {}) => {
    try {
        const response = await api.admin.get(`/api/warehouse/${adminId}`);
        return response.data;
    } catch (error) {
        console.error("Error in getWarehouseByAdmin:", error);
        throw error;
    }
}

export default getWarehouseByAdmin