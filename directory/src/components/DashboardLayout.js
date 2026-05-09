"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  LayoutDashboard,
  FolderKanban,
  Users,
  ClipboardList,
  Calculator,
  Store,
  Search,
  Bell,
  Plus,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react";

const navSections = [
  {
    title: "MAIN",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/",
        color: "text-blue-500",
      },
      {
        icon: FolderKanban,
        label: "Projects",
        path: "/projects",
        color: "text-violet-500",
      },
      {
        icon: Calculator,
        label: "Estimates",
        path: "/estimates",
        color: "text-emerald-500",
      },
      {
        icon: ClipboardList,
        label: "BOQs",
        path: "/boq",
        color: "text-orange-500",
      },
      {
        icon: Store,
        label: "Vendors",
        path: "/vendors",
        color: "text-pink-500",
      },
      {
        icon: Users,
        label: "Users",
        path: "/users",
        color: "text-cyan-500",
      },
    ],
  },
];

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleNavClick = (item) => {
    router.push(item.path);

    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const SidebarContent = ({ isMobile = false }) => (
    <>
      {/* Logo */}
      <div
        className={`flex items-center h-16 border-b border-gray-100 shrink-0 ${
          collapsed && !isMobile ? "justify-center px-2" : "px-6"
        }`}
      >
        {collapsed && !isMobile ? (
          <span className="text-xl font-black text-[#ef7f1b]">B</span>
        ) : (
          <div className="flex items-baseline">
            <span className="text-xl font-black text-black">CM</span>

            <span className="text-xl font-black text-[#ef7f1b]">TOOLS</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        {navSections.map((section, si) => (
          <div key={si} className="mb-3">
            {(!collapsed || isMobile) && (
              <p className="px-6 mb-2 mt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                {section.title}
              </p>
            )}

            {section.items.map((item, ii) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.path || pathname.startsWith(item.path + "/");

              return (
                <div key={`${si}-${ii}`}>
                  {collapsed && !isMobile ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleNavClick(item)}
                          className={`group relative flex items-center justify-center w-full px-2 py-3 transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-orange-50 to-orange-100 text-[#ef7f1b]"
                              : "text-gray-500 hover:bg-gray-50 hover:text-black"
                          }`}
                        >
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#ef7f1b]" />
                          )}

                          <Icon
                            className={`w-[19px] h-[19px] transition-transform duration-200 group-hover:scale-110 ${
                              isActive ? "text-[#ef7f1b]" : item.color
                            }`}
                          />
                        </button>
                      </TooltipTrigger>

                      <TooltipContent
                        side="right"
                        className="bg-gray-900 text-white text-xs"
                      >
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <button
                      onClick={() => handleNavClick(item)}
                      className={`group relative flex items-center gap-3 w-full px-6 py-3 text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-orange-50 to-orange-100 text-[#ef7f1b] font-semibold"
                          : "text-gray-500 hover:bg-gray-50 hover:text-black"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#ef7f1b]" />
                      )}

                      <div
                        className={`transition-transform duration-200 group-hover:scale-110 ${
                          !isActive ? item.color : ""
                        }`}
                      >
                        <Icon className="w-[18px] h-[18px]" />
                      </div>

                      <span className="truncate">{item.label}</span>

                      <ChevronRight
                        className={`ml-auto w-4 h-4 transition-all duration-200 ${
                          isActive
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                        }`}
                      />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </ScrollArea>

      {/* Collapse */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-12 border-t border-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      )}
    </>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen bg-[#f8f9fa]">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col border-r border-gray-200 bg-white transition-all duration-200 ${
            collapsed ? "w-[68px]" : "w-[260px]"
          }`}
        >
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileMenuOpen(false)}
            />

            <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-white flex flex-col shadow-xl">
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
                <div className="flex items-baseline">
                  <span className="text-xl font-black text-black">CM</span>

                  <span className="text-xl font-black text-[#ef7f1b]">
                    DIRECTORY
                  </span>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <SidebarContent isMobile />
            </aside>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button
                className="md:hidden text-gray-500 hover:text-black"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-1 w-9 h-9 rounded-full bg-[#ef7f1b] text-white flex items-center justify-center text-xs font-bold hover:bg-[#d66e15] transition-colors shadow-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white border border-gray-200 shadow-xl backdrop-blur-none"
                >
                  <div className="px-3 py-3">
                    <p className="text-sm font-semibold">
                      {user?.name || "User"}
                    </p>

                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {user?.email || "No email"}
                    </p>

                    <p className="text-[10px] text-[#ef7f1b] font-bold uppercase tracking-wider mt-2">
                      {user?.role || "User"}
                    </p>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-[#e31d3b] focus:text-[#e31d3b] cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
