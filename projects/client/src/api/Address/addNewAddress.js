import api from "../../api";

const addNewAddress = async ({ userId }) => {
    try {
        const response = await api.post(`/address/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error in addAddress:", error);
        throw error;
    }
};

export default addNewAddress;
