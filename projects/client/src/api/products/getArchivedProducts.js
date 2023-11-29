import api from "../../api";

const getArchivedProducts = async ({ page = 1, limit, sort, category, productName, filterBy } = {}) => {
  try {
    const url =
      `/product/archived?page=${page}` +
      (limit ? `&limit=${limit}` : "") +
      (sort ? `&sort=${sort}` : "") +
      (category ? `&category=${category}` : "") +
      (productName ? `&search=${productName}` : "") +
      (filterBy ? `&filterBy=${filterBy}` : "");

    const response = await api.admin.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in useGetProduct:", error);
    throw error;
  }
};

export default getArchivedProducts;
