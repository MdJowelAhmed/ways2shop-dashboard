import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import GradientButton from "../../components/common/GradiantButton";
import { Button, message, Modal, Tabs } from "antd";

const TermsAndCondition = () => {
  const editor = useRef(null);
  
  // Separate content for Service Provider and Customer
  const [serviceProviderContent, setServiceProviderContent] = useState(`
    <h2 style="font-size: 24px; font-weight: bold; color: #333;">Terms & Conditions - Service Provider</h2>
    <p style="font-size: 16px; color: #555;">Welcome to our platform as a service provider. By registering and using our services, you agree to comply with and be bound by the following terms and conditions.</p><br />
    <h3 style="font-size: 20px; font-weight: bold; color: #444;">1. Service Provider Obligations</h3>
    <p style="font-size: 16px; color: #555;">As a service provider, you are responsible for delivering quality services as described in your profile and maintaining professional standards.</p><br />
    <h3 style="font-size: 20px; font-weight: bold; color: #444;">2. Payment Terms</h3>
    <p style="font-size: 16px; color: #555;">Payment processing and commission structures are governed by our payment policy. Service providers will receive payments according to the agreed schedule.</p><br />
    <h3 style="font-size: 20px; font-weight: bold; color: #444;">3. Service Quality</h3>
    <p style="font-size: 16px; color: #555;">Service providers must maintain high quality standards and respond to customer inquiries promptly and professionally.</p>
  `);

  const [customerContent, setCustomerContent] = useState(`
    <h2 style="font-size: 24px; font-weight: bold; color: #333;">Terms & Conditions - Customer</h2>
    <p style="font-size: 16px; color: #555;">Welcome to our platform. As a customer, these terms and conditions govern your use of our services and your relationship with service providers.</p><br />
    <h3 style="font-size: 20px; font-weight: bold; color: #444;">1. Service Booking</h3>
    <p style="font-size: 16px; color: #555;">Customers can book services through our platform. All bookings are subject to availability and service provider confirmation.</p><br />
    <h3 style="font-size: 20px; font-weight: bold; color: #444;">2. Payment Policy</h3>
    <p style="font-size: 16px; color: #555;">Payment must be made according to the terms specified for each service. Refund policies may vary based on the service type and provider.</p><br />
    <h3 style="font-size: 20px; font-weight: bold; color: #444;">3. Customer Responsibilities</h3>
    <p style="font-size: 16px; color: #555;">Customers are expected to provide accurate information and communicate respectfully with service providers.</p>
  `);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("service-provider");
  const [modalActiveTab, setModalActiveTab] = useState("service-provider");

  const showModal = () => {
    setModalActiveTab(activeTab); // Set modal tab to match current active tab
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    message.success("Terms & Conditions updated successfully!");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getCurrentContent = () => {
    return activeTab === "service-provider" ? serviceProviderContent : customerContent;
  };

  const getCurrentModalContent = () => {
    return modalActiveTab === "service-provider" ? serviceProviderContent : customerContent;
  };

  const handleContentChange = (newContent) => {
    if (modalActiveTab === "service-provider") {
      setServiceProviderContent(newContent);
    } else {
      setCustomerContent(newContent);
    }
  };

  const tabItems = [
    {
      key: "service-provider",
      label: "Service Provider",
      children: (
        <div className="saved-content border p-6 rounded-lg bg-white">
          <div
            dangerouslySetInnerHTML={{ __html: serviceProviderContent }}
            className="prose max-w-none"
          />
        </div>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      children: (
        <div className="saved-content border p-6 rounded-lg bg-white">
          <div
            dangerouslySetInnerHTML={{ __html: customerContent }}
            className="prose max-w-none"
          />
        </div>
      ),
    },
  ];

  const modalTabItems = [
    {
      key: "service-provider",
      label: "Service Provider",
      children: (
        <div className="mb-6">
          <JoditEditor
            ref={editor}
            value={serviceProviderContent}
            onChange={(newContent) => {
              if (modalActiveTab === "service-provider") {
                setServiceProviderContent(newContent);
              }
            }}
          />
        </div>
      ),
    },
    {
      key: "customer",
      label: "Customer", 
      children: (
        <div className="mb-6">
          <JoditEditor
            ref={editor}
            value={customerContent}
            onChange={(newContent) => {
              if (modalActiveTab === "customer") {
                setCustomerContent(newContent);
              }
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Terms & Conditions</h2>
        <Button
          onClick={showModal}
          className="w-60 bg-[#CDA861] text-white h-10"
        >
          Update Terms & Conditions
        </Button>
      </div>

      <div className="mt-6">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="terms-tabs"
        />
      </div>

      <Modal
        title="Update Terms & Conditions"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width="80%"
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            className="bg-red-500 text-white mr-2 py-5"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            onClick={handleOk}
            className="bg-[#CDA861] text-white"
          >
            Update Terms & Conditions
          </Button>,
        ]}
      >
        <Tabs
          activeKey={modalActiveTab}
          onChange={setModalActiveTab}
          items={modalTabItems}
          className="modal-terms-tabs"
        />
      </Modal>
    </div>
  );
};

export default TermsAndCondition;