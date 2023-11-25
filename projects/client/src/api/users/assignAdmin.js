import api from "../../api";

const assignAdmin = async ({ userId, warehouseId }) => {
  try {
    const response = await api.admin.patch(`/api/warehouse/admin/${warehouseId}`, { adminId: userId });
    return response.data;
  } catch (error) {
    console.error("Error in assignAdmin:", error);
    throw error;
  }
};

export default assignAdmin;
