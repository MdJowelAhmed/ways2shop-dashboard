import { Menu, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  Dashboard,
  Marchant,
  SalesRepsManagement,
  Settings,
  RetailersManagement,
  InventoryManagement,
  LoyaltyProgram,
  SubscriptionManagement,
  OrderManagement,
  People,
  PromotionManagement,
  SalesRep,
  AuditLog,
  loginCredentials,
  Rewords,
} from "../../components/common/Svg";
import image4 from "../../assets/image4.png";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const path = location.pathname;
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const showLogoutConfirm = () => setIsLogoutModalOpen(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogoutModalOpen(false);
    navigate("/auth/login");
  };
  const handleCancel = () => setIsLogoutModalOpen(false);

  const isItemActive = (itemKey) =>
    selectedKey === itemKey ||
    (itemKey === "subMenuSetting" &&
      ["/profile", "/terms-and-conditions", "/privacy-policy"].includes(
        selectedKey
      ));

  const renderIcon = (IconComponent, itemKey) => {
    const isActive = isItemActive(itemKey);
    return (
      <div
        style={{ width: 20, height: 20 }}
        className={isActive ? "svg-active" : ""}
      >
        <IconComponent
          className="menu-icon"
          fill={isActive ? "#ffffff" : "#1E1E1E"}
        />
      </div>
    );
  };

  const menuItems = [
    {
      key: "/",
      icon: renderIcon(Dashboard, "/"),
      label: <Link to="/">{collapsed ? "" : "Dashboard Overview"}</Link>,
    },
    {
      key: "/category-management",
      icon: renderIcon(Marchant, "/category-management"),
      label: (
        <Link to="/category-management">
          {collapsed ? "" : "Service Category "}
        </Link>
      ),
    },
    // {
    //   key: "/customerManagement",
    //   icon: renderIcon(People, "/customerManagement"),
    //   label: (
    //     <Link to="/customerManagement">
    //       {collapsed ? "" : "Customer Profile"}
    //     </Link>
    //   ),
    // },
    // {
    //   key: "/tierSystem",
    //   icon: renderIcon(People, "/tierSystem"),
    //   label: (
    //     <Link to="/tierSystem">{collapsed ? "" : "Point & Tier System"}</Link>
    //   ),
    // },

        {
      key: "/userManagement",
      icon: renderIcon(loginCredentials, "/userManagement"),
      label: (
        <Link to="/userManagement">{collapsed ? "" : "User Management"}</Link>
      ),
    },
    {
      key: "/reportingAnalytics",
      icon: renderIcon(Rewords, "/reportingAnalytics"),
      label: (
        <Link to="/reportingAnalytics">
          {collapsed ? "" : "Reporting & Analytics"}
        </Link>
      ),
    },
    // {
    //   key: "/subscription",
    //   icon: renderIcon(SubscriptionManagement, "/subscription"),
    //   label: (
    //     <Link to="/subscription">
    //       {collapsed ? "" : "Subscription Package"}
    //     </Link>
    //   ),
    // },
    // {
    //   key: "/promotionManagement",
    //   icon: renderIcon(PromotionManagement, "/promotionManagement"),
    //   label: (
    //     <Link to="/promotionManagement">
    //       {collapsed ? "" : "Promotion Management"}
    //     </Link>
    //   ),
    // },
    // {
    //   key: "/salesRepPortal",
    //   icon: renderIcon(SalesRep, "/salesRepPortal"),
    //   label: (
    //     <Link to="/salesRepPortal">{collapsed ? "" : "Sales Rep Portal"}</Link>
    //   ),
    // },
    // {
    //   key: "/auditLogs",
    //   icon: renderIcon(AuditLog, "/auditLogs"),
    //   label: <Link to="/auditLogs">{collapsed ? "" : "Audit Logs"}</Link>,
    // },

    // {
    //   key: "/pushNotification",
    //   icon: renderIcon(loginCredentials, "/pushNotification"),
    //   label: (
    //     <Link to="/pushNotification">
    //       {collapsed ? "" : "Push Notifications"}
    //     </Link>
    //   ),
    // },
    {
      key: "subMenuSetting",
      icon: renderIcon(Settings, "subMenuSetting"),
      label: collapsed ? "" : "Settings",
      children: [
        {
          key: "/profile",
          label: <Link to="/profile">{collapsed ? "" : "Update Profile"}</Link>,
        },
   
        {
          key: "/terms-and-conditions",
          label: (
            <Link to="/terms-and-conditions">
              {collapsed ? "" : "Terms And Condition"}
            </Link>
          ),
        },
        {
          key: "/privacy-policy",
          label: (
            <Link to="/privacy-policy">
              {collapsed ? "" : "Privacy Policy"}
            </Link>
          ),
        },
      ],
    },
    {
      key: "/logout",
      icon: <IoIosLogOut size={24} />,
      label: <p onClick={showLogoutConfirm}>{collapsed ? "" : "Logout"}</p>,
    },
  ];

  useEffect(() => {
    const selectedItem = menuItems.find(
      (item) =>
        item.key === path ||
        (item.children && item.children.some((sub) => sub.key === path))
    );
    if (selectedItem) {
      setSelectedKey(path);
      if (selectedItem.children) setOpenKeys([selectedItem.key]);
      else {
        const parentItem = menuItems.find(
          (item) =>
            item.children && item.children.some((sub) => sub.key === path)
        );
        if (parentItem) setOpenKeys([parentItem.key]);
      }
    }
  }, [path]);

  const handleOpenChange = (keys) => setOpenKeys(keys);

  return (
    <div
      className="h-full flex flex-col bg-white border-r border-primary transition-all duration-300"
      style={{ width: collapsed ? 80 : 250 }}
    >
      {/* Toggle Button */}
      {/* <div
        className="flex justify-end items-center p-2 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <MenuUnfoldOutlined style={{ fontSize: 20 }} />
        ) : (
          <MenuFoldOutlined style={{ fontSize: 20 }} />
        )}
      </div> */}

      {/* Logo */}
      {!collapsed && (
        <Link
          to={"/"}
          className="logo-container flex items-center justify-center py-4"
        >
          <img src={image4} alt="logo" className="w-40 h-28" />
        </Link>
      )}

      {/* Menu */}
      <div className="flex-1 overflow-y-auto">
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          className="font-poppins text-black border-none"
          items={menuItems.map((item) => ({
            ...item,
            children: item.children
              ? item.children.map((subItem) => ({ ...subItem }))
              : undefined,
          }))}
        />
      </div>

      {/* Logout Modal */}
      <Modal
        centered
        title="Confirm Logout"
        open={isLogoutModalOpen}
        onOk={handleLogout}
        onCancel={handleCancel}
        okText="Logout"
        cancelText="Cancel"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
};

export default Sidebar;

