import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Button, message, Modal, Tabs, Spin } from "antd";
import { useGetSettingQuery, useUpdateSettingMutation } from "../../redux/apiSlices/settingsApi";

const PrivacyPolicy = () => {
  const editor = useRef(null);
  
  const [serviceProviderContent, setServiceProviderContent] = useState("");
  const [customerContent, setCustomerContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("service-provider");
  const [modalActiveTab, setModalActiveTab] = useState("service-provider");

  // Fetch data for both types
  const { data: providerData, isLoading: providerLoading } = useGetSettingQuery("provider-privacy-policy");
  const { data: customerData, isLoading: customerLoading } = useGetSettingQuery("customer-privacy-policy");
  
  const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingMutation();

  // Set content when data is loaded
  useEffect(() => {
    if (providerData?.data?.content) {
      setServiceProviderContent(providerData.data.content);
    }
  }, [providerData]);

  useEffect(() => {
    if (customerData?.data?.content) {
      setCustomerContent(customerData.data.content);
    }
  }, [customerData]);

  const showModal = () => {
    setModalActiveTab(activeTab);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const type = modalActiveTab === "service-provider" 
        ? "provider-privacy-policy" 
        : "customer-privacy-policy";
      
      const content = modalActiveTab === "service-provider" 
        ? serviceProviderContent 
        : customerContent;

      await updateSetting({
        type,
        content
      }).unwrap();

      setIsModalOpen(false);
      message.success("Privacy Policy updated successfully!");
    } catch (error) {
      message.error("Failed to update Privacy Policy. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const tabItems = [
    {
      key: "service-provider",
      label: "Service Provider",
      children: (
        <div className="saved-content border p-6 rounded-lg bg-white">
          {providerLoading ? (
            <div className="flex justify-center items-center py-10">
              <Spin size="large" />
            </div>
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: serviceProviderContent }}
              className="prose max-w-none"
            />
          )}
        </div>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      children: (
        <div className="saved-content border p-6 rounded-lg bg-white">
          {customerLoading ? (
            <div className="flex justify-center items-center py-10">
              <Spin size="large" />
            </div>
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: customerContent }}
              className="prose max-w-none"
            />
          )}
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
        <Button
          onClick={showModal}
          className="w-60 bg-primary text-white h-10"
        >
          Update Privacy Policy
        </Button>
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
            disabled={isUpdating}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            onClick={handleOk}
            className="bg-primary text-white"
            loading={isUpdating}
          >
            Update Privacy Policy
          </Button>,
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