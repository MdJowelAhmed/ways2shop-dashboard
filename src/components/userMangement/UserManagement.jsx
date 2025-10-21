import React, { useState, useMemo } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Avatar,
  Dropdown,
  Tag,
  Card,
  Menu,
  message,
  Spin,
} from "antd";
import {
  SearchOutlined,
  DownOutlined,
  UserOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} from "../../redux/apiSlices/userSlice";
import { getImageUrl } from "../common/imageUrl";
// import {
//   useGetAllUsersQuery,
//   useUpdateUserStatusMutation,
// } from "../redux/features/admin/userManagementApi";

const { Option } = Select;

const UserManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("CUSTOMER");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Build query arguments
  const queryArgs = useMemo(() => {
    const args = [
      { name: "role", value: activeTab },
      { name: "page", value: page.toString() },
      { name: "limit", value: limit.toString() },
    ];

    if (searchText) {
      args.push({ name: "searchTerm", value: searchText });
    }

    if (statusFilter) {
      args.push({ name: "isActive", value: statusFilter });
    }

    return args;
  }, [activeTab, page, limit, searchText, statusFilter]);

  // Fetch users data
  const { data, isLoading, isFetching } = useGetAllUsersQuery(queryArgs);
  console.log("data", data);
  const [updateUserStatus] = useUpdateUserStatusMutation();

  // Handle status change
  const handleStatusChange = async (record, newStatus) => {
    console.log("newStatus", newStatus);
    try {
      await updateUserStatus({
        userId: record._id,
        isActive: newStatus,
      }).unwrap();
      message.success(`User status updated to ${newStatus}`);
    } catch (error) {
      message.error("Failed to update user status");
      console.error("Status update error:", error);
    }
  };

  const getStatusColor = (status) => {
    return status === "ACTIVE" ? "#52c41a" : "#ff4d4f";
  };

  const statusMenu = (record) => (
    <Menu
      items={[
        {
          key: "ACTIVE",
          label: "Active",
          onClick: () => handleStatusChange(record, "ACTIVE"),
        },
        {
          key: "INACTIVE",
          label: "Inactive",
          onClick: () => handleStatusChange(record, "INACTIVE"),
        },
      ]}
    />
  );

  const columns = [
    {
      title: "SL",
      key: "sl",
      width: 60,
      align: "center",
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (text, record) => {
        const hasProfile = record?.profile && record.profile.trim() !== "";
        const imageSrc = hasProfile ? getImageUrl(record.profile) : undefined;

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Avatar
              // size="small"
              src={imageSrc}
              icon={!hasProfile && <UserOutlined />}
              style={{
                backgroundColor: hasProfile ? "transparent" : "#1890ff",
                height: "62px",
                width: "62px",
              }}
            />
            <span style={{ fontWeight: "500" }}>{text || "N/A"}</span>
          </div>
        );
      },
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 180,
      render: (location) => location?.locationName || "N/A",
    },
    {
      title: "Phone Number",
      dataIndex: "contact",
      key: "contact",
      width: 150,
      render: (contact) => contact || "N/A",
    },
    {
      title: "Joining Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      render: (date) => new Date(date).toLocaleDateString("en-GB"),
    },
    {
      title: "Service",
      dataIndex: "businessCategory",
      key: "businessCategory",
      width: 100,
      align: "center",
      render: (categories) => (
        <Tag color="blue">{categories?.length > 0 ? "Yes" : "No"}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (status, record) => (
        <Dropdown
          overlay={statusMenu(record)}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            size="small"
            style={{
              backgroundColor: getStatusColor(status),
              borderColor: getStatusColor(status),
              color: "white",
              borderRadius: "16px",
              fontSize: "12px",
              fontWeight: "500",
              minWidth: "80px",
              height: "28px",
            }}
          >
            {status}
            <DownOutlined style={{ fontSize: "10px", marginLeft: "4px" }} />
          </Button>
        </Dropdown>
      ),
    },
  ];

  // Handle search with debounce effect
  const handleSearch = (value) => {
    setSearchText(value);
    setPage(1); // Reset to first page on search
  };

  // Handle status filter change
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setPage(1); // Reset to first page on filter
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1); // Reset to first page on tab change
    setSearchText(""); // Clear search
    setStatusFilter(""); // Clear status filter
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Tab Buttons */}
      <Card
        style={{
          borderRadius: "16px",
          marginBottom: "24px",
          // boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "1px solid #e5e7eb",
        }}
        bodyStyle={{ padding: "20px 32px" }}
      >
        <div className="flex items-center justify-between">
          {/* Left side (Search + Filter) */}
          <Space size="large">
            <Input
              placeholder="Search users..."
              prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: 300,
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                fontSize: "14px",
                height: "45px",
              }}
              size="large"
              allowClear
            />

            <Select
              placeholder="Filter by Status"
              value={statusFilter}
              onChange={handleStatusFilter}
              style={{ width: 150, height: "45px" }}
              size="large"
              allowClear
            >
              <Option value="">All</Option>
              <Option value="ACTIVE">Active</Option>
              <Option value="INACTIVE">Inactive</Option>
            </Select>
          </Space>

          {/* Right side (Tabs) */}
          <Space size="middle">
            <Button
              size="large"
              type={activeTab === "CUSTOMER" ? "primary" : "default"}
              onClick={() => handleTabChange("CUSTOMER")}
              icon={<UserOutlined />}
              style={{
                borderRadius: "12px",
                fontWeight: "500",
                minWidth: "140px",
                height: "44px",
                backgroundColor:
                  activeTab === "CUSTOMER" ? "#CDA861" : "#f8fafc",
                borderColor: activeTab === "CUSTOMER" ? "#CDA861" : "#e2e8f0",
                color: activeTab === "CUSTOMER" ? "white" : "#64748b",
              }}
            >
              Customer
            </Button>

            <Button
              size="large"
              type={activeTab === "PROVIDER" ? "primary" : "default"}
              onClick={() => handleTabChange("PROVIDER")}
              icon={<ToolOutlined />}
              style={{
                borderRadius: "12px",
                fontWeight: "500",
                minWidth: "140px",
                height: "44px",
                backgroundColor:
                  activeTab === "PROVIDER" ? "#CDA861" : "#f8fafc",
                borderColor: activeTab === "PROVIDER" ? "#CDA861" : "#e2e8f0",
                color: activeTab === "PROVIDER" ? "white" : "#64748b",
              }}
            >
              Service Provider
            </Button>
          </Space>
        </div>
      </Card>

      {/* Table Card */}
      <Card
        style={{
          borderRadius: "16px",
          // boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "1px solid #e5e7eb",
        }}
        bodyStyle={{ padding: "32px" }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h3
            style={{
              margin: 0,
              color: "#1f2937",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            {activeTab === "CUSTOMER"
              ? "Customer List"
              : "Service Provider List"}
          </h3>
          {/* <p
            style={{ margin: "4px 0 0 0", color: "#6b7280", fontSize: "14px" }}
          >
            Total {data?.pagination?.total || 0}{" "}
            {activeTab === "CUSTOMER" ? "customers" : "service providers"}
          </p> */}
        </div>

        <Spin spinning={isLoading || isFetching}>
          <Table
            columns={columns}
            dataSource={data?.data || []}
            rowKey="_id"
            pagination={{
              current: page,
              total: data?.pagination?.total || 0,
              pageSize: limit,
              // showSizeChanger: true,
              // showQuickJumper: true,
              // showTotal: (total, range) =>
              //   `${range[0]}-${range[1]} of ${total} items`,
              style: { marginTop: "24px" },
              // pageSizeOptions: ["10", "25", "50"],
              onChange: (newPage, newPageSize) => {
                setPage(newPage);
                setLimit(newPageSize);
              },
            }}
            size="middle"
            style={{
              background: "white",
            }}
            scroll={{ x: "max-content" }}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "user-table-row-even" : "user-table-row-odd"
            }
          />
        </Spin>
      </Card>

      <style jsx global>{`
        .user-table-row-even {
          background-color: #fefefe !important;
        }

        .user-table-row-odd {
          background-color: #f9fafb !important;
        }

        .user-table-row-even:hover,
        .user-table-row-odd:hover {
          background-color: #f3f4f6 !important;
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }

        .ant-table-thead > tr > th {
          background: linear-gradient(
            135deg,
            #f8fafc 0%,
            #f1f5f9 100%
          ) !important;
          border-bottom: 2px solid #e2e8f0 !important;
          font-weight: 600 !important;
          color: #374151 !important;
          padding: 20px 16px !important;
          font-size: 14px !important;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ant-table-tbody > tr > td {
          padding: 18px 16px !important;
          border-bottom: 1px solid #f1f5f9 !important;
          font-size: 14px !important;
          color: #374151;
        }

        .ant-table-tbody > tr:last-child > td {
          border-bottom: none !important;
        }

        .ant-pagination-item-active {
          background: linear-gradient(
            135deg,
            #cda861 0%,
            #cda861 100%
          ) !important;
          border-color: #cda861 !important;
        }

        .ant-pagination-item-active a {
          color: white !important;
        }

        .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
          border-color: #cda861 !important;
        }

        .ant-select-focused .ant-select-selector {
          border-color: #cda861 !important;
          box-shadow: 0 0 0 2px rgba(205, 168, 97, 0.2) !important;
        }

        .ant-input:hover {
          border-color: #cda861 !important;
        }

        .ant-input:focus {
          border-color: #cda861 !important;
          box-shadow: 0 0 0 2px rgba(205, 168, 97, 0.2) !important;
        }

        .ant-card {
          backdrop-filter: blur(10px);
        }

        .ant-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(205, 168, 97, 0.3);
          transition: all 0.2s ease;
        }

        .ant-table-wrapper {
          border-radius: 12px;
          overflow: hidden;
        }

        .ant-table {
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
};

export default UserManagement;
