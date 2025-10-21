import React from "react";
import { Table } from "antd";
import moment from "moment";
import { useRecentActivitiesQuery } from "../../redux/apiSlices/homeSlice";

const getColumns = () => [
  {
    dataIndex: "message",
    key: "message",
    render: (text) => (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span>{text}</span>
      </div>
    ),
  },
  {
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => (
      <div style={{ width: "100%", textAlign: "right", padding: 8 }}>
        {/* 🔹 moment দিয়ে তারিখ ফরম্যাট */}
        {moment(text).format("LLL")}
      </div>
    ),
  },
];

const OrderTable = () => {
  const columns = getColumns();
  const { data: recentActivities, isLoading } = useRecentActivitiesQuery();

  const dataSource = recentActivities?.data?.map((item, index) => ({
    key: index,
    message: item.message,
    createdAt: item.createdAt,
  }));

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between mb-2 items-start sm:items-center gap-2 sm:gap-0">
        <h1 className="text-lg sm:text-xl md:text-xl font-bold text-secondary mb-2">
          Recent Activity
        </h1>
      </div>

      <div className="overflow-x-auto border rounded-lg pr-4 pl-4 pb-6 pt-3 ">
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered={false}
          pagination={false}
          size="small"
          scroll={{ x: "max-content" }}
          showHeader={false} // hides <thead>
          loading={isLoading}
          rowKey="key"
          className="responsive-table"
        />
      </div>
    </div>
  );
};

export default OrderTable;
