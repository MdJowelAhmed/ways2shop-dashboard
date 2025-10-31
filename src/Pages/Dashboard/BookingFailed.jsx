import { Button } from "antd";
import React, { useEffect } from "react";

const BookingFailed = () => {
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );

    if (sessionId) {
      fetch("http://206.162.244.188:5001/api/v1/payments/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      }).catch((err) => console.error("Cancel booking failed:", err));
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-semibold mb-2 text-gray-800">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your booking was not completed because the payment was cancelled.
        </p>
      </div>
    </div>
  );
};

export default BookingFailed;
