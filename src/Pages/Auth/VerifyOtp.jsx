import { Button, Form, Typography } from "antd";
import React, { useState } from "react";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import image4 from "../../assets/image4.png";
import { useOtpVerifyMutation, useResendOtpMutation } from "../../redux/apiSlices/authSlice";

const { Text } = Typography;

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const email = new URLSearchParams(window.location.search).get("email");
  const [otpVerify] = useOtpVerifyMutation();
  const [resendOtp] = useResendOtpMutation();

  const [verificationStatus, setVerificationStatus] = useState("");

  const onFinish = async () => {
    try {
      const payload = { email, oneTimeCode: Number(otp) };
      const response = await otpVerify(payload).unwrap();

      if (response.success) {
        localStorage.setItem("verifyToken", response.data);
        navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        setVerificationStatus("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      setVerificationStatus("OTP verification failed. Please try again.");
    }
  };

  const handleResendEmail = async () => {
    try {
      // Call resend OTP API here
      await resendOtp({ email }).unwrap();
      setVerificationStatus(
        "A new verification code has been sent to your email."
      );
    } catch (error) {
      setVerificationStatus(
        "Failed to resend verification code. Please try again."
      );
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        {/* <img src={image4} alt="logo" className="h-40 w-60 mx-auto" /> */}
        <h1 className="text-[25px] font-semibold mb-6">Verify OTP</h1>
        <p className="w-[80%] mx-auto">
          We'll send a verification code to your email. Check your inbox and
          enter the code here.
        </p>
      </div>

      <Form layout="vertical" onFinish={onFinish}>
        <div className="flex items-center justify-center mb-6">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6} // 🔹 changed from 4 to 6
            inputStyle={{
              height: 50,
              width: 50,
              borderRadius: "8px",
              margin: "10px",
              fontSize: "20px",
              border: "1px solid #007BA5",
              color: "#2B2A2A",
              outline: "none",
            }}
            renderInput={(props) => <input {...props} />}
          />
        </div>

        {verificationStatus && (
          <div className="text-center mb-4 text-red-500">
            {verificationStatus}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <Text>Don't receive the code?</Text>
          <p
            onClick={handleResendEmail}
            className="login-form-forgot"
            style={{ color: "#007BA5", cursor: "pointer" }}
          >
            Resend
          </p>
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            htmlType="submit"
            type="submit"
            style={{
              width: "100%",
              height: 45,
              color: "white",
              fontWeight: "400px",
              fontSize: "18px",
              marginTop: 20,
            }}
            className="flex items-center justify-center border bg-primary rounded-lg"
          >
            Verify OTP
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VerifyOtp;
