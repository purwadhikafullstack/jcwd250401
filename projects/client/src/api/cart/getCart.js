import api from "../../api";

const getCart = async ({ search } = {}) => {
  try {
    const url = `/cart` + (search ? `&search=${search}` : "");

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in useGetCart:", error);
    throw error;
  }
};

export default getCart;
