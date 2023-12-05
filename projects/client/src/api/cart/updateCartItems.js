import api from "../../api";

const updateCartItem = async ({ productId, newQuantity } = {}) => {
  try {
    const url = `/cart/${productId}`;
    const response = await api.put(url, { quantity: newQuantity });
    return response.data;
  } catch (error) {
    console.error("Error in updateCartItem:", error);
    throw error;
  }
};

export default updateCartItem;
