// LineChart.jsx
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useGetRevenueQuery } from "../../redux/apiSlices/homeSlice";

// Registering chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

const LineChart = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [yearFilter, setYearFilter] = useState(currentYear);
  const { data: revenueData } = useGetRevenueQuery({ yearFilter });
  // console.log(revenueData);
  const months = revenueData?.monthlyRevenue?.map((item) => item.label);
  const totalRevenue = revenueData?.monthlyRevenue?.map((item) => item.revenue);

  // Data for the line chart
  const data = {
    labels: months,
    datasets: [
      {
        label: "Total Revenue",
        data: totalRevenue,
        fill: false,
        borderColor: "#CDA861",
        backgroundColor: "transparent",
        tension: 0.4,
        borderWidth: 2,
        pointBorderColor: "#CDA861",
        pointBackgroundColor: "#CDA861",
        pointRadius: 4,
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          color: "#000",
        },
      },
      tooltip: {
        titleColor: "#000",
        bodyColor: "#000",
        borderColor: "#CDA861",
        borderWidth: 2,
        backgroundColor: "#CDA861",
        padding: 15,
        cornerRadius: 8,
        displayColors: false,
        bodyFont: {
          size: 16,
        },
        boxPadding: 10,
        callbacks: {
          label: (context) =>
            `$${context.raw.toLocaleString()}`.padEnd(15, " "),
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: "#000",
        },
        ticks: {
          color: "#000",
        },
      },
      y: {
        grid: {
          display: false,
        },
        beginAtZero: true,
        ticks: {
          color: "#000",
          padding: 32,
          callback: function (value) {
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "250px" }} className="text-white">
      <div className="flex items-center justify-between">
        <h2 className="mb-4 text-xl font-bold text-white">Total Revenue</h2>
        <select
          className="px-4 py-2 text-white bg-[#CDA861] border-2 rounded-lg outline-none"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          {years.map((year) => (
            <option key={year} value={year} className="text-black">
              {year}
            </option>
          ))}
        </select>
      </div>

      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
