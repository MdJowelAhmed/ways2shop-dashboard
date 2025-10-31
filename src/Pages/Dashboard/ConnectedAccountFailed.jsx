import React from "react";

const ConnectedAccountFailed = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-semibold mb-2 text-gray-800">
          Account Connection Failed
        </h1>
        <p className="text-gray-600 mb-6">
          We were unable to connect your account. Please try again or contact
          support if the problem persists.
        </p>
      </div>
    </div>
  );
};

export default ConnectedAccountFailed;
