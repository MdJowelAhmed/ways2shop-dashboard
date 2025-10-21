import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetReportAnalysisQuery } from "../../redux/apiSlices/reportAnalysisApi";
// import { useGetReportAnalysisQuery } from "../api/reportAnalysisApi";

// Category mapping for API
const categoryMapping = {
  "Subscription Revenue": "revenue",
  "Service Provider": "providers",
  "Customers": "customers",
};

const categoryOptions = [
  "All",
  "Subscription Revenue",
  "Service Provider",
  "Customers"
];

// Custom 3D Bar with watermark
const Custom3DBarWithWatermark = ({
  x,
  y,
  width,
  height,
  fill,
  dataKey,
  payload,
  maxValue,
}) => {
  const depth = 10;
  const currentValue = payload[dataKey] || 0;
  const scale = maxValue > 0 ? maxValue / (currentValue || 1) : 1;
  const watermarkHeight = height * scale;
  const watermarkY = y - (watermarkHeight - height);

  return (
    <g>
      <g opacity={0.1}>
        <rect
          x={x}
          y={watermarkY}
          width={width}
          height={watermarkHeight}
          fill={fill}
        />
        <polygon
          points={`${x},${watermarkY} ${x + depth},${watermarkY - depth} ${
            x + width + depth
          },${watermarkY - depth} ${x + width},${watermarkY}`}
          fill={fill}
        />
        <polygon
          points={`${x + width},${watermarkY} ${x + width + depth},${
            watermarkY - depth
          } ${x + width + depth},${watermarkY + watermarkHeight} ${x + width},${
            watermarkY + watermarkHeight
          }`}
          fill={fill}
        />
      </g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        opacity={0.4}
      />
      <polygon
        points={`${x},${y} ${x + depth},${y - depth} ${x + width + depth},${
          y - depth
        } ${x + width},${y}`}
        fill={fill}
        opacity={0.6}
      />
      <polygon
        points={`${x + width},${y} ${x + width + depth},${y - depth} ${
          x + width + depth
        },${y + height} ${x + width},${y + height}`}
        fill={fill}
        opacity={0.7}
      />
    </g>
  );
};

export default function MonthlyStatsChart() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [startYear, setStartYear] = useState(currentYear);
  const [startMonth, setStartMonth] = useState(1);
  const [endYear, setEndYear] = useState(currentYear);
  const [endMonth, setEndMonth] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Build query parameters
  const queryParams = useMemo(() => {
    const params = {
      startYear,
      startMonth,
      endYear,
      endMonth,
    };
    
    if (selectedCategory !== "All") {
      params.type = categoryMapping[selectedCategory];
    }
    
    return params;
  }, [startYear, startMonth, endYear, endMonth, selectedCategory]);

  // Fetch data from API
  const { data: apiResponse, isLoading, error } = useGetReportAnalysisQuery(queryParams);

  // Process data for chart
  const chartData = useMemo(() => {
    if (!apiResponse?.data) return [];
    
    return apiResponse.data.map((item, index) => ({
      sl: index + 1,
      date: item.label,
      month: item.month,
      "Subscription Revenue": item.revenue || 0,
      "Service Provider": item.providers || 0,
      "Customers": item.customers || 0,
    }));
  }, [apiResponse]);

  // Calculate max values for watermark
  const maxValues = useMemo(() => {
    if (chartData.length === 0) {
      return {
        "Subscription Revenue": 100,
        "Service Provider": 100,
        "Customers": 100,
      };
    }
    
    return {
      "Subscription Revenue": Math.max(...chartData.map((d) => d["Subscription Revenue"]), 1),
      "Service Provider": Math.max(...chartData.map((d) => d["Service Provider"]), 1),
      "Customers": Math.max(...chartData.map((d) => d["Customers"]), 1),
    };
  }, [chartData]);

  // Generate year options (last 5 years to next 2 years)
  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 2; i++) {
      years.push(i);
    }
    return years;
  }, [currentYear]);

  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const getTableColumns = () => {
    const baseColumns = [
      { title: "SL", key: "sl" },
      { title: "Date", key: "date" },
    ];

    if (selectedCategory === "All") {
      return [
        ...baseColumns,
        { title: "Subscription Revenue", key: "Subscription Revenue" },
        { title: "Service Provider", key: "Service Provider" },
        { title: "Customers", key: "Customers" }
      ];
    } else {
      return [
        ...baseColumns,
        { title: selectedCategory, key: selectedCategory }
      ];
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        width: "100%", 
        padding: "2rem", 
        textAlign: "center",
        fontSize: "18px",
        color: "#6b7280"
      }}>
        Loading data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        width: "100%", 
        padding: "2rem", 
        textAlign: "center",
        fontSize: "18px",
        color: "#ef4444"
      }}>
        Error loading data. Please try again.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      {/* Filter Controls */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label style={{ fontWeight: "bold", minWidth: "80px" }}>From:</label>
          <select
            value={startMonth}
            onChange={(e) => setStartMonth(Number(e.target.value))}
            style={{ 
              padding: "8px 12px", 
              border: "1px solid #d1d5db", 
              borderRadius: "4px",
              minWidth: "120px"
            }}
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            style={{ 
              padding: "8px 12px", 
              border: "1px solid #d1d5db", 
              borderRadius: "4px",
              minWidth: "100px"
            }}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label style={{ fontWeight: "bold", minWidth: "60px" }}>To:</label>
          <select
            value={endMonth}
            onChange={(e) => setEndMonth(Number(e.target.value))}
            style={{ 
              padding: "8px 12px", 
              border: "1px solid #d1d5db", 
              borderRadius: "4px",
              minWidth: "120px"
            }}
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={endYear}
            onChange={(e) => setEndYear(Number(e.target.value))}
            style={{ 
              padding: "8px 12px", 
              border: "1px solid #d1d5db", 
              borderRadius: "4px",
              minWidth: "100px"
            }}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label style={{ fontWeight: "bold", minWidth: "80px" }}>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ 
              padding: "8px 12px", 
              border: "1px solid #d1d5db", 
              borderRadius: "4px",
              minWidth: "180px"
            }}
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div
        style={{
          width: "100%",
          height: "400px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "1rem",
          backgroundColor: "#ffffff",
          marginBottom: "2rem"
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barCategoryGap="20%"
            barGap={13}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {(selectedCategory === "All" || selectedCategory === "Subscription Revenue") && (
              <Bar
                dataKey="Subscription Revenue"
                fill="#7086FD"
                shape={(props) => (
                  <Custom3DBarWithWatermark 
                    {...props} 
                    dataKey="Subscription Revenue"
                    maxValue={maxValues["Subscription Revenue"]}
                  />
                )}
              />
            )}
            {(selectedCategory === "All" || selectedCategory === "Service Provider") && (
              <Bar
                dataKey="Service Provider"
                fill="#6FD195"
                shape={(props) => (
                  <Custom3DBarWithWatermark 
                    {...props} 
                    dataKey="Service Provider"
                    maxValue={maxValues["Service Provider"]}
                  />
                )}
              />
            )}
            {(selectedCategory === "All" || selectedCategory === "Customers") && (
              <Bar
                dataKey="Customers"
                fill="#FFAE4C"
                shape={(props) => (
                  <Custom3DBarWithWatermark 
                    {...props} 
                    dataKey="Customers"
                    maxValue={maxValues["Customers"]}
                  />
                )}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "1rem" }}>
          Data Table
        </h2>
        <div style={{ 
          overflowX: "auto", 
          border: "1px solid #e5e7eb", 
          borderRadius: "8px",
          backgroundColor: "#ffffff"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb" }}>
                {getTableColumns().map((col) => (
                  <th
                    key={col.key}
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      fontWeight: "bold",
                      borderBottom: "2px solid #e5e7eb",
                      fontSize: "14px",
                      color: "#374151"
                    }}
                  >
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, index) => (
                <tr 
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb"
                  }}
                >
                  <td style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>
                    {row.date}
                  </td>
                  {selectedCategory === "All" ? (
                    <>
                      <td style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>
                        {row["Subscription Revenue"]}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>
                        {row["Service Provider"]}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>
                        {row["Customers"]}
                      </td>
                    </>
                  ) : (
                    <td style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>
                      {row[selectedCategory]}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {chartData.length === 0 && (
          <div style={{ 
            textAlign: "center", 
            padding: "2rem", 
            color: "#6b7280",
            fontSize: "16px"
          }}>
            No data found for the selected filters
          </div>
        )}
      </div>
    </div>
  );
}