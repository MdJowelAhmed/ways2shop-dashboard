import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Switch,
  Select,
  notification,
  Upload,
  Avatar,
  message,
} from "antd";
import GradientButton from "../../../components/common/GradiantButton";
import { UploadOutlined } from "@ant-design/icons";
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "../../../redux/apiSlices/authSlice";
import { getImageUrl } from "../../../components/common/imageUrl";

const { Option } = Select;

const UserProfile = () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);
  const { data: userData, isLoading } = useProfileQuery();
  console.log("userData", userData);
  const [updateProfile, { isLoading: updateLoading }] =
    useUpdateProfileMutation();

  useEffect(() => {
    if (userData?.data) {
      // Set form values from API response
      form.setFieldsValue({
        username: userData.data.name,
        email: userData.data.email,
        contact: userData.data.contact || "",
      });

      // Set profile image if exists
      if (userData.data.profile) {
        const profileImageUrl = `${import.meta.env.VITE_API_URL || ""}${
          userData.data.profile
        }`;
        setImageUrl(profileImageUrl);
        setFileList([
          {
            uid: "-1",
            name: "profile.jpg",
            status: "done",
            url: profileImageUrl,
          },
        ]);
      }
    }
  }, [userData, form]);

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const onFinish = async (values) => {
    try {
      // Create FormData object
      const formData = new FormData();

      // Append name field
      formData.append("name", values.username);

      // Append contact field
      if (values.contact) {
        formData.append("contact", values.contact);
      }

      // Append image file if a new one was uploaded
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      // Log FormData contents (for debugging)
      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      // Call the mutation
      const response = await updateProfile(formData).unwrap();

      message.success("Profile Updated Successfully!");
      console.log("Update response:", response);
    } catch (error) {
      console.error("Update error:", error);
      message.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleImageChange = ({ fileList: newFileList }) => {
    // Only keep the most recent file
    const limitedFileList = newFileList.slice(-1);
    setFileList(limitedFileList);

    if (limitedFileList.length > 0 && limitedFileList[0].originFileObj) {
      // Create blob URL for preview
      const newImageUrl = URL.createObjectURL(limitedFileList[0].originFileObj);

      // Clean up previous blob URL if exists
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }

      setImageUrl(newImageUrl);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      notification.error({
        message: "Invalid File Type",
        description: "Please upload an image file.",
      });
      return false;
    }

    const isLessThan2MB = file.size / 1024 / 1024 < 2;
    if (!isLessThan2MB) {
      notification.error({
        message: "File too large",
        description: "Image must be smaller than 2MB.",
      });
      return false;
    }

    return false; // Prevent auto upload, we'll handle it manually
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">Loading...</div>
    );
  }

  return (
    <div className="flex justify-center items-center shadow-xl rounded-lg pt-5 pb-12">
      <Form
        form={form}
        layout="vertical"
        style={{ width: "80%" }}
        onFinish={onFinish}
      >
        <div className="flex flex-col gap-5">
          {/* Profile Image */}
          <div className="col-span-2 flex justify-start items-center gap-5">
            <Form.Item style={{ marginBottom: 0 }}>
              <Upload
                name="avatar"
                showUploadList={false}
                onChange={handleImageChange}
                beforeUpload={beforeUpload}
                fileList={fileList}
                listType="picture-card"
                maxCount={1}
              >
                {imageUrl ? (
                  <Avatar
                    size={100}
                    src={
                      typeof imageUrl === "string" &&
                      (imageUrl.startsWith("blob:") ||
                        imageUrl.startsWith("data:"))
                        ? imageUrl // 🔹 local preview
                        : getImageUrl(imageUrl) // 🔹 server image
                    }
                  />
                ) : (
                  <Avatar size={100} icon={<UploadOutlined />} />
                )}
              </Upload>
            </Form.Item>

            <h2 className="text-[24px] font-bold">
              {userData?.data?.name || "User"}
            </h2>
          </div>

          {/* Full Name */}
          <Form.Item
            name="username"
            label="Full Name"
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input
              placeholder="Enter your Full Name"
              style={{
                height: "45px",
                backgroundColor: "#f7f7f7",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </Form.Item>

          {/* Email (Disabled) */}
          <Form.Item
            name="email"
            label="Email"
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              placeholder="Enter your Email"
              style={{
                height: "45px",
                backgroundColor: "#f7f7f7",
                borderRadius: "8px",
                outline: "none",
              }}
              disabled
            />
          </Form.Item>

          {/* Contact Number */}
          <Form.Item
            name="contact"
            label="Contact Number"
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: "Please enter your contact number" },
            ]}
          >
            <Input
              placeholder="Enter your Contact Number"
              style={{
                height: "45px",
                backgroundColor: "#f7f7f7",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </Form.Item>

          {/* Update Profile Button */}
          <div className="col-span-2 text-end mt-6">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={updateLoading}
                style={{ height: 40 }}
              >
                Save Changes
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UserProfile;
