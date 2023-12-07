import { useCallback, useEffect, useState } from "react";
import getSummaryTotalStock from "../api/mutation/getSummaryTotalStock";
import { toast } from "sonner";

export const SummaryStock = ({ selectedMonth, warehouseId }) => {
  const [summaryTotalStock, setSummaryTotalStock] = useState([]);

  const fetchSummaryTotalStock = async () => {
    try {
      const response = await getSummaryTotalStock({ warehouseId, month: selectedMonth });
      if (response.ok) {
        setSummaryTotalStock(response.detail);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error(error.response.data.message);
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchSummaryTotalStock();
  }, [warehouseId, selectedMonth]);
  return (
    <div className="flex flex-wrap lg:flex-nowrap gap-4 w-full mb-2 min-h-[15vh] overflow-y-auto lg:overflow-hidden p-2 lg:p-0 lg:py-2 border-2 border-gray-400 lg:border-none rounded-lg lg:rounded-none scrollbar-hide">
      <div className="bg-white p-2 lg:p-4 w-full lg:w-1/2 shadow-lg rounded-md">
        <h2 className="text-sm lg:text-lg font-bold text-[#777777] min-h-[40px]">Total Stock Additions</h2>
        <h3 className="text-sm lg:text-lg font-bold">{summaryTotalStock?.overallTotal?.overallTotalAddition || 0}</h3>
      </div>

      <div className="bg-white p-2 lg:p-4 w-full lg:w-1/2 shadow-lg rounded-md">
        <h2 className="text-sm lg:text-lg font-bold text-[#777777] min-h-[40px]">Total Stock Subtractions</h2>
        <h3 className="text-sm lg:text-lg font-bold">{summaryTotalStock?.overallTotal?.overallTotalSubtraction || 0}</h3>
      </div>

      <div className="bg-white p-2 lg:p-4 w-full lg:w-1/2 shadow-lg rounded-md">
        <h2 className="text-sm lg:text-lg font-bold text-[#777777] min-h-[40px]">Total Stock Overall</h2>
        <h3 className="text-sm lg:text-lg font-bold">{summaryTotalStock?.overallTotal?.overallTotalStock || 0}</h3>
      </div>
    </div>
  );
};
