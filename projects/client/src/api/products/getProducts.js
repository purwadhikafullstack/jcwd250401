import api from "../../api";

const getProducts = async ({ page = 1, limit, sort, category, search, filterBy, isArchived = false } = {}) => {
  try {
    const url =
      `/product?page=${page}&isArchived=${isArchived}` +
      (limit ? `&limit=${limit}` : "") +
      (sort ? `&sort=${sort}` : "") +
      (category ? `&category=${category}` : "") +
      (search ? `&search=${search}` : "") +
      (filterBy ? `&filterBy=${filterBy}` : "");

    const response = await api.admin.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in useGetProduct:", error);
    throw error;
  }
};

export default getProducts;
