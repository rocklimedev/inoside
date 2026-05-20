"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Menu,
  Search,
  Plus,
  X,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";

import Link from "next/link";

import { TooltipProvider } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";

import SidebarContent from "@/components/layouts/SidebarContent";
import NotificationsDropdown from "./modals/NotificationsDropdown";
import GlobalSearchModal from "@/components/modals/GlobalSearchModal";

import { quickActions } from "@/lib/defaults";
import { useAuth } from "@/contexts/AuthContext";

// ======================================================
// DEBUG LOGGER
// ======================================================

const LAYOUT_DEBUG = process.env.NODE_ENV === "development";

const layoutLog = (...args) => {
  if (LAYOUT_DEBUG) {
    console.log(
      "%c[DASHBOARD LAYOUT]",
      "color:#8b5cf6;font-weight:bold;",
      ...args,
    );
  }
};

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const router = useRouter();
  const { user, logout } = useAuth();

  // GLOBAL CMD + K Shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }

      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    layoutLog("Logout initiated");
    logout();
    router.replace("/login");
  };

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  layoutLog("DashboardLayout rendered", {
    role: user?.role,
    collapsed,
    mobileMenuOpen,
  });

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen bg-[#f8f9fa]">
        {/* SIDEBAR */}
        <aside
          className={`hidden md:flex flex-col border-r border-gray-200 bg-white transition-all duration-200 ${
            collapsed ? "w-[60px]" : "w-[250px]"
          }`}
        >
          <SidebarContent
            collapsed={collapsed}
            onMobileClose={() => setMobileMenuOpen(false)}
          />
        </aside>

        {/* MOBILE SIDEBAR */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setMobileMenuOpen(false)}
            />

            <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-white flex flex-col shadow-xl">
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
                <div className="text-xl font-black">
                  BUILD<span className="text-[#ef7f1b]">CON</span>
                </div>

                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <SidebarContent
                isMobile
                onMobileClose={() => setMobileMenuOpen(false)}
              />
            </aside>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* HEADER */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
            {/* LEFT SECTION */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-500 hover:text-gray-800 p-2"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Desktop Collapse Button */}
              <button
                onClick={toggleSidebar}
                className="hidden md:flex text-gray-500 hover:text-gray-800 p-2 rounded-xl hover:bg-gray-100"
              >
                <ChevronLeft
                  className={`w-5 h-5 transition-transform duration-200 ${
                    collapsed ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div>
                <h1 className="text-base font-bold text-black leading-tight">
                  {user?.role ? user.role.replace("_", " ") : "Dashboard"}
                </h1>
                <p className="text-[11px] text-gray-400">
                  Welcome back, {user?.name || "User"}
                </p>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-2">
              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="
                  hidden lg:flex items-center gap-3
                  h-9 w-[260px]
                  px-3
                  rounded-xl
                  border border-gray-200
                  bg-gray-50
                  hover:bg-white hover:border-[#ef7f1b]/40
                  transition
                "
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400 flex-1 text-left">
                  Search anything...
                </span>
                <span className="text-[10px] text-gray-400 border px-1.5 py-0.5 rounded-md bg-white">
                  ⌘K
                </span>
              </button>

              {/* Quick Add */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="
                      w-9 h-9 rounded-xl
                      bg-[#ef7f1b]
                      text-white
                      flex items-center justify-center
                      hover:bg-[#d66e15]
                      transition
                    "
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  {quickActions.map((action, i) => (
                    <DropdownMenuItem
                      key={i}
                      onClick={() =>
                        toast.info(`${action.label} - Coming soon`)
                      }
                    >
                      <action.icon className="w-4 h-4 mr-2 text-[#ef7f1b]" />
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <NotificationsDropdown />

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="
                      w-9 h-9 rounded-full
                      bg-[#ef7f1b]
                      text-white
                      flex items-center justify-center
                      text-xs font-bold
                      hover:bg-[#d66e15]
                      transition
                    "
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                    <p className="text-[10px] text-[#ef7f1b] font-bold uppercase mt-1">
                      {user?.role || "User"}
                    </p>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-[#e31d3b] focus:text-[#e31d3b]"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>

      {/* GLOBAL SEARCH MODAL */}
      <GlobalSearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </TooltipProvider>
  );
}
