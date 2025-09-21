import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Upload,
  message,
  Dropdown,
  Space,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const ServiceCategorySection = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryPicture: "",
  });
  const [categories, setCategories] = useState([
    {
      key: 1,
      id: 1,
      categoryPicture: "🍔",
      categoryName: "example Service",
      serviceProvider: 50,
      totalJobComplete: 100,
      createdAt: "25 Feb 25",
      status: "Active",
    },
  ]);

  const statusDropdownItems = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];

  // 👉 Create new
  const handleCreateNew = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
    setFormData({ categoryName: "", categoryPicture: "" });
  };

  // 👉 Edit
  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
    setFormData({
      categoryName: record.categoryName,
      categoryPicture: record.categoryPicture,
    });
  };

  // 👉 Delete
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      onOk: () => {
        setCategories(categories.filter((item) => item.id !== id));
        message.success("Category deleted successfully");
      },
    });
  };

  // 👉 Save Modal
  const handleModalOk = () => {
    if (!formData.categoryName.trim()) {
      message.error("Please enter category name");
      return;
    }

    if (editingRecord) {
      setCategories(
        categories.map((item) =>
          item.id === editingRecord.id
            ? { ...item, categoryName: formData.categoryName, categoryPicture: formData.categoryPicture }
            : item
        )
      );
      message.success("Category updated successfully");
    } else {
      const newCategory = {
        key: categories.length + 1,
        id: categories.length + 1,
        categoryPicture: formData.categoryPicture || "🍔",
        categoryName: formData.categoryName,
        serviceProvider: 0,
        totalJobComplete: 0,
        createdAt: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        }),
        status: "Active",
      };
      setCategories([...categories, newCategory]);
      message.success("Category created successfully");
    }
    setIsModalVisible(false);
    setFormData({ categoryName: "", categoryPicture: "" });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setFormData({ categoryName: "", categoryPicture: "" });
  };

  // 👉 Upload props
  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      // convert image to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, categoryPicture: e.target.result });
      };
      reader.readAsDataURL(file);
      return false; // prevent auto upload
    },
    showUploadList: false,
  };

  const columns = [
    {
      title: "SL",
      dataIndex: "id",
      key: "id",
      width: 50,
      align: "center",
    },
    {
      title: "Category Picture",
      dataIndex: "categoryPicture",
      key: "categoryPicture",
      width: 120,
      align: "center",
      render: (picture) => (
        <div
          style={{
            width: 40,
            height: 40,
            backgroundColor: "#f5f5f5",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            margin: "0 auto",
            overflow: "hidden",
          }}
        >
          {picture.startsWith("data:image") ? (
            <img
              src={picture}
              alt="category"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            picture
          )}
        </div>
      ),
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
      width: 150,
    },
    {
      title: "Service Provider",
      dataIndex: "serviceProvider",
      key: "serviceProvider",
      width: 120,
      align: "center",
    },
    {
      title: "Total Job Complete",
      dataIndex: "totalJobComplete",
      key: "totalJobComplete",
      width: 140,
      align: "center",
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 80,
      align: "center",
      render: (status) => (
        <span
          style={{
            color: status === "Active" ? "#52c41a" : "#ff4d4f",
            fontWeight: 500,
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: "#1890ff" }}
            />
          </Tooltip>
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedRecord(record);
                setIsDetailsVisible(true);
              }}
              style={{ color: "#52c41a" }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              style={{ color: "#ff4d4f" }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <div
        style={{
          backgroundColor: "white",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Dropdown menu={{ items: statusDropdownItems }} trigger={["click"]}>
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid #d9d9d9",
              }}
            >
              🔄 Active <DownOutlined />
            </Button>
          </Dropdown>

          <Button
            type="primary"
            onClick={handleCreateNew}
            style={{
              backgroundColor: "#d4a574",
              borderColor: "#d4a574",
              fontWeight: 500,
            }}
          >
            Create New Category
          </Button>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={categories}
          pagination={false}
          bordered
          size="middle"
          scroll={{ x: 800 }}
          rowClassName={() => "table-row"}
        />

        {/* Create/Edit Modal */}
        <Modal
          title={editingRecord ? "Edit Category" : "Create New Category"}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          width={400}
          centered
          okText="Done"
          cancelText="Cancel"
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#fff7e6",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                margin: "0 auto 16px",
                border: "2px solid #d4a574",
                overflow: "hidden",
              }}
            >
              {formData.categoryPicture ? (
                <img
                  src={formData.categoryPicture}
                  alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                "🍔"
              )}
            </div>
          </div>

          <div>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 500,
                  color: "#262626",
                }}
              >
                Category Name
              </label>
              <Input
                placeholder="Enter Your Category Name"
                value={formData.categoryName}
                onChange={(e) =>
                  setFormData({ ...formData, categoryName: e.target.value })
                }
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 500,
                  color: "#262626",
                }}
              >
                Category Picture
              </label>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                  Choose File
                </Button>
              </Upload>
            </div>
          </div>
        </Modal>

        {/* Details Modal */}
        <Modal
          title="Category Details"
          open={isDetailsVisible}
          onCancel={() => setIsDetailsVisible(false)}
          footer={null}
          width={400}
          centered
        >
          {selectedRecord && (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  margin: "0 auto 16px",
                  borderRadius: "50%",
                  border: "2px solid #d4a574",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selectedRecord.categoryPicture.startsWith("data:image") ? (
                  <img
                    src={selectedRecord.categoryPicture}
                    alt="category"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  selectedRecord.categoryPicture
                )}
              </div>
              <h3>{selectedRecord.categoryName}</h3>
              <p>
                <strong>Service Provider:</strong>{" "}
                {selectedRecord.serviceProvider}
              </p>
              <p>
                <strong>Total Job Complete:</strong>{" "}
                {selectedRecord.totalJobComplete}
              </p>
              <p>
                <strong>Created At:</strong> {selectedRecord.createdAt}
              </p>
              <p>
                <strong>Status:</strong> {selectedRecord.status}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ServiceCategorySection;
