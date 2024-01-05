import api from "../../api";

const getAllMutationsJournal = async ({ page = 1, size, sort, order, search, warehouseId, destinationWarehouseId, month, year, status }) => {
  try {
    const url =
      `/api/mutation/journal?page=${page}` +
      (size ? `&size=${size}` : "") +
      (sort ? `&sort=${sort}` : "") +
      (order ? `&order=${order}` : "") +
      (search ? `&search=${search}` : "") +
      (warehouseId ? `&warehouseId=${warehouseId}` : "") +
      (destinationWarehouseId ? `&destinationWarehouseId=${destinationWarehouseId}` : "") +
      (month ? `&month=${month}` : "") +
      (year ? `&year=${year}` : "") +
      (status ? `&status=${status}` : "");

    const response = await api.admin.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in getAllMutationsJournal:", error);
    throw error;
  }
};

export default getAllMutationsJournal;
