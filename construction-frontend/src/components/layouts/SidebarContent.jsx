"use client";

import { usePathname, useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { navSections } from "@/lib/defaults";
import { useAuth } from "@/contexts/AuthContext";

export default function SidebarContent({
  collapsed = false,
  isMobile = false,
  onMobileClose,
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, getDefaultRoute } = useAuth();

  const handleNavClick = (path) => {
    if (path === "/dashboard") {
      const targetRoute = getDefaultRoute?.() || "/dashboard/architect";
      router.push(targetRoute);
    } else {
      router.push(path);
    }

    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const isActive = (itemPath) => {
    return (
      pathname === itemPath ||
      (itemPath === "/dashboard" && pathname.startsWith("/dashboard"))
    );
  };

  return (
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
              const active = isActive(item.path);

              const button = (
                <button
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center gap-3 w-full transition-colors ${
                    collapsed && !isMobile
                      ? "justify-center px-2 py-2.5"
                      : "px-6 py-2"
                  } text-sm ${
                    active
                      ? "bg-orange-50 text-[#ef7f1b] font-medium"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  {(!collapsed || isMobile) && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              );

              return collapsed && !isMobile ? (
                <TooltipProvider key={`${si}-${ii}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-gray-900 text-white text-xs px-2 py-1"
                    >
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <div key={`${si}-${ii}`}>{button}</div>
              );
            })}
          </div>
        ))}
      </ScrollArea>

      {/* Collapse Toggle (Desktop Only) */}
      {!isMobile && (
        <button
          onClick={() => {}}
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
}
