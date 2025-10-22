import React from "react";
import { Link } from "react-router-dom";
import { FaRegBell } from "react-icons/fa6";
import { Badge, Button, Dropdown, Menu, Modal } from "antd";
import { IoIosLogOut } from "react-icons/io";
import Avatar from "../../assets/avatar.png";
import { useProfileQuery } from "../../redux/apiSlices/authSlice";
import { getImageUrl } from "../../components/common/imageUrl";

const Header = ({ toggleSidebar, isMobile }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const {data:userData} = useProfileQuery();
  console.log(userData);

  const showLogoutConfirm = () => {
    setIsLogoutModalOpen(true); 
  };

  const handleLogout = () => {
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
              <p>Hello,</p> <p className="text-[16px] font-semibold">{userData?.data?.name}</p>
            </div>
            <img
              style={{
                clipPath: "circle()",
                width: 45,
                height: 45,
              }}
              src={getImageUrl(userData?.data?.profile)}
              alt="profile-pic"
              className="clip"
            />
          </div>
        </Dropdown>

        {/* Notification Icon */}
        <Link to="/notification" className="h-fit mt-[10px]">
          <Badge count={5} backgroundColor="#3FC7EE">
            <FaRegBell color="#198248" size={24} />
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
