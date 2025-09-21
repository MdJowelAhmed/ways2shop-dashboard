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
import { Table, Select, Button } from "antd";
import "antd/dist/reset.css";

const { Option } = Select;

const components = {
  header: {
    row: (props) => (
      <tr
        {...props}
        style={{
          backgroundColor: "#f0f5f9",
          height: "50px",
          color: "secondary",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
    cell: (props) => (
      <th
        {...props}
        style={{
          color: "secondary",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
  },
};

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
  "All Categories",
  ...new Set(data.map((d) => d.category)),
];
const regionOptions = ["All Regions", ...new Set(data.map((d) => d.region))];
const metricOptions = ["Subscription Revenue", "Service Provider", "Customers"];

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
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [chartType, setChartType] = useState("Bar");

  const filteredData = useMemo(() => {
    return data.filter((d) => {
      const monthIndex = monthYearOptions.indexOf(d.date);
      const fromIndex = monthYearOptions.indexOf(fromMonth);
      const toIndex = monthYearOptions.indexOf(toMonth);
      return (
        monthIndex >= fromIndex &&
        monthIndex <= toIndex &&
        (selectedCategory === "All Categories" ||
          d.category === selectedCategory) &&
        (selectedRegion === "All Regions" || d.region === selectedRegion)
      );
    });
  }, [fromMonth, toMonth, selectedCategory, selectedRegion]);

  const columns = [
    {
      title: "SL",
      dataIndex: "sl",
      key: "sl",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    { title: "Date", dataIndex: "date", key: "date", align: "center" },
    { 
      title: "Subscription Revenue", 
      dataIndex: "Subscription Revenue", 
      key: "Subscription Revenue", 
      align: "center" 
    },
    { 
      title: "Service Provider", 
      dataIndex: "Service Provider", 
      key: "Service Provider", 
      align: "center" 
    },
    {
      title: "Customers",
      dataIndex: "Customers",
      key: "Customers",
      align: "center",
    },
  ];

  return (
    <div style={{ width: "100%", padding: "1rem" }}>
      {/* From -> To Month Dropdowns */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <Select
          value={fromMonth}
          style={{ width: 150 }}
          onChange={setFromMonth}
        >
          {monthYearOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>

        <Select
          value={selectedCategory}
          style={{ width: 150 }}
          onChange={setSelectedCategory}
        >
          {categoryOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </div>

      {/* Chart */}
      <div
        className="p-4 rounded-lg border"
        style={{ width: "100%", height: 400, marginTop: "40px" }}
      >
        <ResponsiveContainer>
          {chartType === "Bar" ? (
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
              {(selectedMetric === "all" || selectedMetric === "Subscription Revenue") && (
                <Bar
                  dataKey="Subscription Revenue"
                  fill="#7086FD"
                  shape={(props) => (
                    <Custom3DBarWithWatermark {...props} dataKey="Subscription Revenue" />
                  )}
                />
              )}
              {(selectedMetric === "all" || selectedMetric === "Service Provider") && (
                <Bar
                  dataKey="Service Provider"
                  fill="#6FD195"
                  shape={(props) => (
                    <Custom3DBarWithWatermark {...props} dataKey="Service Provider" />
                  )}
                />
              )}
              {(selectedMetric === "all" ||
                selectedMetric === "Customers") && (
                <Bar
                  dataKey="Customers"
                  fill="#FFAE4C"
                  shape={(props) => (
                    <Custom3DBarWithWatermark
                      {...props}
                      dataKey="Customers"
                    />
                  )}
                />
              )}
            </BarChart>
          ) : chartType === "Line" ? (
            <LineChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {(selectedMetric === "all" || selectedMetric === "Subscription Revenue") && (
                <Line type="monotone" dataKey="Subscription Revenue" stroke="#7086FD" />
              )}
              {(selectedMetric === "all" || selectedMetric === "Service Provider") && (
                <Line type="monotone" dataKey="Service Provider" stroke="#6FD195" />
              )}
              {(selectedMetric === "all" ||
                selectedMetric === "Customers") && (
                <Line
                  type="monotone"
                  dataKey="Customers"
                  stroke="#FFAE4C"
                />
              )}
            </LineChart>
          ) : (
            <AreaChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {(selectedMetric === "all" || selectedMetric === "Subscription Revenue") && (
                <Area
                  type="monotone"
                  dataKey="Subscription Revenue"
                  stroke="#7086FD"
                  fill="#7086FD"
                />
              )}
              {(selectedMetric === "all" || selectedMetric === "Service Provider") && (
                <Area
                  type="monotone"
                  dataKey="Service Provider"
                  stroke="#6FD195"
                  fill="#6FD195"
                />
              )}
              {(selectedMetric === "all" ||
                selectedMetric === "Customers") && (
                <Area
                  type="monotone"
                  dataKey="Customers"
                  stroke="#FFAE4C"
                  fill="#FFAE4C"
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Ant Design Table */}
      <div style={{ marginTop: "50px" }}>
        <h1 className="text-[22px] font-bold mb-2">Data Table</h1>
        <Table
          bordered={false}
          size="small"
          rowClassName="custom-row"
          components={components}
          className="custom-table"
          columns={columns.filter(
            (col) =>
              selectedMetric === "all" || 
              col.dataIndex === selectedMetric ||
              col.dataIndex === "date" ||
              col.dataIndex === "sl"
          )}
          dataSource={filteredData.map((row, index) => ({
            ...row,
            key: index,
          }))}
          pagination={{ pageSize: 6 }}
        />
      </div>
    </div>
  );
}