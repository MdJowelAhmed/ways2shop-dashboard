import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegBell } from "react-icons/fa6";
import { Badge, Button, Dropdown, Menu, Modal } from "antd";
import Avatar from "../../assets/avatar.png";
import { useProfileQuery } from "../../redux/apiSlices/authSlice";
import { useGetNotificationsQuery } from "../../redux/apiSlices/notificationSlice";
import { getImageUrl } from "../../components/common/imageUrl";
// import socketService from "../../services/socketService";
import toast from "react-hot-toast";
import socketService from "../../components/common/socketService";

const Header = ({ toggleSidebar, isMobile }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { data: userData } = useProfileQuery();
  const { data: notificationsData, refetch } = useGetNotificationsQuery([
    { name: 'page', value: 1 },
    { name: 'limit', value: 10 }
  ]);

  const unreadCount = notificationsData?.data?.unreadCount || 0;

  // Socket connection and notification listener
  useEffect(() => {
    if (userData?.data?._id) {
      socketService.connect(userData.data._id);

      const notificationEvent = `get-notification::${userData.data._id}`;
      
      const handleNewNotification = (data) => {
        console.log("New notification in header:", data);
        
        // Show toast notification
        toast.success(
          <div>
            <strong>{data.title}</strong>
            <p className="text-sm">{data.message}</p>
          </div>,
          {
            duration: 4000,
            icon: '🔔'
          }
        );
        
        // Refetch to update badge count
        refetch();
      };

      socketService.on(notificationEvent, handleNewNotification);

      return () => {
        socketService.off(notificationEvent, handleNewNotification);
      };
    }
  }, [userData?.data?._id, refetch]);

  const showLogoutConfirm = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogout = () => {
    socketService.disconnect();
    localStorage.removeItem("token");
    setIsLogoutModalOpen(false);
    window.location.href = "/auth/login";
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="settings">
        <Link to="/profile">Settings</Link>
      </Menu.Item>
      <Menu.Item
        key="logout"
        danger
        onClick={showLogoutConfirm}
        style={{ display: "flex", alignItems: "center" }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex items-center justify-between gap-5 w-full px-4 rounded-md lg:px-10 shadow-sm py-2">
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Toggle */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="text-xl text-gray-700 p-2 rounded-md hover:bg-gray-100"
          >
            &#9776;
          </button>
        )}
        <h2 className="font-bold text-xl text-secondary">
          Super Admin Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-5">
        {/* Profile Icon with Dropdown Menu */}
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="flex flex-row gap-1">
              <p>Hello,</p> 
              <p className="text-[16px] font-semibold">
                {userData?.data?.name}
              </p>
            </div>
            <img
              style={{
                clipPath: "circle()",
                width: 45,
                height: 45,
                objectFit: "cover"
              }}
              src={getImageUrl(userData?.data?.profile) || Avatar}
              alt="profile-pic"
              className="clip"
            />
          </div>
        </Dropdown>

        {/* Notification Icon */}
        <Link to="/notification" className="h-fit mt-[10px]">
          <Badge 
            count={unreadCount} 
            overflowCount={99}
            style={{ 
              backgroundColor: '#3FC7EE',
              boxShadow: '0 0 0 1px #d9d9d9 inset'
            }}
          >
            <FaRegBell 
              color="#198248" 
              size={24}
              className={unreadCount > 0 ? 'animate-pulse' : ''}
            />
          </Badge>
        </Link>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        visible={isLogoutModalOpen}
        onCancel={handleCancelLogout}
        footer={[
          <Button key="cancel" onClick={handleCancelLogout}>
            Cancel
          </Button>,
          <Button key="logout" danger onClick={handleLogout}>
            Logout
          </Button>,
        ]}
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </div>
  );
};

export default Header;