import api from "../../api"

const getAllOrder = async ({ status, page, size, sort, order } = {}) => {
    try {
        const url = `/order` +
        (status ? `?status=${status}` : "") +
        (page ? `&page=${page}` : "") +
        (size ? `&size=${size}` : "") +
        (sort ? `&sort=${sort}` : "") +
        (order ? `&order=${order}` : "");
        const response = await api.admin.get(url);
        return response.data;
    } catch (error) {
        console.error("Error in getAllOrder:", error);
        throw error;
    }
}

export default getAllOrder