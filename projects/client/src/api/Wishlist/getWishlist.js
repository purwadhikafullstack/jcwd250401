import api from "../../api";

const getWishlist = async ({} = {}) => {
  try {
    const response = await api.get("/api/wishlist");
    return response.data;
  } catch (error) {
    console.error("Error in getWishlist:", error);
    throw error;
  }
};

export default getWishlist;
