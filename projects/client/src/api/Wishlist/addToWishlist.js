import api from "../../api";

const addToWishlist = async ({ productId } = {}) => {
  try {
    const response = await api.post("/api/wishlist", { productId });
    return response.data;
  } catch (error) {
    console.error("Error in addToWishlist:", error);
    throw error;
  }
};

export default addToWishlist;
