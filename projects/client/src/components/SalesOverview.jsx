import { useCallback, useEffect, useState } from "react";
import api from "../api";
import getSalesReport from "../api/order/getSalesReport";
import { useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LineChart from "./LineChart";
import HorizontalCategoryBarChart from "./HorizontalCategoryBarChart";
import HorizontalProductBarChart from "./HorizontalProductBarChart";
import { useSelector } from "react-redux";
import { toast } from "sonner";

function SalesOverview() {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Adding 1 to convert from 0-based index to 1-based index
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [salesReports, setSalesReports] = useState([]); // State to store the sales reports
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const isWarehouseAdmin = useSelector((state) => state.account.isWarehouseAdmin);
  const warehouseAdmin = useSelector((state) => state.account.adminProfile.data.profile?.warehouse?.name);

  const [selectedWarehouse, setSelectedWarehouse] = useState(isWarehouseAdmin ? warehouseAdmin.toLowerCase().replace(/\s+/g, "-") : "");

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(loadingTimeout); // Clear the timeout on component unmount
  }, []);

  const fetchWarehouse = useCallback(async () => {
    try {
      const result = await api.admin.get("/api/warehouse");
      setWarehouses(result.data.data);
    } catch (error) {
      setWarehouses([]);
      toast.error(error.response.data.message, {
        description: error.response.data.detail,
      });
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
      setSalesReports([]);
      toast.error(error.response.data.message, {
        description: error.response.data.detail,
      });
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
    <div className="flex w-full flex-col lg:space-y-4 space-y-2">
      <div className="flex lg:flex-row lg:justify-end flex-col mt-1 lg:space-x-4 space-y-2 lg:space-y-0">
        {isWarehouseAdmin ? (
          <select className="rounded-md shadow-md border-none lg:w-[220px] focus:border-none" value={selectedWarehouse} onChange={handleWarehouseChange}>
            <option value={warehouseAdmin.toLowerCase().replace(/\s+/g, "-")}>{warehouseAdmin}</option>
          </select>
        ) : (
          <select className="rounded-md shadow-md border-none lg:w-[220px] focus:outline-none focus:ring-gray-500 focus:border-none" value={selectedWarehouse} onChange={handleWarehouseChange}>
            <option value="">All Warehouse</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.name.toLowerCase().replace(/\s+/g, "-")}>
                {warehouse.name}
              </option>
            ))}
          </select>
        )}
        <select className="rounded-md shadow-md border-none lg:w-[170px] focus:outline-none focus:ring-gray-500 focus:border-none" value={selectedMonth} onChange={handleMonthChange}>
          {month.map((m) => (
            <option key={m.value} value={m.value}>
              {m.name}
            </option>
          ))}
        </select>
        <div>
          <select className="rounded-md shadow-md border-none lg:w-[100px] focus:outline-none focus:ring-gray-500 focus:border-none" value={selectedYear} onChange={handleYearChange}>
            {year.map((y) => (
              <option key={y.value} value={y.value}>
                {y.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isLoading ? (
        <div className="flex w-full flex-col space-y-4 h-[78vh] overflow-y-auto  scrollbar-hide">
          <div className="flex lg:flex-row flex-col lg:justify-center items-center lg:items-start lg:space-x-6 w-full">
            {Array.from({ length: 4 }, (_, index) => (
              <>
                <div className="hidden lg:block w-[280px]">
                  <Skeleton height="111px" />
                </div>
                <div className="lg:hidden w-full">
                  <Skeleton height="70px" />
                </div>
              </>
            ))}
          </div>
          <div>
            <Skeleton height="300px" />
          </div>
          <div className="flex lg:flex-row flex-col w-full  space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="lg:w-[48%]">
              <Skeleton height="400px" />
            </div>
            <div className="lg:w-[48%]">
              <Skeleton height="400px" />
            </div>
          </div>
        </div>
      ) : salesReports.length === 0 ? (
        <div>
          <div className="flex justify-center items-center h-[79vh]">
            <span className="text-2xl">No sales report available</span>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col space-y-4 lg:h-[79vh] rounded-md h-[72vh] overflow-y-auto  scrollbar-hide">
          {salesReports.map((report) => (
            <>
              {/* Desktop View */}
              <div className="w-full hidden lg:block" key={report.warehouseId}>
                <div className="flex justify-center space-x-4 w-full">
                  <div className="flex w-[25%] h-[111px] px-6 items-center bg-white rounded-md shadow-lg">
                    <div className="flex flex-col space-y-1 ">
                      <span className="font-bold text-gray-500"> Sales </span>
                      <span className="font-bold text-2xl"> {formatToRupiah(report.totalSales)}</span>
                    </div>
                  </div>
                  <div className="flex w-[25%] h-[111px] px-6 items-center bg-white rounded-md shadow-lg">
                    <div className="flex flex-col space-y-1 justify-center">
                      <span className="font-bold text-gray-500"> Transaction </span>
                      <span className="font-bold text-2xl"> {report.totalTransactions} </span>
                    </div>
                  </div>
                  <div className="flex w-[25%] h-[111px] px-6 items-center bg-white rounded-md shadow-lg">
                    <div className="flex flex-col space-y-1 justify-center">
                      <span className="font-bold text-gray-500"> Item Sold</span>
                      <span className="font-bold text-2xl"> {report.itemSold} </span>
                    </div>
                  </div>
                  <div className="flex w-[25%] h-[111px] px-6 items-center bg-white rounded-md shadow-lg">
                    <div className="flex flex-col space-y-1 justify-center">
                      <span className="font-bold text-gray-500"> Total Customers</span>
                      <span className="font-bold text-2xl"> {report.totalCustomers} </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Mobile View */}
              <div className="w-full lg:hidden" key={report.warehouseId}>
                <div className="flex flex-col w-full space-y-2">
                  <div className="flex flex-col space-x-2 w-full px-4 py-1 rounded-md shadow-lg   bg-white">
                    <span className="font-bold text-gray-500"> Sales </span>
                    <span className="font-bold text-2xl"> {formatToRupiah(report.totalSales)}</span>
                  </div>
                  <div className="flex flex-col space-x-2 w-full px-4 py-1 rounded-md shadow-lg  bg-white">
                    <span className="font-bold text-gray-500"> Transaction </span>
                    <span className="font-bold text-2xl"> {report.totalTransactions} </span>
                  </div>
                  <div className="flex space-x-2 w-full">
                    <div className="flex w-[50%] flex-col item-center space-x-2 px-4 py-1 rounded-md shadow-lg bg-white">
                      <span className="font-bold text-gray-500"> Item Sold</span>
                      <span className="font-bold text-2xl"> {report.itemSold} </span>
                    </div>
                    <div className="flex w-[50%] flex-col item-center space-x-2 px-4 py-1 rounded-md shadow-lg bg-white">
                      <span className="font-bold text-gray-500"> Total Customers</span>
                      <span className="font-bold text-2xl"> {report.totalCustomers} </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}

          <div className="flex flex-col space-y-4 w-full h-[300px] px-6 py-4 bg-white rounded-md shadow-lg">
            <span className="font-bold text-2xl"> Sales </span>
            {salesReports.map((report) => (
              <LineChart key={report.warehouseId} dailySales={report.dailySales} />
            ))}
          </div>
          <div className="w-full flex lg:flex-row flex-col lg:space-x-4 space-y-4 lg:space-y-0 h-[400px]">
            <div className="lg:w-[50%] flex-col justify-center space-y-4 px-6 py-4 items-center bg-white rounded-md shadow-lg h-[340px]">
              <span className="font-bold text-2xl"> Top Selling Category </span>
              {salesReports.map((report) => (
                <HorizontalCategoryBarChart productCategoryData={report.productCategoryData} />
              ))}
            </div>
            <div className="lg:w-[50%] flex-col justify-center space-y-4 px-6 py-4 items-center bg-white rounded-md shadow-lg h-[340px]">
              <span className="font-bold text-2xl"> Top Selling Product </span>
              {salesReports.map((report) => (
                <HorizontalProductBarChart productData={report.productData} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesOverview;
