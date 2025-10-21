import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Button, message, Modal, Tabs, Spin } from "antd";
import { useGetSettingQuery, useUpdateSettingMutation } from "../../redux/apiSlices/settingsApi";

const TermsAndCondition = () => {
  const editor = useRef(null);
  
  const [serviceProviderContent, setServiceProviderContent] = useState("");
  const [customerContent, setCustomerContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("service-provider");
  const [modalActiveTab, setModalActiveTab] = useState("service-provider");

  // Fetch data for both types
  const { data: providerData, isLoading: providerLoading } = useGetSettingQuery("provider-terms-and-conditions");
  const { data: customerData, isLoading: customerLoading } = useGetSettingQuery("customer-terms-and-conditions");
  
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
        ? "provider-terms-and-conditions" 
        : "customer-terms-and-conditions";
      
      const content = modalActiveTab === "service-provider" 
        ? serviceProviderContent 
        : customerContent;

      await updateSetting({
        type,
        content
      }).unwrap();

      setIsModalOpen(false);
      message.success("Terms & Conditions updated successfully!");
    } catch (error) {
      message.error("Failed to update Terms & Conditions. Please try again.");
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
            disabled={isUpdating}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            onClick={handleOk}
            className="bg-[#CDA861] text-white"
            loading={isUpdating}
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