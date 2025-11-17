// components/Common/Header.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "react-avatar";
import { logout } from "../../api/authSlice";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../../api/authApi";

import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((s) => s.auth.token);
  const reduxUser = useSelector((s) => s.auth.user);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  const {
    data: profile,
    isLoading,
    isError,
  } = useGetProfileQuery(undefined, { skip: !token });

  const user = profile || reduxUser;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="header">
        <div className="main-header d-flex justify-content-between align-items-center">
          <div className="header-left">
            <a href="/" className="logo">
              <img src="/assets/img/logo.svg" alt="Logo" />
            </a>
          </div>
          <div className="text-muted">Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="header">
      <div className="main-header d-flex justify-content-between align-items-center">
        {/* ---------- LOGO ---------- */}
        <div className="header-left">
          <a href="/" className="logo">
            <img src="/assets/img/logo.svg" alt="Logo" />
          </a>
          <a href="/" className="dark-logo">
            <img src="/assets/img/logo-white.svg" alt="Logo" />
          </a>
        </div>

        {/* ---------- MOBILE HAMBURGER ---------- */}
        <a id="mobile_btn" className="mobile_btn d-lg-none" href="#sidebar">
          <span className="bar-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </a>

        {/* ---------- USER MENU (Desktop + Mobile) ---------- */}
        {isAuthenticated && user && (
          <Menu as="div" className="position-relative">
            {/* ----- BUTTON (Desktop) ----- */}
            <Menu.Button
              className="d-none d-lg-flex align-items-center bg-transparent border-0 p-0"
              aria-label="User menu"
            >
              <span className="avatar avatar-md online me-2">
                <Avatar name={user?.name || "User"} round size="40" />
              </span>
              <span className="user-name d-none d-xl-inline">{user.name}</span>
            </Menu.Button>

            {/* ----- BUTTON (Mobile) ----- */}
            <Menu.Button
              className="d-lg-none bg-transparent border-0 p-0"
              aria-label="User menu"
            >
              <span className="avatar avatar-sm online">
                <Avatar name={user?.name || "User"} round size="35" />
              </span>
            </Menu.Button>

            {/* ----- DROPDOWN PANEL ----- */}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                className="dropdown-menu p-2 mt-2 position-absolute end-0"
                style={{ minWidth: "180px", zIndex: 1050 }}
              >
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/profile"
                      className={`dropdown-item d-flex align-items-center ${
                        active ? "bg-light" : ""
                      }`}
                    >
                      <i className="isax isax-profile-circle me-2"></i>
                      Profile
                    </a>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`dropdown-item logout d-flex align-items-center w-100 text-start ${
                        active ? "bg-light" : ""
                      }`}
                    >
                      <i className="isax isax-logout me-2"></i>
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </div>
  );
};

export default Header;
