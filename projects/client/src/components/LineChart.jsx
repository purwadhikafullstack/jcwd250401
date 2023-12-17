import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, Tooltip, LinearScale, CategoryScale, LineController, PointElement, LineElement } from "chart.js";
import { format } from "date-fns";

Chart.register(Tooltip, LinearScale, CategoryScale, LineController, PointElement, LineElement);

const LineChart = ({ dailySales }) => {
  const dates = dailySales.map((entry) => format(new Date(entry.date), "d MMM"));
  const totalSales = dailySales.map((entry) => entry.totalSales);


  const formatToRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Total Sales",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "#D5C296",
        borderColor: "#D5C296",
        borderWidth : 1.5,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#D5C296",
        pointBackgroundColor: "#D5C296",
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#D5C296",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 1,
        data: totalSales,
      },
    ],
  };
  const options = {
    scales: {
      y: {
        ticks: {
          beginAtZero: true,
          stepSize: 10000000,
          callback: (value) => `${value / 1000000} mil`,
        },
      },
      x: {
        type: "category",
        ticks: {
          autoSkip: true,
          maxTicksLimit: 7,
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const price = context.dataset.data[context.dataIndex];
            return `Total Sales: ${formatToRupiah(price)} `
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-[500px]">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
