import React from "react";

const ConnectedAccountSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-semibold mb-2 text-gray-800">
          Account Connected Successfully
        </h1>
        <p className="text-gray-600 mb-6">
          Your account has been connected. You can now access all features.
        </p>
      </div>
    </div>
  );
};

export default ConnectedAccountSuccess;
