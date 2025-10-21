// Save modal
  const handleModalOk = () => {
    if (!formData.categoryName.trim()) {
      message.error("Please enter category name");
      return;
    }

    if (formData.categoryName.length < 2) {
      message.error("Category name must be at least 2 characters");
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      if (editingRecord) {
        setCategories(
          categories.map((item) =>
            item.id === editingRecord.id
              ? { 
                  ...item, 
                  categoryName: formData.categoryName,
                  description: formData.description,
                  categoryPicture: formData.categoryPicture || item.categoryPicture 
                }
              : item
          )
        );
        message.success("Category updated successfully");
      } else {
        const newCategory = {
          key: categories.length + 1,
          id: categories.length + 1,
          categoryPicture: formData.categoryPicture || "📋",
          categoryName: formData.categoryName,
          description: formData.description,
          serviceProvider: 0,
          totalJobComplete: 0,
          createdAt: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: "Active",
        };
        setCategories([...categories, newCategory]);
        message.success("Category created successfully");
      }
      
      setIsModalVisible(false);
      setFormData({ categoryName: "", categoryPicture: "", description: "" });
      setLoading(false);
    }, 800);
  };import React, { useState, useEffect } from "react";
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
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  UploadOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

const ServiceCategorySection = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryPicture: "",
    description: "",
  });
  
  const [categories, setCategories] = useState([
    {
      key: 1,
      id: 1,
      categoryPicture: "🍔",
      categoryName: "Food Service",
      description: "Restaurant and food delivery services",
      serviceProvider: 50,
      totalJobComplete: 100,
      createdAt: "25 Feb 2025",
      status: "Active",
    },
    {
      key: 2,
      id: 2,
      categoryPicture: "🚗",
      categoryName: "Transportation",
      description: "Car rental and ride sharing services",
      serviceProvider: 25,
      totalJobComplete: 75,
      createdAt: "20 Feb 2025",
      status: "Active",
    },
    {
      key: 3,
      id: 3,
      categoryPicture: "🏠",
      categoryName: "Home Services",
      description: "Cleaning, repair and maintenance services",
      serviceProvider: 35,
      totalJobComplete: 120,
      createdAt: "15 Feb 2025",
      status: "Inactive",
    },
  ]);

  const statusDropdownItems = [
    { key: "all", label: "All Status" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];

  // Filter categories based on search and status
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.categoryName.toLowerCase().includes(searchText.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || category.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.status === 'Active').length;
  const totalProviders = categories.reduce((sum, c) => sum + c.serviceProvider, 0);
  const totalJobs = categories.reduce((sum, c) => sum + c.totalJobComplete, 0);

  // Create new category
  const handleCreateNew = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
    setFormData({ categoryName: "", categoryPicture: "", description: "" });
    form.resetFields();
  };

  // Edit category
  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
    setFormData({
      categoryName: record.categoryName,
      categoryPicture: record.categoryPicture,
      description: record.description || "",
    });
    form.setFieldsValue({
      categoryName: record.categoryName,
      description: record.description || "",
    });
  };

  // Delete category
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete Category",
      content: "Are you sure you want to delete this category? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        setLoading(true);
        setTimeout(() => {
          setCategories(categories.filter((item) => item.id !== id));
          message.success("Category deleted successfully");
          setLoading(false);
        }, 500);
      },
    });
  };

  // Toggle status
  const toggleStatus = (id) => {
    setCategories(categories.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' }
        : item
    ));
    message.success("Status updated successfully");
  };

  // Save modal
  const handleModalOk = () => {
    if (!formData.categoryName.trim()) {
      message.error("Please enter category name");
      return;
    }

    if (formData.categoryName.length < 2) {
      message.error("Category name must be at least 2 characters");
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      if (editingRecord) {
        setCategories(
          categories.map((item) =>
            item.id === editingRecord.id
              ? { 
                  ...item, 
                  categoryName: formData.categoryName,
                  description: formData.description,
                  categoryPicture: formData.categoryPicture || item.categoryPicture 
                }
              : item
          )
        );
        message.success("Category updated successfully");
      } else {
        const newCategory = {
          key: categories.length + 1,
          id: categories.length + 1,
          categoryPicture: formData.categoryPicture || "📋",
          categoryName: formData.categoryName,
          description: formData.description,
          serviceProvider: 0,
          totalJobComplete: 0,
          createdAt: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: "Active",
        };
        setCategories([...categories, newCategory]);
        message.success("Category created successfully");
      }
      
      setIsModalVisible(false);
      setFormData({ categoryName: "", categoryPicture: "", description: "" });
      setLoading(false);
    }, 800);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setFormData({ categoryName: "", categoryPicture: "", description: "" });
    form.resetFields();
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
        message.error('Image must be smaller than 2MB!');
        return false;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, categoryPicture: e.target.result });
        message.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
      return false;
    },
    showUploadList: false,
  };

  const columns = [
    {
      title: "SL",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
      render: (id, _, index) => (
        <Badge count={index + 1} style={{ backgroundColor: '#1890ff' }} />
      ),
    },
    {
      title: "Category",
      key: "category",
      width: 250,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
            {record.categoryPicture?.startsWith("data:image") ? (
              <img
                src={record.categoryPicture}
                alt="category"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              record.categoryPicture
            )}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#262626', fontSize: 14 }}>
              {record.categoryName}
            </div>
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>
              {record.description || 'No description'}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Providers",
      dataIndex: "serviceProvider",
      key: "serviceProvider",
      width: 100,
      align: "center",
      render: (count) => (
        <Statistic 
          value={count} 
          valueStyle={{ fontSize: 14, fontWeight: 600, color: '#1890ff' }}
        />
      ),
    },
    {
      title: "Completed Jobs",
      dataIndex: "totalJobComplete",
      key: "totalJobComplete",
      width: 120,
      align: "center",
      render: (count) => (
        <Statistic 
          value={count} 
          valueStyle={{ fontSize: 14, fontWeight: 600, color: '#52c41a' }}
        />
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      align: "center",
      render: (date) => (
        <span style={{ color: '#595959', fontSize: 12 }}>{date}</span>
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
          checked={status === "Active"}
          onChange={() => toggleStatus(record.id)}
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
          <Tooltip title="View Details">
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
          </Tooltip>
          <Tooltip title="Edit Category">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: "#52c41a" }}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete Category">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              style={{ color: "#ff4d4f" }}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ minHeight:  "100vh", padding: 12,  }}>
      

      {/* Main Content */}
      <Card 
        style={{ 
          borderRadius: 12, 
          // boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: '1px solid #e9ecef'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 16
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
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
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>

            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => {
                setSearchText('');
                setStatusFilter('all');
                message.success('Filters cleared');
              }}
              style={{ height: 45, width: 120 }}
            >
              Reset
            </Button>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
           

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateNew}
              style={{
               
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                height: 40,
                paddingLeft: 20,
                paddingRight: 20,
              }}
              className="bg-primary"
            >
              Create Category
            </Button>
          </div>
        </div>

        {/* Content */}
     
          <Table
            columns={columns}
            dataSource={filteredCategories}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} categories`,
            }}
            bordered={false}
            size="middle"
            scroll={{ x: 1000 }}
            rowClassName={() => "table-row"}
            style={{ 
              borderRadius: 8,
              overflow: 'hidden'
            }}
          />
       

        {/* Create/Edit Modal */}
        <Modal
          title={
            <div style={{ textAlign: 'center', paddingBottom: 10 }}>
              <h3 style={{ margin: 0, color: '#CDA861' }}>
                {editingRecord ? "Edit Category" : "Create New Category"}
              </h3>
            </div>
          }
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          width={500}
          centered
          okText="Save Changes"
          cancelText="Cancel"
          confirmLoading={loading}
          okButtonProps={{
            style: {
              background: "linear-gradient(45deg, #CDA861, #CDA861)",
              border: "none",
              borderRadius: 6,
            }
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
                position: 'relative'
              }}
            >
              {formData.categoryPicture ? (
                <img
                  src={formData.categoryPicture}
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
                style={{ borderRadius: 20, borderColor: '#CDA861', color: '#CDA861' }}
              >
                Upload Image
              </Button>
            </Upload>
          </div>

          <div>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: "#262626",
                }}
              >
                Category Name *
              </label>
              <Input
                placeholder="Enter category name"
                value={formData.categoryName}
                onChange={(e) =>
                  setFormData({ ...formData, categoryName: e.target.value })
                }
                style={{ borderRadius: 8 }}
              />
            </div>

            {/* <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                  color: "#262626",
                }}
              >
                Description (Optional)
              </label>
              <Input.TextArea
                placeholder="Enter category description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                style={{ borderRadius: 8 }}
                maxLength={200}
                showCount
              />
            </div> */}
          </div>
        </Modal>

        {/* Details Modal */}
        <Modal
          title={
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: 0, color: '#CDA861' }}>Category Details</h3>
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
            </Button>
          ]}
          width={500}
          centered
        >
          {selectedRecord && (
            <div style={{ padding: 20 }}>
              <div style={{ textAlign: 'center', marginBottom: 30 }}>
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
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  {selectedRecord.categoryPicture?.startsWith("data:image") ? (
                    <img
                      src={selectedRecord.categoryPicture}
                      alt="category"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    selectedRecord.categoryPicture
                  )}
                </div>
                <h2 style={{ color: '#262626', marginBottom: 10 }}>
                  {selectedRecord.categoryName}
                </h2>
             
              </div>

              <Row gutter={16}>
                <Col span={12}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Statistic
                      title="Service Providers"
                      value={selectedRecord.serviceProvider}
                      valueStyle={{ color: '#CDA861', fontSize: 20 }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Statistic
                      title="Completed Jobs"
                      value={selectedRecord.totalJobComplete}
                      valueStyle={{ color: '#CDA861', fontSize: 20 }}
                    />
                  </Card>
                </Col>
              </Row>

              <div style={{ marginTop: 20, padding: 16, backgroundColor: '#fafafa', borderRadius: 8 }}>
                <Row>
                  <Col span={12}>
                    <strong>Created:</strong> {selectedRecord.createdAt}
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                    <Badge 
                      status={selectedRecord.status === 'Active' ? 'success' : 'default'} 
                      text={<strong>{selectedRecord.status}</strong>}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default ServiceCategorySection;