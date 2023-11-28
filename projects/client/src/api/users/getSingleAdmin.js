import api from "../../api";

const getSingleAdmin = async ({ username, email }) => {
    try {
        const response = await api.admin.get(`/users/admin/${username}/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error in getSingleAdmin:", error);
        throw error;
    }
}

export default getSingleAdmin