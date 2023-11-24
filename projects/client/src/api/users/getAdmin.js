import api from "../../api"

const getAdmin = async ({page, size, sort, order, search, isWarehouseAdmin} = {}) => {
    try {
        const url = "/users/admin" +
        (page ? `?page=${page}` : "") +
        (size ? `&size=${size}` : "") +
        (sort ? `&sort=${sort}` : "") +
        (order ? `&order=${order}` : "") +
        (search ? `&search=${search}` : "") +
        (isWarehouseAdmin ? `&isWarehouseAdmin=${isWarehouseAdmin}` : "");
        
        const response = await api.admin.get(url);
        return response.data
    } catch (error) {
        console.error("Error in getAdmin:", error);
        throw error;
    }
}

export default getAdmin