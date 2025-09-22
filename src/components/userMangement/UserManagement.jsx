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
  Row,
  Col,
  Menu,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
  UserOutlined,
  BellOutlined,
  ToolOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const UserManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("customer");

  // Customer data
  const customerData = [
    {
      key: 1,
      sl: 1,
      userName: "Ahmed Hassan",
      email: "ahmed@example.com",
      location: "Dhaka, Bangladesh",
      phoneNumber: "01712-345678",
      joiningDate: "15-01-2024",
      service: "No",
      status: "Active",
    },
    {
      key: 2,
      sl: 2,
      userName: "Sarah Khan",
      email: "sarah.khan@email.com",
      location: "Chittagong, BD",
      phoneNumber: "01855-987654",
      joiningDate: "22-12-2023",
      service: "Yes",
      status: "Inactive",
    },
    {
      key: 3,
      sl: 3,
      userName: "Rahul Ahmed",
      email: "rahul.a@company.com",
      location: "Sylhet, Bangladesh",
      phoneNumber: "01923-456789",
      joiningDate: "08-03-2024",
      service: "Yes",
      status: "Active",
    },
    {
      key: 4,
      sl: 4,
      userName: "Maria Islam",
      email: "maria.islam@gmail.com",
      location: "Rajshahi, BD",
      phoneNumber: "01734-567890",
      joiningDate: "30-11-2023",
      service: "No",
      status: "Inactive",
    },
    {
      key: 5,
      sl: 5,
      userName: "Karim Uddin",
      email: "karim.u@outlook.com",
      location: "Khulna, Bangladesh",
      phoneNumber: "01656-789012",
      joiningDate: "14-02-2024",
      service: "Yes",
      status: "Active",
    },
  ];

  // Service Provider data
  const serviceProviderData = [
    {
      key: 1,
      sl: 1,
      userName: "Dr. Fazlul Haque",
      email: "dr.fazlul@medical.com",
      location: "Dhaka Medical College",
      phoneNumber: "01711-234567",
      joiningDate: "10-01-2023",
      service: "Medical",
      status: "Active",
    },
    {
      key: 2,
      sl: 2,
      userName: "Engineer Nasir",
      email: "nasir.eng@tech.bd",
      location: "BUET, Dhaka",
      phoneNumber: "01812-345678",
      joiningDate: "25-06-2023",
      service: "Technical",
      status: "Active",
    },
    {
      key: 3,
      sl: 3,
      userName: "Chef Rahman",
      email: "chef.rahman@food.com",
      location: "Gulshan, Dhaka",
      phoneNumber: "01987-654321",
      joiningDate: "18-09-2023",
      service: "Catering",
      status: "Inactive",
    },
    {
      key: 4,
      sl: 4,
      userName: "Lawyer Sultana",
      email: "adv.sultana@law.bd",
      location: "Supreme Court, Dhaka",
      phoneNumber: "01766-543210",
      joiningDate: "05-04-2023",
      service: "Legal",
      status: "Inactive",
    },
    {
      key: 5,
      sl: 5,
      userName: "Teacher Hasan",
      email: "prof.hasan@edu.bd",
      location: "Dhaka University",
      phoneNumber: "01623-987654",
      joiningDate: "12-08-2023",
      service: "Education",
      status: "Active",
    },
  ];

  // Get current data based on active tab
  const currentData =
    activeTab === "customer" ? customerData : serviceProviderData;

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return currentData.filter((item) => {
      const matchesSearch =
        searchText === "" ||
        item.userName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase()) ||
        item.location.toLowerCase().includes(searchText.toLowerCase()) ||
        item.phoneNumber.includes(searchText);

      const matchesStatus = statusFilter === "" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter, currentData]);

  // Handle status change
  const handleStatusChange = (record, newStatus) => {
    console.log(`Changing status of ${record.userName} to ${newStatus}`);
    // Here you would typically update your data source
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#52c41a";
      case "Inactive":
        return "#ff4d4f";
      case "Pending":
        return "#faad14";
      default:
        return "#d9d9d9";
    }
  };

  const statusMenu = (record) => (
    <Menu
      items={[
        {
          key: "Active",
          label: "Active",
          onClick: () => handleStatusChange(record, "Active"),
        },
        {
          key: "Inactive",
          label: "Inactive",
          onClick: () => handleStatusChange(record, "Inactive"),
        },
      ]}
    />
  );

  const columns = [
    {
      title: "SL",
      dataIndex: "sl",
      key: "sl",
      width: 60,
      align: "center",
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      width: 150,
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar
            size="small"
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1890ff" }}
          />
          <span style={{ fontWeight: "500" }}>{text}</span>
        </div>
      ),
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
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 150,
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      key: "joiningDate",
      width: 130,
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
      width: 100,
      align: "center",
      render: (service) => <Tag color="blue">{service}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "none",
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
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                width: 300,
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                fontSize: "14px",
              }}
              size="large"
            />

            <Select
              placeholder="Filter by Status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
              size="large"
              allowClear
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
              <Option value="Pending">Pending</Option>
            </Select>
          </Space>

          {/* Right side (Tabs) */}
          <Space size="middle">
            <Button
              size="large"
              type={activeTab === "customer" ? "primary" : "default"}
              onClick={() => setActiveTab("customer")}
              icon={<UserOutlined />}
              style={{
                borderRadius: "12px",
                fontWeight: "500",
                minWidth: "140px",
                height: "44px",
                backgroundColor:
                  activeTab === "customer" ? "#CDA861" : "#f8fafc",
                borderColor: activeTab === "customer" ? "#CDA861" : "#e2e8f0",
                color: activeTab === "customer" ? "white" : "#64748b",
              }}
            >
              Customer
            </Button>

            <Button
              size="large"
              type={activeTab === "serviceProvider" ? "primary" : "default"}
              onClick={() => setActiveTab("serviceProvider")}
              icon={<ToolOutlined />}
              style={{
                borderRadius: "12px",
                fontWeight: "500",
                minWidth: "140px",
                height: "44px",
                backgroundColor:
                  activeTab === "serviceProvider" ? "#CDA861" : "#f8fafc",
                borderColor:
                  activeTab === "serviceProvider" ? "#CDA861" : "#e2e8f0",
                color: activeTab === "serviceProvider" ? "white" : "#64748b",
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
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "none",
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
            {activeTab === "customer"
              ? "Customer List"
              : "Service Provider List"}
          </h3>
          <p
            style={{ margin: "4px 0 0 0", color: "#6b7280", fontSize: "14px" }}
          >
            Total {filteredData.length}{" "}
            {activeTab === "customer" ? "customers" : "service providers"}
          </p>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            current: 1,
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            style: { marginTop: "24px" },
            pageSizeOptions: ["10", "25", "50"],
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
            ##CDA861 0%,
            #764ba2 100%
          ) !important;
          border-color: ##CDA861 !important;
          color: black !important;
        }

        .ant-pagination-item-active a {
          color: black !important;
        }

        .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
          border-color: ##CDA861 !important;
        }

        .ant-select-focused .ant-select-selector {
          border-color: ##CDA861 !important;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
        }

        .ant-input:hover {
          border-color: ##CDA861 !important;
        }

        .ant-input:focus {
          border-color: ##CDA861 !important;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
        }

        .ant-card {
          backdrop-filter: blur(10px);
        }

        .ant-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
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
