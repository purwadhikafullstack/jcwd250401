import api from "../../api";

const deleteCategory = async ({ id } = {}) => {
  try {
    const response = await api.admin.delete(`/api/category/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    throw error;
  }
};

export default deleteCategory;
