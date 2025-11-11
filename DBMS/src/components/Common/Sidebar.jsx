import React from "react";

const Sidebar = () => {
  return (
    <div class="two-col-sidebar" id="two-col-sidebar">
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
              <li class="menu-title">
                <span>Main</span>
              </li>
              <li>
                <ul>
                  <li class="submenu">
                    <a href="javascript:void(0);" class="active subdrop">
                      <i class="isax isax-element-45"></i>
                      <span>Dashboard</span>
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li>
                        <a href="index.html" class="active">
                          Admin Dashboard
                        </a>
                      </li>
                      <li>
                        <a href="admin-dashboard.html">Admin Dashboard 2</a>
                      </li>
                      <li>
                        <a href="customer-dashboard.html">Customer Dashboard</a>
                      </li>
                      <li>
                        <a href="super-admin-dashboard.html">
                          Super Admin Dashboard
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);">
                      <i class="isax isax-shapes5"></i>
                      <span>Super Admin</span>
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li>
                        <a href="super-admin-dashboard.html">Dashboard</a>
                      </li>
                      <li>
                        <a href="companies.html">Companies</a>
                      </li>
                      <li>
                        <a href="subscriptions.html">Subscriptions</a>
                      </li>
                      <li>
                        <a href="packages.html">Packages</a>
                      </li>
                      <li>
                        <a href="domain.html">Domain</a>
                      </li>
                      <li>
                        <a href="purchase-transaction.html">
                          Purchase Transaction
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="https://kanakku.dreamstechnologies.com/html/sass-landing/index.html">
                      <i class="isax isax-note-215"></i>
                      <span>Frontend</span>
                    </a>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);">
                      <i class="isax isax-category-25"></i>
                      <span>Applications</span>
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li>
                        <a href="chat.html">Chat</a>
                      </li>
                      <li class="submenu submenu-two">
                        <a href="call.html">
                          Calls<span class="menu-arrow inside-submenu"></span>
                        </a>
                        <ul>
                          <li>
                            <a href="voice-call.html">Voice Call</a>
                          </li>
                          <li>
                            <a href="video-call.html">Video Call</a>
                          </li>
                          <li>
                            <a href="outgoing-call.html">Outgoing Call</a>
                          </li>
                          <li>
                            <a href="incoming-call.html">Incoming Call</a>
                          </li>
                          <li>
                            <a href="call-history.html">Call History</a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a href="calendar.html">Calendar</a>
                      </li>
                      <li>
                        <a href="email.html">Email</a>
                      </li>
                      <li>
                        <a href="todo.html">To Do</a>
                      </li>
                      <li>
                        <a href="notes.html">Notes</a>
                      </li>
                      <li>
                        <a href="social-feed.html">Social Feed</a>
                      </li>
                      <li>
                        <a href="file-manager.html">File Manager</a>
                      </li>
                      <li>
                        <a href="kanban-view.html">Kanban</a>
                      </li>
                      <li>
                        <a href="contacts.html">Contacts</a>
                      </li>
                      <li>
                        <a href="invoice.html">Invoices</a>
                      </li>
                      <li>
                        <a href="search-list.html">Search List</a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
