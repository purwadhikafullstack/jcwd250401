import api from "../../api";

const getProductsUser = async ({ page = 1, limit, sort, category, search, productName, filterBy, isArchived = false } = {}) => {
  try {
    const url =
      `/api/product/user?page=${page}&isArchived=${isArchived}` +
      (limit ? `&limit=${limit}` : "") +
      (sort ? `&sort=${sort}` : "") +
      (category ? `&category=${category}` : "") +
      (search ? `&search=${search}` : "") +
      (productName ? `&search=${productName}` : "") +
      (filterBy ? `&filterBy=${filterBy}` : "");

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in useGetProduct:", error);
    throw error;
  }
};

export default getProductsUser;
