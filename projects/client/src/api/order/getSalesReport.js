import api from "../../api";

const getSalesReport = async ({ month, year, warehouse } = {}) => {
  try {
    const url = `/api/order/sales-report` + (month ? `?month=${month}` : "") + (year ? `&year=${year}` : "") + (warehouse? `&warehouse=${warehouse}` : "");
    const response = await api.admin.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in getSalesReport:", error);
    throw error;
  }
};

export default getSalesReport;
