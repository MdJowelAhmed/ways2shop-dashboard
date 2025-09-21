import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import GradientButton from "../../components/common/GradiantButton";
import { Button, message, Modal, Tabs } from "antd";

const PrivacyPolicy = () => {
  const editor = useRef(null);
  
  // Separate content for Service Provider and Customer
  const [serviceProviderContent, setServiceProviderContent] = useState(`
    <h1><strong>Privacy Policy - Service Provider</strong></h1>
    <p>This Privacy Policy describes how we collect, use, and protect your information as a service provider on our platform.</p><br />
    <h3><strong><em>1. Information We Collect</em></strong></h3>
    <p>We collect personal information including your name, contact details, business information, service descriptions, and payment information to facilitate service delivery.</p><br />
    <h3><strong><em>2. How We Use Your Information</em></strong></h3>
    <p>Your information is used to create your service provider profile, process payments, communicate with customers, and improve our platform services.</p><br />
    <h3><strong><em>3. Information Sharing</em></strong></h3>
    <p>We share necessary information with customers for service booking purposes. We do not sell your personal information to third parties.</p><br />
    <h3><strong><em>4. Data Security</em></strong></h3>
    <p>We implement appropriate security measures to protect your personal and business information from unauthorized access, alteration, or disclosure.</p><br />
    <h3><strong><em>5. Your Rights</em></strong></h3>
    <p>You have the right to access, update, or delete your information. You can also control your profile visibility and communication preferences.</p>
  `);

  const [customerContent, setCustomerContent] = useState(`
    <h1><strong>Privacy Policy - Customer</strong></h1>
    <p>This Privacy Policy explains how we collect, use, and protect your personal information when you use our services as a customer.</p><br />
    <h3><strong><em>1. Information Collection</em></strong></h3>
    <p>We collect your personal details, contact information, location data, and payment information to provide you with personalized services.</p><br />
    <h3><strong><em>2. Purpose of Data Usage</em></strong></h3>
    <p>Your information is used to match you with suitable service providers, process bookings, handle payments, and enhance your user experience.</p><br />
    <h3><strong><em>3. Information Sharing with Service Providers</em></strong></h3>
    <p>We share relevant information with service providers to facilitate service delivery. This includes your contact details and service requirements.</p><br />
    <h3><strong><em>4. Data Protection</em></strong></h3>
    <p>We use industry-standard security measures to protect your personal information from unauthorized access, misuse, or disclosure.</p><br />
    <h3><strong><em>5. Customer Rights</em></strong></h3>
    <p>You have full control over your data including the right to view, modify, or delete your information. You can also manage your privacy settings at any time.</p>
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
    message.success("Privacy Policy updated successfully!");
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
        <h2 className="text-xl font-bold">Privacy Policy</h2>
        <GradientButton
          onClick={showModal}
          className="w-60 bg-secondary text-white h-10"
        >
          Update Privacy Policy
        </GradientButton>
      </div>

      <div className="mt-6">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="privacy-tabs"
        />
      </div>

      <Modal
        title="Update Privacy Policy"
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
          <GradientButton
            key="submit"
            onClick={handleOk}
            className="bg-secondary text-white"
          >
            Update Privacy Policy
          </GradientButton>,
        ]}
      >
        <Tabs
          activeKey={modalActiveTab}
          onChange={setModalActiveTab}
          items={modalTabItems}
          className="modal-privacy-tabs"
        />
      </Modal>
    </div>
  );
};

export default PrivacyPolicy;