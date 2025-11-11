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

        <div class="header-user">
          <div class="nav user-menu nav-list">
            <div class="me-auto d-flex align-items-center" id="header-search">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb breadcrumb-divide mb-0">
                  <li class="breadcrumb-item d-flex align-items-center">
                    <a href="index.html">
                      <i class="isax isax-home-2 me-1"></i>Home
                    </a>
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">
                    Dashboard
                  </li>
                </ol>
              </nav>
            </div>

            <div class="d-flex align-items-center">
              <div class="dropdown profile-dropdown">
                <a
                  href="javascript:void(0);"
                  class="dropdown-toggle d-flex align-items-center"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                >
                  <span class="avatar online">
                    <img
                      src="assets/img/profiles/avatar-01.jpg"
                      alt="Img"
                      class="img-fluid rounded-circle"
                    />
                  </span>
                </a>
                <div class="dropdown-menu p-2">
                  <div class="d-flex align-items-center bg-light rounded-1 p-2 mb-2">
                    <span class="avatar avatar-lg me-2">
                      <img
                        src="assets/img/profiles/avatar-01.jpg"
                        alt="img"
                        class="rounded-circle"
                      />
                    </span>
                    <div>
                      <h6 class="fs-14 fw-medium mb-1">Jafna Cremson</h6>
                      <p class="fs-13">Administrator</p>
                    </div>
                  </div>

                  <a
                    class="dropdown-item d-flex align-items-center"
                    href="account-settings.html"
                  >
                    <i class="isax isax-profile-circle me-2"></i>Profile
                    Settings
                  </a>

                  <a
                    class="dropdown-item d-flex align-items-center"
                    href="inventory-report.html"
                  >
                    <i class="isax isax-document-text me-2"></i>Reports
                  </a>

                  <hr class="dropdown-divider my-2" />

                  <a
                    class="dropdown-item logout d-flex align-items-center"
                    href="login.html"
                  >
                    <i class="isax isax-logout me-2"></i>Sign Out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

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
