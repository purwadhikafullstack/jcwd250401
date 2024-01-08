import api from "../../api";

 const getCategories = async ({ minId, maxId, page, size, parentCategoryId } = {}) => {
  try {
    const url = `/api/category?` + 
    (minId ? `minId=${minId}` : "") + 
    (maxId ? `&maxId=${maxId}` : "") + 
    (page ? `&page=${page}` : "") + 
    (size ? `&size=${size}` : "") + 
    (parentCategoryId ? `&parentCategoryId=${parentCategoryId}` : "");
    const response = await api.admin.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in getCategories:", error);
    throw error;
  }
};

export default getCategories