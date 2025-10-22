import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Upload,
  message,
  Space,
  Tooltip,
  Badge,
  Card,
  Switch,
  Select,
  Form,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
// import { useGetServiceCategoryQuery } from "../../redux/apiSlices/serviceCategoryApi";
import {
  useGetServiceCategoryQuery,
  useCreateServiceCategoryMutation,
  useUpdateServiceCategoryMutation,
  useDeleteServiceCategoryMutation,
} from "../../redux/apiSlices/serviceCategoryApi";
import { getImageUrl } from "../common/imageUrl";

const ServiceCategorySection = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const queryParams = [
    { name: "page", value: currentPage },
    { name: "limit", value: perPage },
  ];

  if (searchText) queryParams.push({ name: "searchTerm", value: searchText });
  if (statusFilter && statusFilter !== "all")
    queryParams.push({ name: "status", value: statusFilter });

  // API Hooks
  const {
    data: categoriesData,
    isLoading,
    refetch,
  } = useGetServiceCategoryQuery(queryParams);
  console.log("categoriesData", categoriesData);
  const [createCategory, { isLoading: isCreating }] =
    useCreateServiceCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateServiceCategoryMutation();
  const [deleteCategory] = useDeleteServiceCategoryMutation();

  //   console.log(categoriesData)
  //   useEffect(() => {
  //     const newFilters = [
  //       { name: "page", value: currentPage },
  //       { name: "limit", value: perPage },
  //     ];

  //     if (searchText) {
  //       newFilters.push({ name: "searchTerm", value: searchText });
  //     }

  //     setStatusFilter(newFilters);
  //   }, [currentPage, perPage, searchText]);

  const categories = categoriesData?.data?.data || [];
  const totalCategories = categoriesData?.data?.metadata?.total || 0;
  console.log("categories", categories);
  const modalLoading = isCreating || isUpdating;

  // Filter categories based on search and status
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      category.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Set form values when editing
  useEffect(() => {
    if (isModalVisible && editingRecord) {
      form.setFieldsValue({
        name: editingRecord.name,
      });
      setImagePreview(editingRecord.image || "");
      setImageFile(null);
    } else if (isModalVisible) {
      form.resetFields();
      setImagePreview("");
      setImageFile(null);
    }
  }, [isModalVisible, editingRecord, form]);

  // Create new category
  const handleCreateNew = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
  };

  // Edit category
  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  // Delete category
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete Category",
      content:
        "Are you sure you want to delete this category? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteCategory(id).unwrap();
          message.success("Category deleted successfully");
          refetch();
        } catch (error) {
          message.error(error?.data?.message || "Failed to delete category");
        }
      },
    });
  };

  // Toggle status
  const toggleStatus = async (record) => {
    try {
      const newStatus = record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const formData = new FormData();
      formData.append("name", record.name);
      formData.append("status", newStatus);

      await updateCategory({ id: record._id, data: formData }).unwrap();
      message.success("Status updated successfully");
      refetch();
    } catch (error) {
      message.error(error?.data?.message || "Failed to update status");
    }
  };

  // Upload props
  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
        return false;
      }

      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      message.success("Image uploaded successfully");
      return false;
    },
    showUploadList: false,
    fileList: [],
  };

  // Handle modal submit
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("name", values.name);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingRecord) {
        // Update existing category
        await updateCategory({
          id: editingRecord._id,
          data: formData,
        }).unwrap();
        message.success("Category updated successfully");
      } else {
        // Create new category
        await createCategory(formData).unwrap();
        message.success("Category created successfully");
      }

      refetch();
      handleModalClose();
    } catch (error) {
      if (error.errorFields) {
        // Form validation error
        return;
      }
      message.error(
        error?.data?.message ||
          `Failed to ${editingRecord ? "update" : "create"} category`
      );
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    form.resetFields();
    setImageFile(null);
    setImagePreview("");
    setEditingRecord(null);
  };

  const columns = [
    {
      title: "SL",
      dataIndex: "_id",
      key: "_id",
      width: 60,
      align: "center",
      render: (id, _, index) => (
        <Badge count={index + 1} style={{ backgroundColor: "#1890ff" }} />
      ),
    },
    {
      title: "Category",
      key: "category",
      width: 250,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 45,
              height: 45,
              backgroundColor: "#f8f9fa",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              border: "2px solid #e9ecef",
              overflow: "hidden",
            }}
          >
            {record.image ? (
              <img
                src={getImageUrl(record.image)}
                alt="category"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              "📋"
            )}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "#262626", fontSize: 14 }}>
              {record.name}
            </div>
            {/* <div style={{ color: "#8c8c8c", fontSize: 12 }}>
              {record.description || "No description"}
            </div> */}
          </div>
        </div>
      ),
    },
    {
      title: "Total Providers",
      dataIndex: "totalProviders",
      key: "totalProviders",
      width: 250,
      align: "center",
    
    },
    {
      title: "Total Jobs",
      dataIndex: "totalJobs",
      key: "totalJobs",
      width: 250,
      align: "center",
    
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      align: "center",
      render: (date) => (
        <span style={{ color: "#595959", fontSize: 12 }}>
          {new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center",
      render: (status, record) => (
        <Switch
          checked={status === "ACTIVE"}
          onChange={() => toggleStatus(record)}
          size="medium"
        />
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 130,
      align: "center",
      render: (_, record) => (
        <Space size={4}>
          {/* <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedRecord(record);
                setIsDetailsVisible(true);
              }}
              style={{ color: "#1890ff" }}
              size="small"
            />
          </Tooltip> */}
          <Tooltip title="Edit Category">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: "#CDA861" }}
              size="large"
            />
          </Tooltip>
          <Tooltip title="Delete Category">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
              style={{ color: "#ff4d4f" }}
              size="large"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", padding: 12 }}>
      <Card
        style={{
          borderRadius: 12,
          border: "1px solid #e9ecef",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Input
              placeholder="Search categories..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250, height: 45 }}
            />

            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120, height: 45 }}
              suffixIcon={<FilterOutlined />}
            >
              <Select.Option value="all">All Status</Select.Option>
              <Select.Option value="ACTIVE">Active</Select.Option>
              <Select.Option value="INACTIVE">Inactive</Select.Option>
            </Select>

            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchText("");
                setStatusFilter("all");
                setCurrentPage(1);
                setPerPage(10);
                refetch();
                message.success("Filters cleared");
              }}
              style={{ height: 45, width: 120 }}
            >
              Reset
            </Button>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateNew}
              style={{
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                height: 45,
                paddingLeft: 20,
                paddingRight: 20,
              }}
              className="bg-primary"
            >
              Create Category
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={categories}
          loading={isLoading}
          rowKey="_id"
          pagination={{
            current: currentPage,
            pageSize: perPage,
            total: totalCategories,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPerPage(pageSize);
            },
            // showSizeChanger: true,
            // showQuickJumper: true,
            // showTotal: (total, range) =>
            //   `${range[0]}-${range[1]} of ${total} categories`,
          }}
          bordered={false}
          size="middle"
          scroll={{ x: 1000 }}
        />

        {/* Create/Edit Modal */}
        <Modal
          title={
            <div style={{ textAlign: "center", paddingBottom: 10 }}>
              <h3 style={{ margin: 0, color: "#CDA861" }}>
                {editingRecord ? "Edit Category" : "Create New Category"}
              </h3>
            </div>
          }
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalClose}
          width={500}
          centered
          okText="Save Changes"

          cancelText="Cancel"
          confirmLoading={modalLoading}
          okButtonProps={{
            style: {
              background: "linear-gradient(45deg, #CDA861, #CDA861)",
              border: "none",
              borderRadius: 6,
              height: 45,
            },
          }}
          cancelButtonProps={{
            style: {
              height: 45,
              width: 120,
            },
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div
              style={{
                width: 80,
                height: 80,
                backgroundColor: "#f8f9fa",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                margin: "0 auto 16px",
                border: "3px solid #CDA861",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {imagePreview ? (
                <img
                  src={
                    typeof imagePreview === "string" &&
                    (imagePreview.startsWith("blob:") ||
                      imagePreview.startsWith("data:"))
                      ? imagePreview
                      : getImageUrl(imagePreview)
                  }
                  alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                "📋"
              )}
            </div>

            <Upload {...uploadProps}>
              <Button
                icon={<UploadOutlined />}
                style={{
                  borderRadius: 20,
                  borderColor: "#CDA861",
                  color: "#CDA861",
                  height: 45,
                }}
              >
                Upload Image
              </Button>
            </Upload>
          </div>

          <Form form={form} layout="vertical">
            <Form.Item
              label="Category Name"
              name="name"
              rules={[
                { required: true, message: "Please enter category name" },
                {
                  min: 2,
                  message: "Category name must be at least 2 characters",
                },
              ]}
            >
              <Input
                placeholder="Enter category name"
                style={{ borderRadius: 8 , height: 45}}
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* Details Modal */}
        {/* <Modal
          title={
            <div style={{ textAlign: "center" }}>
              <h3 style={{ margin: 0, color: "#CDA861" }}>Category Details</h3>
            </div>
          }
          open={isDetailsVisible}
          onCancel={() => setIsDetailsVisible(false)}
          footer={[
            <Button
              key="close"
              onClick={() => setIsDetailsVisible(false)}
              style={{ borderRadius: 6 }}
            >
              Close
            </Button>,
          ]}
          width={500}
          centered
        >
          {selectedRecord && (
            <div style={{ padding: 20 }}>
              <div style={{ textAlign: "center", marginBottom: 30 }}>
                <div
                  style={{
                    width: 100,
                    height: 100,
                    margin: "0 auto 20px",
                    borderRadius: "50%",
                    border: "4px solid #CDA861",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 40,
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  {selectedRecord.image ? (
                    <img
                      src={getImageUrl(selectedRecord.image)}
                      alt="category"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "📋"
                  )}
                </div>
                <h2 style={{ color: "#262626", marginBottom: 10 }}>
                  {selectedRecord.name}
                </h2>
                {selectedRecord.description && (
                  <p style={{ color: "#8c8c8c", fontSize: 14 }}>
                    {selectedRecord.description}
                  </p>
                )}
              </div>

              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  backgroundColor: "#fafafa",
                  borderRadius: 8,
                }}
              >
                <Row>
                  <Col span={12}>
                    <strong>Created:</strong>{" "}
                    {new Date(selectedRecord.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    <Badge
                      status={
                        selectedRecord.status === "ACTIVE"
                          ? "success"
                          : "default"
                      }
                      text={
                        <strong style={{ textTransform: "capitalize" }}>
                          {selectedRecord.status}
                        </strong>
                      }
                    />
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </Modal> */}
      </Card>
    </div>
  );
};

export default ServiceCategorySection;
