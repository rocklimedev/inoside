import React from "react";

const Sidebar = () => {
  return (
    <div class="sidebar" id="sidebar-two">
      <div class="sidebar-logo">
        <a href="index.html" class="logo logo-normal">
          <img src="assets/img/logo.svg" alt="Logo" />
        </a>
        <a href="index.html" class="logo-small">
          <img src="assets/img/logo-small.svg" alt="Logo" />
        </a>
        <a href="index.html" class="dark-logo">
          <img src="assets/img/logo-white.svg" alt="Logo" />
        </a>
        <a href="index.html" class="dark-small">
          <img src="assets/img/logo-small-white.svg" alt="Logo" />
        </a>

        <a id="toggle_btn" href="javascript:void(0);">
          <i class="isax isax-menu-1"></i>
        </a>
      </div>

      <div class="sidebar-inner" data-simplebar>
        <div id="sidebar-menu" class="sidebar-menu">
          <ul>
            <li>
              <a href="https://kanakku.dreamstechnologies.com/html/sass-landing/index.html">
                <i class="isax isax-note-215"></i>
                <span>Frontend</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
