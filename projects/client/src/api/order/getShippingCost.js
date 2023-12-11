import api from "../../api";

const getShippingCost = async ({ origin, destination, weight } = {}) => {
    try {
        // Base URL
        let url = `/order/cost`;

        // Array to hold query parameters
        const queryParams = [];

        if (origin) queryParams.push(`origin=${origin}`);
        if (destination) queryParams.push(`destination=${destination}`);
        if (weight) queryParams.push(`weight=${weight}`);

        // Join the query parameters with '&' and prepend a '?' if there are any parameters
        if (queryParams.length > 0) {
            url += '?' + queryParams.join('&') + '&courier=jne';
        }

        const response = await api.post(url);
        return response.data;
    } catch (error) {
        console.error("Error in getShippingCost:", error);
        throw error;
    }
}

export default getShippingCost;