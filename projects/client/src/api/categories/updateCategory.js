import api from "../../api";

const updateCategory = async ({ id, name, mainCategory } = {}) => {
  try {
    const response = await api.admin.put(`/category/${id}`, { name, mainCategory });
    return response.data;
  } catch (error) {
    console.error("Error in updateCategory:", error);
    throw error;
  }
};

export default updateCategory;
