import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample data with updated fields
const data = [
  {
    sl: 1,
    date: "Jan 2025",
    category: "Employee",
    region: "USA",
    "Subscription Revenue": 100,
    "Service Provider": 65,
    "Customers": 32,
  },
  {
    sl: 2,
    date: "Feb 2025",
    category: "Employee",
    region: "USA",
    "Subscription Revenue": 75,
    "Service Provider": 60,
    "Customers": 27,
  },
  {
    sl: 3,
    date: "Mar 2025",
    category: "Employee",
    region: "USA",
    "Subscription Revenue": 50,
    "Service Provider": 62,
    "Customers": 22,
  },
  {
    sl: 4,
    date: "Apr 2025",
    category: "Employee",
    region: "UK",
    "Subscription Revenue": 69,
    "Service Provider": 54,
    "Customers": 29,
  },
  {
    sl: 5,
    date: "May 2025",
    category: "Employee",
    region: "UK",
    "Subscription Revenue": 47,
    "Service Provider": 59,
    "Customers": 24,
  },
  {
    sl: 6,
    date: "Jun 2025",
    category: "Employee",
    region: "UK",
    "Subscription Revenue": 60,
    "Service Provider": 68,
    "Customers": 37,
  },
  {
    sl: 7,
    date: "Jul 2025",
    category: "Employee",
    region: "USA",
    "Subscription Revenue": 88,
    "Service Provider": 57,
    "Customers": 45,
  },
  {
    sl: 8,
    date: "Aug 2025",
    category: "Employee",
    region: "USA",
    "Subscription Revenue": 88,
    "Service Provider": 57,
    "Customers": 45,
  },
  {
    sl: 9,
    date: "Sep 2025",
    category: "Customer",
    region: "UK",
    "Subscription Revenue": 38,
    "Service Provider": 57,
    "Customers": 100,
  },
  {
    sl: 10,
    date: "Oct 2025",
    category: "Customer",
    region: "UK",
    "Subscription Revenue": 88,
    "Service Provider": 57,
    "Customers": 45,
  },
  {
    sl: 11,
    date: "Nov 2025",
    category: "Customer",
    region: "USA",
    "Subscription Revenue": 88,
    "Service Provider": 57,
    "Customers": 45,
  },
  {
    sl: 12,
    date: "Dec 2025",
    category: "Customer",
    region: "USA",
    "Subscription Revenue": 88,
    "Service Provider": 57,
    "Customers": 45,
  },
];

// Dropdown options
const monthYearOptions = [...new Set(data.map((d) => d.date))];
const categoryOptions = [
  "All",
  "Subscription Revenue",
  "Service Provider", 
  "Customers"
];

const maxValues = {
  "Subscription Revenue": Math.max(...data.map((d) => d["Subscription Revenue"])),
  "Service Provider": Math.max(...data.map((d) => d["Service Provider"])),
  "Customers": Math.max(...data.map((d) => d["Customers"])),
};

// Custom 3D Bar with watermark
const Custom3DBarWithWatermark = ({
  x,
  y,
  width,
  height,
  fill,
  dataKey,
  payload,
}) => {
  const depth = 10;
  const maxValue = maxValues[dataKey];
  const scale = maxValue / payload[dataKey];
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
  const [fromMonth, setFromMonth] = useState(monthYearOptions[0]);
  const [toMonth, setToMonth] = useState(
    monthYearOptions[monthYearOptions.length - 1]
  );
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredData = useMemo(() => {
    return data.filter((d) => {
      const monthIndex = monthYearOptions.indexOf(d.date);
      const fromIndex = monthYearOptions.indexOf(fromMonth);
      const toIndex = monthYearOptions.indexOf(toMonth);
      return (
        monthIndex >= fromIndex &&
        monthIndex <= toIndex
      );
    });
  }, [fromMonth, toMonth]);

  const getTableColumns = () => {
    const baseColumns = [
      {
        title: "SL",
        dataIndex: "sl",
        key: "sl",
        width: 60,
        render: (_, __, index) => index + 1,
      },
      { 
        title: "Date", 
        dataIndex: "date", 
        key: "date",
        width: 120,
      },
    ];

    if (selectedCategory === "All") {
      return [
        ...baseColumns,
        {
          title: "Subscription Revenue",
          dataIndex: "Subscription Revenue",
          key: "Subscription Revenue",
          width: 150,
        },
        {
          title: "Service Provider",
          dataIndex: "Service Provider",
          key: "Service Provider",
          width: 150,
        },
        {
          title: "Customers",
          dataIndex: "Customers",
          key: "Customers",
          width: 120,
        }
      ];
    } else {
      return [
        ...baseColumns,
        {
          title: selectedCategory,
          dataIndex: selectedCategory,
          key: selectedCategory,
          width: 150,
        }
      ];
    }
  };

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
            value={fromMonth}
            onChange={(e) => setFromMonth(e.target.value)}
            style={{ 
              padding: "8px 12px", 
              border: "1px solid #d1d5db", 
              borderRadius: "4px",
              minWidth: "120px"
            }}
          >
            {monthYearOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label style={{ fontWeight: "bold", minWidth: "60px" }}>To:</label>
          <select
            value={toMonth}
            onChange={(e) => setToMonth(e.target.value)}
            style={{ 
              padding: "8px 12px", 
              border: "1px solid #d1d5db", 
              borderRadius: "4px",
              minWidth: "120px"
            }}
          >
            {monthYearOptions.map((option) => (
              <option key={option} value={option}>
                {option}
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
            data={filteredData}
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
                  <Custom3DBarWithWatermark {...props} dataKey="Subscription Revenue" />
                )}
              />
            )}
            {(selectedCategory === "All" || selectedCategory === "Service Provider") && (
              <Bar
                dataKey="Service Provider"
                fill="#6FD195"
                shape={(props) => (
                  <Custom3DBarWithWatermark {...props} dataKey="Service Provider" />
                )}
              />
            )}
            {(selectedCategory === "All" || selectedCategory === "Customers") && (
              <Bar
                dataKey="Customers"
                fill="#FFAE4C"
                shape={(props) => (
                  <Custom3DBarWithWatermark {...props} dataKey="Customers" />
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
              {filteredData.map((row, index) => (
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
        {filteredData.length === 0 && (
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