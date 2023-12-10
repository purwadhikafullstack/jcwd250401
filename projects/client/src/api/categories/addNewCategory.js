import api from "../../api";

const addNewCategory = async ({ name, mainCategory } = {}) => {
  try {
    const response = await api.admin.post("/api/category", { name, mainCategory });
    return response.data;
  } catch (error) {
    console.error("Error in addNewCategory:", error);
    throw error;
  }
};

export default addNewCategory;