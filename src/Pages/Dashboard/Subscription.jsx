import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  List,
  message,
  Select,
  Radio,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import FeaturedInput from "../../components/common/PackageFeatureInput";
import GradientButton from "../../components/common/GradiantButton";
import SubscriptionHeadingIcon from "../../assets/subscription-heading.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  useCreateSubscriptionPackageMutation,
  useUpdateSubscriptionPackageMutation,
  useGetAllSubscriptionPackageQuery,
} from "../../redux/apiSlices/subscriptionPackageApi";

const PackagesPlans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState("google");
  const [form] = Form.useForm();

  // API hooks
  const {
    data: packagesData,
    isLoading: isLoadingPackages,
    refetch,
  } = useGetAllSubscriptionPackageQuery([]);
  const [createPackage, { isLoading: isCreating }] =
    useCreateSubscriptionPackageMutation();
  const [updatePackage, { isLoading: isUpdating }] =
    useUpdateSubscriptionPackageMutation();

  // Extract packages from API response
  const packages = packagesData?.data || [];

  const togglePackageStatus = async (id, currentStatus) => {
    try {
      await updatePackage({ id, data: { isActive: !currentStatus } }).unwrap();
      refetch();
      message.success("Package status updated");
    } catch (error) {
      message.error(error?.data?.message || "Failed to update package status");
    }
  };

  const showModal = (pkg = null) => {
    setIsEditing(!!pkg);
    setCurrentPackage(pkg);
    setIsModalOpen(true);

    if (pkg) {
      const platform = pkg.googleProductId ? "google" : "apple";
      setSelectedPlatform(platform);

      form.setFieldsValue({
        title: pkg.title,
        description: pkg.description,
        price: Number(pkg.price),
        billingCycle: pkg.billingCycle || "monthly",
        platform: platform,
        productId: pkg.googleProductId || pkg.appleProductId || "",
        features: pkg.features || [],
        bookingLimit: pkg.bookingLimit || 0,
        isActive: pkg.isActive !== undefined ? pkg.isActive : true,
      });
    } else {
      setSelectedPlatform("google");
      form.resetFields();
      form.setFieldsValue({
        platform: "google",
        isActive: true,
        billingCycle: "monthly",
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedPlatform("google");
    form.resetFields();
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this package!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#023F86",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // TODO: Implement delete API call when backend is ready
        // await deletePackage(id).unwrap();
        refetch();
        Swal.fire({
          title: "Deleted!",
          text: "The package has been deleted.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleSubmit = async (values) => {
    const formattedData = {
      title: values.title,
      description: values.description,
      price: Number(values.price),
      billingCycle: values.billingCycle,
      features: values.features.filter((f) => f.trim() !== ""),
      isActive: values.isActive !== undefined ? values.isActive : true,
      bookingLimit: Number(values.bookingLimit),
    };

    // Add platform-specific product ID
    if (values.platform === "google") {
      formattedData.googleProductId = values.productId;
    } else {
      formattedData.appleProductId = values.productId;
    }

    try {
      if (isEditing) {
        await updatePackage({
          id: currentPackage._id,
          data: formattedData,
        }).unwrap();
        message.success("Package updated successfully");
      } else {
        await createPackage({ data: formattedData }).unwrap();
        message.success("Package created successfully");
      }

      refetch();
      setIsModalOpen(false);
      setSelectedPlatform("google");
      form.resetFields();
    } catch (error) {
      message.error(error?.data?.message || "Failed to save package");
    }
  };

  const getCardStyle = (pkg) => {
    if (pkg.popular) {
      return "shadow-sm rounded-xl  bg-gradient-to-b from-blue-50 to-white hover:shadow-md transition-all transform hover:-translate-y-1";
    }
    return "shadow-sm rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all transform hover:-translate-y-1";
  };

  // react-slick settings
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: "0px",
    slidesToScroll: 1,
    focusOnSelect: true,
    arrows: true,
    dots: true, // ✅ Enable dots
    customPaging: (i) => (
      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
    ),
    appendDots: (dots) => (
      <div style={{ bottom: "-30px" }}>
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="pt-1 px-4">
      <div className="flex flex-col justify-end w-full items-center mb-8">
        <div className="flex justify-between items-center w-full mb-4">
          <div className="flex-1 flex flex-col items-center">
            <h2 className="text-[28px] font-semibold text-primary">
              All Packages & Plans
            </h2>
            {/* <p className="text-[15px] font-normal mb-[10px]">
              Simple, transparent pricing that grows with you. Try any plan free for
              30 days.
            </p> */}
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-primary text-white px-5 rounded-lg h-12 shadow-lg hover:bg-[#012F60] transition-all flex items-center"
            onClick={() => showModal()}
          >
            Add Package
          </Button>
        </div>
        {/* <Button
          type="primary"
          icon={<PlusOutlined />}
          className=" text-white px-5  rounded-lg h-12 shadow-lg hover:bg-[#012F60] transition-all flex items-center"
          onClick={() => showModal()}
        >
          Add Package
        </Button> */}
      </div>
      <div className="flex justify-center">
        <div className="w-3/4 mb-6">
          {isLoadingPackages ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">Loading packages...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No packages available.</p>
              <p>
                Click the "Add Package" button to create your first package.
              </p>
            </div>
          ) : (
            <Slider {...settings}>
              {packages.map((pkg) => (
                <div key={pkg.id} className="px-4">
                  <Card
                    title={null}
                    bordered={false}
                    className={`${getCardStyle(
                      pkg
                    )} transition-transform duration-300 h-full flex flex-col`}
                  >
                    <div className="flex justify-end mb-2">
                      <div className="flex gap-2">
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => showModal(pkg)}
                          className="text-gray-800 border-gray-800 hover:text-primary hover:border-primary"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-center mb-4">
                      {/* <img
                        src={SubscriptionHeadingIcon}
                        alt="Subscription Icon"
                        className="w-[40px] h-[40px] mb-4"
                      /> */}
                      <h3 className="text-[20px] font-semibold text-primary mb-[8px]">
                        {pkg.title}
                      </h3>
                      <div className="mb-2">
                        <span className="text-secondary font-semibold text-[38px]">
                          ${pkg.price}
                        </span>
                        <span className="text-gray-500 text-[16px]">
                          /{pkg.billingCycle || "month"}
                        </span>
                      </div>
                      <p className="text-[16px] font-normal text-center text-[#667085]">
                        {pkg.description}
                      </p>

                      {/* Platform & Product ID Info */}
                      <div className="mt-3 w-full">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-1">
                          <span className="font-medium">
                            {pkg.googleProductId
                              ? "📱 Google Play"
                              : "🍎 Apple Store"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          ID:{" "}
                          {pkg.googleProductId || pkg.appleProductId || "N/A"}
                        </div>
                        {pkg.bookingLimit && (
                          <div className="text-xs text-gray-500 text-center mt-1">
                            Booking Limit: {pkg.bookingLimit}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg flex-grow overflow-y-auto">
                      <List
                        size="small"
                        dataSource={pkg.features}
                        renderItem={(feature) => (
                          <List.Item className="text-gray-700 border-none py-1">
                            <div className="flex items-start">
                              <CheckCircleFilled className="text-green-500 mr-2 mt-1" />
                              <span>{feature}</span>
                            </div>
                          </List.Item>
                        )}
                      />
                    </div>

                    {/* <Button
                      className={`w-full mt-12 h-12 border ${pkg.active
                        ? "border-primary hover:!bg-primary hover:!text-white"
                        : "border-gray-400 text-gray-400 hover:!bg-gray-400 hover:!text-white"
                        }`}
                      onClick={() => togglePackageStatus(pkg._id, pkg.isActive)}
                    >
                      {pkg.isActive ? "Turn Off" : "Turn On"}
                    </Button> */}
                  </Card>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>

      <Modal
        title={isEditing ? "Edit Package" : "Add Package"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        className="rounded-lg"
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="flex gap-4">
            <Form.Item
              name="title"
              label="Package Title"
              rules={[{ required: true, message: "Title is required" }]}
              className="w-1/2 mb-2"
            >
              <Input placeholder="e.g. Pro yearly Plan" className="h-[44px] " />
            </Form.Item>

            <Form.Item
              name="bookingLimit"
              label="Booking Limit"
              rules={[{ required: true, message: "Booking limit is required" }]}
              className="w-1/2 mb-2"
            >
              <Input
                type="number"
                placeholder="10"
                min="0"
                className="h-[44px] "
              />
            </Form.Item>
          </div>

          <div className="flex gap-4">
            <Form.Item
              name="price"
              label="Price"
              extra="Price must be the same in Google/Apple consoles"
              rules={[{ required: true, message: "Price is required" }]}
              className="w-1/2 mb-2"
            >
              <Input
                type="number"
                prefix="$"
                placeholder="90.0"
                step="0.01"
                className="h-[44px]"
              />
            </Form.Item>
            <Form.Item
              name="billingCycle"
              label="Billing Cycle"
              rules={[{ required: true, message: "Billing cycle is required" }]}
              className="w-1/2 mb-2"
            >
              <Select placeholder="Select billing cycle" className="h-[44px]">
                <Select.Option value="monthly">Monthly</Select.Option>
                <Select.Option value="yearly">Yearly</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Description is required" }]}
            className="mb-2"
          >
            <Input.TextArea
              rows={3}
              placeholder="Unlock premium features for a month"
            />
          </Form.Item>

          {/* App Configuration Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-base font-semibold ">App Configuration</h3>

            <Form.Item
              name="platform"
              label="Platform"
              rules={[{ required: true, message: "Platform is required" }]}
              className="mb-0"
            >
              <Radio.Group
                onChange={(e) => setSelectedPlatform(e.target.value)}
                value={selectedPlatform}
                disabled={isEditing}
              >
                <Radio value="google">Google Play</Radio>
                <Radio value="apple">Apple App Store</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="productId"
              label={
                selectedPlatform === "google"
                  ? "Google Product ID"
                  : "Apple Product ID"
              }
              rules={[{ required: true, message: "Product ID is required" }]}
              extra={
                selectedPlatform === "google"
                  ? "This ID must match the product ID configured in Google Play Console."
                  : "This ID must match the product ID configured in Apple App Store Connect."
              }
              className="mb-0"
            >
              <Input
                disabled={isEditing}
                placeholder={
                  selectedPlatform === "google"
                    ? "e.g. basic_03"
                    : "e.g. pro.yearly.plan"
                }
                className="h-[44px]"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="features"
            label="Features"
            rules={[
              { required: true, message: "At least one feature is required" },
            ]}
          >
            <FeaturedInput />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              onClick={handleCancel}
              size="large"
              className="border border-primary hover:!border-primary hover:!text-primary"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
              className="bg-primary text-white rounded-lg hover:bg-[#012F60] transition-all h-auto py-2 px-6"
              size="large"
            >
              {isEditing ? "Update Package" : "Add Package"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PackagesPlans;
