import React from 'react';

export default function AccountDeletionGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Ways2Shop Account Deletion</h1>
          <p className="text-gray-600 mt-2">Simple steps to delete your account</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Deletion Process</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Follow the steps below to permanently delete your Ways2Shop account.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-yellow-800 font-semibold">⚠️ Important</p>
            <p className="text-yellow-700 text-sm mt-1">
              Account deletion is permanent and cannot be undone.
            </p>
          </div>
        </div>

        {/* Step 1 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-4">
            <span className="bg-yellow-600 text-white text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4">1</span>
            <h3 className="text-xl font-bold text-gray-800">Go to Profile</h3>
          </div>
          <p className="text-gray-700 mb-4 ml-14">
            Tap the profile icon at the bottom right corner.
          </p>
          <div className="ml-14">
            <img 
              src="/one.png" 
              alt="Profile Page" 
              className="rounded-lg shadow-lg border-2 border-gray-200 max-w-xs"
            />
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-4">
            <span className="bg-yellow-600 text-white text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4">2</span>
            <h3 className="text-xl font-bold text-gray-800">Tap "Delete Account"</h3>
          </div>
          <p className="text-gray-700 mb-4 ml-14">
            Scroll down and select "Delete Account" from the menu.
          </p>
          <div className="ml-14">
            <img 
              src="/two.png" 
              alt="Delete Account Menu" 
              className="rounded-lg shadow-lg border-2 border-gray-200 max-w-xs"
            />
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-4">
            <span className="bg-yellow-600 text-white text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4">3</span>
            <h3 className="text-xl font-bold text-gray-800">Enter OTP Code</h3>
          </div>
          <p className="text-gray-700 mb-4 ml-14">
            A 6-digit code will be sent to your email. Enter the code to verify.
          </p>
          <div className="ml-14">
            <img 
              src="/tree.png" 
              alt="OTP Entry" 
              className="rounded-lg shadow-lg border-2 border-gray-200 max-w-xs"
            />
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-4">
            <span className="bg-yellow-600 text-white text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4">4</span>
            <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
          </div>
          <p className="text-gray-700 mb-4 ml-14">
            Click "Delete" to permanently remove your account.
          </p>
        </div>

        {/* Step 5 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-4">
            <span className="bg-yellow-600 text-white text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4">5</span>
            <h3 className="text-xl font-bold text-gray-800">Done</h3>
          </div>
          <p className="text-gray-700 mb-4 ml-14">
            Your account has been deleted successfully.
          </p>
          <div className="ml-14">
            <img 
              src="/four.png" 
              alt="Login Page" 
              className="rounded-lg shadow-lg border-2 border-gray-200 max-w-xs"
            />
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-yellow-50 rounded-lg shadow-md p-8 border-2 border-yellow-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help?</h3>
          <p className="text-gray-700 mb-4">
            Contact our support team for assistance.
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> support@ways2shop.com</p>
            <p><strong>Phone:</strong> +880 1712-345678</p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-2">© 2024 Ways2Shop LLC. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-yellow-400">Terms & Conditions</a>
            <a href="#" className="hover:text-yellow-400">Privacy Policy</a>
            <a href="#" className="hover:text-yellow-400">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}