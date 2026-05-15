"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, Search, Plus } from "lucide-react";
import { X } from "lucide-react";
import Link from "next/link";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

import SidebarContent from "@/components/layouts/SidebarContent";
import NotificationsDropdown from "./modals/NotificationsDropdown";
import GlobalSearchModal from "@/components/modals/GlobalSearchModal";
import { quickActions } from "@/lib/defaults";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  const router = useRouter();
  const { user, logout } = useAuth();

  // Global Hotkey: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen bg-[#f8f9fa]">
        {/* Desktop Sidebar */}
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

              <SidebarContent
                isMobile
                onMobileClose={() => setMobileMenuOpen(false)}
              />
            </aside>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Header */}
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
                  {user?.role?.display_name || user?.role?.name || "Dashboard"}
                </h1>
                <p className="text-[11px] text-gray-400">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 w-72 border border-transparent hover:border-[#ef7f1b]/30 hover:bg-white transition-all text-left"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  Search projects, docs... <span className="text-xs">(⌘K)</span>
                </span>
              </button>

              {/* Quick Add */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-8 h-8 rounded-lg bg-[#ef7f1b] text-white flex items-center justify-center hover:bg-[#d66e15] transition-colors">
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
                  <button className="w-8 h-8 rounded-full bg-[#ef7f1b] text-white flex items-center justify-center text-xs font-bold hover:bg-[#d66e15]">
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
                      {user?.role?.display_name || user?.role?.name}
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
                    className="text-[#e31d3b]"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>

      <GlobalSearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </TooltipProvider>
  );
}
