import api from "../../api";

const getAllMutations = async ({ page = 1, size, sort, order, search, warehouseId, month, year } = {}) => {
  try {
    const url = `/api/mutation?page=${page}` +
      (size ? `&size=${size}` : "") +
      (sort ? `&sort=${sort}` : "") +
      (order ? `&order=${order}` : "") +
      (search ? `&search=${search}` : "") +
      (warehouseId ? `&warehouseId=${warehouseId}` : "") +
      (month ? `&month=${month}` : "") +
      (year ? `&year=${year}` : "");

    const response = await api.admin.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in getAllMutations:", error);
    throw error;
  }
};

export default getAllMutations;
