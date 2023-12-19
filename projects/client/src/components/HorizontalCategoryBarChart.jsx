import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, Tooltip, LinearScale, CategoryScale, BarController, BarElement } from "chart.js";
import { format } from "date-fns";

Chart.register(Tooltip, LinearScale, CategoryScale, BarController, BarElement);

const HorizontalCategoryBarChart = ({ productCategoryData }) => {
  // Sort productCategoryData by count in descending order
  const sortedData = [...productCategoryData].sort((a, b) => b.count - a.count);

  // Take only the top 5 entries
  const top5Data = sortedData.slice(0, 5);

  // Extract category names and counts for the top 5
  const categoryNames = top5Data.map((entry) => entry.categoryName);
  const categoryCounts = top5Data.map((entry) => entry.count);

  const data = {
    labels: categoryNames,
    datasets: [
      {
        label: "Product Category Counts",
        data: categoryCounts,
        backgroundColor: ["#D5C296", "#E8D8B2", "#F4A261", "#E9C46A", "#DBE1BC"], // Adjust color as needed
        borderWidth: 1,
        barThickness: 15,
      },
    ],
  };

  const options = {
    indexAxis: "y", // Set indexAxis to 'y' for a horizontal bar chart
    scales: {
      x: {
        ticks: {
          stepSize: 10, // Set step size to ensure fixed values
          max: 120, // Set the maximum value to ensure the last value is 120
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function (context) {
            // Display category name in the tooltip title
            return `Category Name: ${context[0].label}`;
          },
          label: function (context) {
            // Display item sold in the tooltip body
            return `Item Sold: ${context.formattedValue}`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-[250px] px-4">
      <Bar data={data} options={options} />
    </div>
  );
};

export default HorizontalCategoryBarChart;
