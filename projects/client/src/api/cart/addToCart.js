import api from "../../api";

const addToCart = async ({ productId, quantity } = {}) => {
  try {
    const response = await api.post("/cart", { productId, quantity });
    return response.data;
  } catch (error) {
    console.error("Error in addToCart:", error);
    throw error;
  }
};

export default addToCart;
