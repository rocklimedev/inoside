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
  Calendar,
  FileText,
  Presentation,
  MapPin,
  ClipboardList,
  Clock,
  Calculator,
  Palette,
  Hammer,
  Store,
  Package,
  CheckCircle,
  Handshake,
  PenTool,
  ThumbsUp,
  BarChart3,
  History,
  ListTodo,
  Building2,
  StickyNote,
  Search,
  Bell,
  Plus,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Upload,
  FileUp,
  Files,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";

const navSections = [
  {
    title: "MAIN",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/" },
      { icon: FolderKanban, label: "Projects", path: "/projects" },
      { icon: Users, label: "Vendors", path: "/vendors" },
      { icon: Users, label: "Estimates", path: "/estimates" },
      { icon: Users, label: "BOQs", path: "/boq" },
    ],
  },
];

const quickActions = [
  { icon: Upload, label: "Upload Design" },
  { icon: FileUp, label: "Upload Execution Drawing" },
  { icon: Presentation, label: "Create Pitch Document" },
  { icon: Calculator, label: "Add BOQ Version" },
  { icon: ThumbsUp, label: "Review Client Remarks" },
];

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const SidebarContent = ({ isMobile = false }) => (
    <>
      {/* Logo */}
      <div
        className={`flex items-center h-16 border-b border-gray-100 shrink-0 ${collapsed && !isMobile ? "justify-center px-2" : "px-6"}`}
      >
        {collapsed && !isMobile ? (
          <span className="text-xl font-black text-[#ef7f1b]">B</span>
        ) : (
          <div className="flex items-baseline">
            <span className="text-xl font-black text-black">BUILD</span>
            <span className="text-xl font-black text-[#ef7f1b]">CON</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        {navSections.map((section, si) => (
          <div key={si} className="mb-2">
            {(!collapsed || isMobile) && (
              <p className="px-6 mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mt-3">
                {section.title}
              </p>
            )}
            {collapsed && !isMobile && si > 0 && (
              <div className="mx-3 my-2 h-px bg-gray-100" />
            )}

            {section.items.map((item, ii) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.path ||
                (item.path === "/dashboard" &&
                  pathname.startsWith("/dashboard"));

              return (
                <div key={`${si}-${ii}`}>
                  {collapsed && !isMobile ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleNavClick(item)}
                          className={`flex items-center justify-center w-full px-2 py-2.5 text-sm transition-colors ${
                            isActive
                              ? "bg-orange-50 text-[#ef7f1b] font-medium"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                          }`}
                        >
                          <Icon className="w-[18px] h-[18px] shrink-0" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-gray-900 text-white text-xs px-2 py-1"
                      >
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <button
                      onClick={() => handleNavClick(item)}
                      className={`flex items-center gap-3 w-full px-6 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-orange-50 text-[#ef7f1b] font-medium"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                    >
                      <Icon className="w-[18px] h-[18px] shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </ScrollArea>

      {/* Collapse Toggle (Desktop) */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-12 border-t border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
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

  const handleNavClick = (item) => {
    if (item.path === "/dashboard") {
      const roleRoute = {
        Architect: "/dashboard/architect",
        Client: "/dashboard/client",
        Builder: "/dashboard/builder",
        "Site Supervisor": "/dashboard/supervisor",
        "Team Member": "/dashboard/team",
      };
      router.push(roleRoute[user?.role] || "/dashboard/architect");
    } else {
      router.push(item.path);
    }

    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className="flex h-screen bg-[#f8f9fa]"
        data-testid="dashboard-layout"
      >
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col border-r border-gray-200 bg-white transition-all duration-200 ${collapsed ? "w-[60px]" : "w-[250px]"}`}
        >
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-white flex flex-col shadow-xl">
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
                <div className="flex items-baseline">
                  <span className="text-xl font-black text-black">BUILD</span>
                  <span className="text-xl font-black text-[#ef7f1b]">CON</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent isMobile />
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden text-gray-500 hover:text-gray-800"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-base font-bold text-black leading-tight">
                  {user?.role} Dashboard
                </h1>
                <p className="text-[11px] text-gray-400">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-8 h-8 rounded-full bg-[#ef7f1b] text-white flex items-center justify-center text-xs font-bold hover:bg-[#d66e15] transition-colors">
                    {user?.name?.charAt(0) || "U"}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {user?.email}
                    </p>
                    <p className="text-[10px] text-[#ef7f1b] font-bold uppercase tracking-wider mt-1">
                      {user?.role}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
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

          {/* Page Content */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
