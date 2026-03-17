// src/App.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Header from "./components/Common/Header";
import Sidebar from "./components/Common/Sidebar";
import Footer from "./components/Common/Footer";
import { Router as AppRoutes } from "./router/Router";

import { useSelector, useDispatch } from "react-redux";
import { logout, setCredentials } from "./api/authSlice";
import { useGetProfileQuery } from "./api/authApi";
import { Spin } from "antd";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Now safe — inside <BrowserRouter>
  const location = useLocation(); // Now safe

  const { token, user: reduxUser } = useSelector((state) => state.auth);

  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 992);

  const MAINTENANCE_MODE = false;

  const authPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-account",
    "/under-maintenance",
    "/coming-soon",
    "/404",
    "/no-access",
  ];

  const isAuthPage = authPages.some(
    (path) =>
      location.pathname.startsWith(path) ||
      location.pathname === path.split(":")[0],
  );

  const isMaintenancePage = location.pathname === "/under-maintenance";

  // Resize handler
  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 992);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Click outside to close sidebar (mobile/tablet)
  useEffect(() => {
    if (window.innerWidth >= 992) return;

    const handleClick = (e) => {
      if (
        isSidebarOpen &&
        !e.target.closest("#sidebar") &&
        !e.target.closest("#mobile_btn")
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isSidebarOpen]);

  // Profile query
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetProfileQuery(undefined, {
    skip: !token || isAuthPage,
  });

  // Sync profile to Redux
  useEffect(() => {
    if (profileData && !reduxUser) {
      dispatch(
        setCredentials({ user: profileData.user || profileData, token }),
      );
    }
  }, [profileData, reduxUser, token, dispatch]);

  // Handle expired session
  useEffect(() => {
    if (profileError?.status === 401 || profileError?.status === 403) {
      toast.error("Session expired. Logging you out...");
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  }, [profileError, dispatch, navigate]);

  // Protect routes
  useEffect(() => {
    if (!token && !isAuthPage && !isProfileLoading) {
      toast.warning("Please log in to continue.");
      navigate("/login", { replace: true });
    }
  }, [token, isAuthPage, isProfileLoading, navigate]);

  // Role & verification check
  useEffect(() => {
    if (!profileData?.user || isAuthPage || !token) return;

    const user = profileData.user;
    const hasAccess =
      user.isEmailVerified && user.roles && user.roles.length > 0;

    if (!hasAccess && location.pathname !== "/no-access") {
      toast.warning("Access restricted. Please verify your account.");
      navigate("/no-access", { replace: true });
    } else if (hasAccess && location.pathname === "/no-access") {
      navigate("/", { replace: true });
    }
  }, [profileData, location.pathname, isAuthPage, token, navigate]);

  // Maintenance mode
  useEffect(() => {
    if (MAINTENANCE_MODE && !isMaintenancePage) {
      navigate("/under-maintenance", { replace: true });
    }
  }, [MAINTENANCE_MODE, isMaintenancePage, navigate]);

  if (isProfileLoading && token && !isAuthPage) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={`main-wrapper ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {!isAuthPage && (
        <>
          <Header
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />
        </>
      )}

      <div className="page-wrapper">
        <div className="content">
          <AppRoutes />
        </div>
        {!isAuthPage && <Footer />}
      </div>
    </div>
  );
}

export default App;
