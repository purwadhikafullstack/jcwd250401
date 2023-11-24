import api from "../../api";

const unAssignAdmin = async ({ warehouseId }) => {
  try {
    const response = await api.admin.patch(`/api/warehouse/unassign-admin/${warehouseId}`);
    return response.data;
  } catch (error) {
    console.error("Error in unAssignAdmin:", error);
    throw error;
  }
};

export default unAssignAdmin;
