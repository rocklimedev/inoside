// components/Common/SidebarNew.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronsLeft } from "react-feather";
import masterRoutes from "../../router/routes";
import logo from "../../assets/img/logo.png";
import logo_small from "../../assets/img/fav_icon.png";
import { DownOutlined } from "@ant-design/icons";
const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();

  // Only show routes where isSidebarActive is true (or undefined)
  const sidebarRoutes = masterRoutes.filter(
    (route) => route.isSidebarActive === true
  );

  return (
    <div className={`sidebar ${isSidebarOpen ? "active" : ""}`} id="sidebar">
      {/* Logo Section */}
      <div className={`sidebar-logo ${isSidebarOpen ? "active" : ""}`}>
        <NavLink to="/" className="logo logo-normal">
          <img src={logo} alt="Logo" />
        </NavLink>
        <NavLink to="/" className="logo logo-small">
          <img src={logo_small} alt="Logo Small" />
        </NavLink>

        <a
          href="#"
          id="toggle_btn"
          onClick={(e) => {
            e.preventDefault();
            toggleSidebar();
          }}
          className="sidebar-toggle"
        >
          <ChevronsLeft size={18} />
        </a>
      </div>

      {/* Menu */}
      <div className="sidebar-inner slimscroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            {sidebarRoutes.map((route) => {
              const isActive =
                location.pathname === route.path ||
                (route.path !== "/" &&
                  location.pathname.startsWith(route.path));

              return (
                <li key={route.path}>
                  <NavLink
                    to={route.path}
                    className={`nav-link ${isActive ? "active" : ""}`}
                    end={route.path === "/"} // "end" only for exact match on root
                  >
                    {route.icon ? (
                      route.icon
                    ) : (
                      <DownOutlined className="menu-icon" />
                    )}
                    <span>{route.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
