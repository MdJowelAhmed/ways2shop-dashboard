import React from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";

const FeaturedInput = () => {
  return (
    <Form.List name="features" initialValue={[""]}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field, index) => (
            <div key={field.key} className="flex items-start gap-2 w-full">
              <Form.Item
                {...field}
                className="w-full"
                rules={[
                  { required: true, message: "Feature is required" },
                ]}
              >
                <Input
                  placeholder="Feature name"
                  className="w-full h-[44px]"
                />
              </Form.Item>

              {fields.length > 1 && (
                <MinusCircleOutlined
                  className="text-red-500 text-lg cursor-pointer mt-2"
                  onClick={() => remove(field.name)}
                />
              )}
            </div>
          ))}

          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              icon={<PlusOutlined />}
              className="w-full"
            >
              Add Feature
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default FeaturedInput;
