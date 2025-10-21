import { Button, Form, Input, message } from "antd";
import { useChangePasswordMutation } from "../../../redux/apiSlices/authSlice";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChangePassword = async (values) => {
    try {
      // Prepare data according to backend requirements
      const data = {
        currentPassword: values.current_password,
        newPassword: values.new_password,
        confirmPassword: values.confirm_password,
      };

      // Call the mutation
      const response = await changePassword(data).unwrap();

      // Show success message
      message.success("Password updated successfully!");
      
      // Reset the form
      form.resetFields();
      
    } catch (error) {
      // Handle error
      message.error(
        error?.data?.message || "Failed to update password. Please try again."
      );
    }
  };

  return (
    <div className="">
      <div className="flex flex-col justify-start pl-20 pr-20 pt-5 pb-10 shadow-xl">
        <h2 className="text-2xl font-bold mb-5">Update Password</h2>
        <div>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              remember: true,
            }}
            onFinish={handleChangePassword}
          >
            <div className="mb-[20px] w-[80%]">
              <Form.Item
                style={{ marginBottom: 0 }}
                name="current_password"
                label={<p style={{ display: "block" }}>Current Password</p>}
                rules={[
                  {
                    required: true,
                    message: "Please input your current password!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Enter Password"
                  type="password"
                  style={{
                    height: "45px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>

            <div className="mb-[20px] w-[80%]">
              <Form.Item
                name="new_password"
                label={<p style={{ display: "block" }}>New Password</p>}
                dependencies={["current_password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        !value ||
                        getFieldValue("current_password") === value
                      ) {
                        return Promise.reject(
                          new Error(
                            "The new password and current password do not match!"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input.Password
                  type="password"
                  placeholder="Enter password"
                  style={{
                    height: "45px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>

            <div className="mb-[45px] w-[80%]">
              <Form.Item
                name="confirm_password"
                label={<p style={{ display: "block" }}>Re-Type Password</p>}
                style={{ marginBottom: 0 }}
                dependencies={["new_password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("new_password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The new password that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  type="password"
                  placeholder="Enter password"
                  style={{
                    height: "45px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>

            {/* Center the Button using Flexbox */}
            <div
              className="flex justify-center mb-[20px]"
              style={{
                width: "80%",
              }}
            >
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isLoading}
                  disabled={isLoading}
                  style={{
                    border: "none",
                    height: "45px",
                    background: "#CDA861",
                    color: "white",
                    borderRadius: "8px",
                    outline: "none",
                    padding: "10px 20px",
                    width: "250px",
                  }}
                  className="px-6"
                >
                  Update your password
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;