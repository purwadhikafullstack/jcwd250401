import api from "../../api";

const getCustomers = async ({page, size, sort, order, search } = {}) => {
    try {
        const url = "/users" +
        (page ? `?page=${page}` : "") +
        (size ? `&size=${size}` : "") +
        (sort ? `&sort=${sort}` : "") +
        (order ? `&order=${order}` : "") +
        (search ? `&search=${search}` : "");

        const response = await api.admin.get(url)
        return response.data
    } catch (error) {
        console.error("Error in getCustomers:", error);
        throw error;
    }
}

export default getCustomers