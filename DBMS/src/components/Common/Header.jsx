// components/Common/Header.jsx
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../api/authSlice";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../../api/authApi";
import logo from "../../assets/img/logo.png";
import logo_small from "../../assets/img/fav_icon.png";
// Ant Design Components (v5)
import { Avatar, Dropdown, Spin, Typography, Button, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";

// Optional: If you still want FontAwesome icons (recommended to replace with AntD equivalents)
import { FaUserCircle, FaEllipsisV } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";

const { Text } = Typography;

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((s) => s.auth.token);
  const reduxUser = useSelector((s) => s.auth.user);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  const { data: profile, isLoading } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  // Use profile from API if available, fallback to Redux
  const user = profile || reduxUser;

  // Safely extract values
  const userId = user?.id || user?.user?.id;
  const username = user?.username || user?.user?.username || "user";
  const displayName = user?.name || user?.user?.name || "User";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // === Desktop Dropdown Menu (using AntD Menu) ===
  const desktopMenu = useMemo(
    () => (
      <Menu
        className="shadow-sm rounded menu-drop-user"
        style={{ minWidth: 200, zIndex: 1100 }}
      >
        <Menu.Item key="profile-header" disabled className="p-3">
          <div className="d-flex align-items-center">
            <Avatar
              size={40}
              style={{ backgroundColor: "#1890ff" }}
              icon={<UserOutlined />}
            >
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
            <div className="ms-3">
              <h6 className="mb-0 fw-medium">{displayName}</h6>
              <small className="text-muted">@{username}</small>
            </div>
          </div>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          key="logout"
          icon={<BiLogOut style={{ fontSize: 16 }} />}
          onClick={handleLogout}
          danger
        >
          Logout
        </Menu.Item>
      </Menu>
    ),
    [displayName, username, userId, navigate, handleLogout],
  );

  // === Mobile Menu Items ===
  const mobileMenuItems = useMemo(
    () => [
      {
        key: "logout",
        label: "Logout",
        icon: <BiLogOut />,
        danger: true,
        onClick: handleLogout,
      },
    ],
    [userId, navigate, handleLogout],
  );

  // Loading State
  if (isLoading) {
    return (
      <div className="header">
        <div className="main-header">
          <div className="header-left">
            <a href="/" className="logo">
              <img src={logo} alt="Logo" />
            </a>
          </div>
          <div className="text-muted">
            <Spin size="small" className="me-2" />
            Loading…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="header">
      <div className="main-header">
        {/* LOGO */}
        <div className="header-left active">
          <a href="/" className="logo">
            <img src={logo} alt="Logo" />
          </a>
          <a href="/" className="dark-logo">
            <img src={logo} alt="Dark Logo" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <a
          className="mobile_btn"
          onClick={() =>
            window.innerWidth < 992 && toggleSidebar(!isSidebarOpen)
          }
          id="mobile_btn"
        >
          <span className="bar-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </a>

        {/* Desktop User Menu */}
        <ul className="nav user-menu">
          <li className="nav-item dropdown main-drop profile-nav">
            {isAuthenticated && user && (
              <Dropdown
                menu={{ items: [] }} // We'll use overlay instead for full control
                dropdownRender={() => desktopMenu} // Custom render for full Menu control
                trigger={["click"]}
                placement="bottomRight"
              >
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="d-flex align-items-center text-decoration-none text-dark"
                >
                  {/* Desktop: Avatar + Name */}
                  <span className="d-none d-lg-flex align-items-center">
                    <Avatar
                      size={40}
                      className="me-2"
                      style={{ backgroundColor: "#1890ff" }}
                      icon={<UserOutlined />}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Text strong className="user-name d-none d-xl-inline">
                      {displayName}
                    </Text>
                  </span>

                  {/* Mobile: Avatar only */}
                  <span className="d-lg-none">
                    <Avatar
                      size={35}
                      style={{ backgroundColor: "#1890ff" }}
                      icon={<UserOutlined />}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </Avatar>
                  </span>
                </a>
              </Dropdown>
            )}
          </li>
        </ul>

        {/* Mobile Three Dots Menu */}
        <div className="mobile-user-menu d-lg-none">
          <Dropdown
            menu={{ items: mobileMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
            overlayClassName="mobile-dropdown"
            getPopupContainer={(trigger) =>
              trigger.parentElement || document.body
            }
          >
            <Button
              type="text"
              icon={<FaEllipsisV />}
              className="mobile-menu-button"
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Header;
