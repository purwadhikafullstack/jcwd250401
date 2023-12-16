import { useCallback, useEffect, useState } from "react";
import api from "../api";
import getSalesReport from "../api/order/getSalesReport";
import { useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function SalesOverview() {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Adding 1 to convert from 0-based index to 1-based index
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [salesReports, setSalesReports] = useState([]); // State to store the sales reports
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(loadingTimeout); // Clear the timeout on component unmount
  }, [selectedWarehouse, selectedMonth, selectedYear]);

  const fetchWarehouse = useCallback(async () => {
    try {
      const result = await api.admin.get("/api/warehouse");
      setWarehouses(result.data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchSalesReport = useCallback(async () => {
    try {
      const result = await getSalesReport({
        warehouse: selectedWarehouse,
        month: selectedMonth,
        year: selectedYear,
      });
      setSalesReports(result.detail);
    } catch (error) {
      console.log(error);
    }
  }, [selectedWarehouse, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchWarehouse();
    fetchSalesReport();
  }, [fetchWarehouse, fetchSalesReport]);

  const month = [
    { value: 1, name: "January" },
    { value: 2, name: "February" },
    { value: 3, name: "March" },
    { value: 4, name: "April" },
    { value: 5, name: "May" },
    { value: 6, name: "June" },
    { value: 7, name: "July" },
    { value: 8, name: "August" },
    { value: 9, name: "September" },
    { value: 10, name: "October" },
    { value: 11, name: "November" },
    { value: 12, name: "December" },
  ];

  const year = [
    { value: new Date().getFullYear() - 1, name: new Date().getFullYear() - 1 },
    { value: new Date().getFullYear(), name: new Date().getFullYear() },
    { value: new Date().getFullYear() + 1, name: new Date().getFullYear() + 1 },
  ];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const warehouseId = queryParams.get("warehouseId");
    const month = queryParams.get("month");
    const year = queryParams.get("year");

    if (warehouseId) {
      setSelectedWarehouse(warehouseId);
    }

    if (month) {
      setSelectedMonth(parseInt(month));
    }

    if (year) {
      setSelectedYear(parseInt(year));
    }
  }, [location.search]);

  const handleWarehouseChange = (e) => {
    setSelectedWarehouse(e.target.value);

    const queryParams = new URLSearchParams(location.search);
    if (e.target.value === "") {
      queryParams.delete("warehouse");
    } else queryParams.set("warehouse", e.target.value);

    navigate({
      pathname: location.pathname,
      search: queryParams.toString(),
    });
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));

    const queryParams = new URLSearchParams(location.search);
    queryParams.set("month", e.target.value);

    navigate({
      pathname: location.pathname,
      search: queryParams.toString(),
    });
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));

    const queryParams = new URLSearchParams(location.search);
    queryParams.set("year", e.target.value);

    navigate({
      pathname: location.pathname,
      search: queryParams.toString(),
    });
  };

  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-end space-x-4">
        <select className="rounded-md shadow-md border-none w-[220px]" value={selectedWarehouse} onChange={handleWarehouseChange}>
          <option value="">All Warehouse</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.name.toLowerCase().replace(/\s+/g, "-")}>
              {warehouse.name}
            </option>
          ))}
        </select>
        <select className="rounded-md shadow-md border-none w-[180px]" value={selectedMonth} onChange={handleMonthChange}>
          {month.map((m) => (
            <option key={m.value} value={m.value}>
              {m.name}
            </option>
          ))}
        </select>
        <select className="rounded-md shadow-md border-none w-[100px]" value={selectedYear} onChange={handleYearChange}>
          {year.map((y) => (
            <option key={y.value} value={y.value}>
              {y.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex space-x-6 ">
          <div className="w-[280px]">
            <Skeleton height="111px" />
          </div>
          <div className="w-[280px]">
            <Skeleton height="111px" />
          </div>
          <div className="w-[280px]">
            <Skeleton height="111px" />
          </div>
          <div className="w-[280px]">
            <Skeleton height="111px" />
          </div>
        </div>
      ) : (
        salesReports.map((report) => (
          <div className="flex space-x-6 w-full" key={report.warehouseId}>
            <div className="flex w-[280px] h-[111px] px-6 items-center bg-white rounded-md shadow-lg">
              <div className="flex flex-col space-y-1 ">
                <span className="font-bold text-gray-500"> Sales </span>
                <span className="font-bold text-2xl"> {formatToRupiah(report.totalSales)}</span>
              </div>
            </div>
            <div className="flex w-[280px] h-[111px] px-6 items-center bg-white rounded-md shadow-lg">
              <div className="flex flex-col space-y-1 justify-center">
                <span className="font-bold text-gray-500"> Transaction </span>
                <span className="font-bold text-2xl"> {report.totalTransactions} </span>
              </div>
            </div>
            <div className="flex w-[280px] h-[111px] px-6 items-center bg-white rounded-md shadow-lg">
              <div className="flex flex-col space-y-1 justify-center">
                <span className="font-bold text-gray-500"> Item Sold</span>
                <span className="font-bold text-2xl"> {report.itemSold} </span>
              </div>
            </div>
            <div className="flex w-[280px] h-[111px] px-6 items-center bg-white rounded-md shadow-lg">
              <div className="flex flex-col space-y-1 justify-center">
                <span className="font-bold text-gray-500"> Total Customers</span>
                <span className="font-bold text-2xl"> {report.totalCustomers} </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default SalesOverview;
