import api from "../../api";

const uploadPayProof = async ({ orderId, data, userDataId }) => {
  try {
    const response = await api.put(`/api/order/${userDataId}/${orderId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in uploadPayProof:", error);
    throw error;
  }
};

export default uploadPayProof;
