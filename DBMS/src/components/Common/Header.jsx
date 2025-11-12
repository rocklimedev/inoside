import React from "react";

const Header = () => {
  return (
    <div class="header">
      <div class="main-header">
        <div class="header-left">
          <a href="index.html" class="logo">
            <img src="assets/img/logo.svg" alt="Logo" />
          </a>
          <a href="index.html" class="dark-logo">
            <img src="assets/img/logo-white.svg" alt="Logo" />
          </a>
        </div>

        <a id="mobile_btn" class="mobile_btn" href="#sidebar">
          <span class="bar-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </a>

        <div class="dropdown mobile-user-menu profile-dropdown">
          <a
            href="javascript:void(0);"
            class="dropdown-toggle d-flex align-items-center"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
          >
            <span class="avatar avatar-md online">
              <img
                src="assets/img/profiles/avatar-01.jpg"
                alt="Img"
                class="img-fluid rounded-circle"
              />
            </span>
          </a>
          <div class="dropdown-menu p-2 mt-0">
            <a
              class="dropdown-item d-flex align-items-center"
              href="profile.html"
            >
              <i class="isax isax-profile-circle me-2"></i>Profile Settings
            </a>
            <a
              class="dropdown-item d-flex align-items-center"
              href="reports.html"
            >
              <i class="isax isax-document-text me-2"></i>Reports
            </a>
            <a
              class="dropdown-item d-flex align-items-center"
              href="account-settings.html"
            >
              <i class="isax isax-setting me-2"></i>Settings
            </a>
            <a
              class="dropdown-item logout d-flex align-items-center"
              href="login.html"
            >
              <i class="isax isax-logout me-2"></i>Signout
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
