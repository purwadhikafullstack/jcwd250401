import api from "../../api";

const getAllOrder = async ({ status, page, size, sort, order, warehouseId, month } = {}) => {
    try {
        // Base URL
        let url = `/api/order`;

        // Array to hold query parameters
        const queryParams = [];

        if (status) queryParams.push(`status=${status}`);
        if (page) queryParams.push(`page=${page}`);
        if (size) queryParams.push(`size=${size}`);
        if (sort) queryParams.push(`sort=${sort}`);
        if (order) queryParams.push(`order=${order}`);
        if (warehouseId) queryParams.push(`warehouseId=${warehouseId}`);
        if (month) queryParams.push(`month=${month}`);

        // Join the query parameters with '&' and prepend a '?' if there are any parameters
        if (queryParams.length > 0) {
            url += '?' + queryParams.join('&');
        }

        const response = await api.admin.get(url);
        return response.data;
    } catch (error) {
        console.error("Error in getAllOrder:", error);
        throw error;
    }
}

export default getAllOrder;