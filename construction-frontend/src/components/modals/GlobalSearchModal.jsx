// components/modals/GlobalSearchModal.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Search,
  Command,
  ArrowRight,
  FolderKanban,
  Users,
  MessageCircle,
  LayoutDashboard,
  FileText,
  ClipboardList,
  BarChart3,
  Sparkles,
} from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";

const quickLinks = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    category: "Overview",
  },
  {
    label: "Projects",
    path: "/projects",
    icon: FolderKanban,
    category: "Workspace",
  },
  {
    label: "Clients",
    path: "/clients",
    icon: Users,
    category: "CRM",
  },
  {
    label: "Chat",
    path: "/chat",
    icon: MessageCircle,
    category: "Communication",
  },
  {
    label: "Designs",
    path: "/designs",
    icon: Sparkles,
    category: "Creative",
  },
  {
    label: "BOQ",
    path: "/boq",
    icon: ClipboardList,
    category: "Operations",
  },
  {
    label: "Reports",
    path: "/reports",
    icon: BarChart3,
    category: "Analytics",
  },
  {
    label: "Documents",
    path: "/documents",
    icon: FileText,
    category: "Files",
  },
];

export default function GlobalSearchModal({ open, onOpenChange }) {
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return quickLinks;

    return quickLinks.filter((item) =>
      `${item.label} ${item.category}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const handleQuickNav = (path) => {
    router.push(path);
    onOpenChange(false);
    setSearchQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          p-0
          overflow-hidden
          border-border/60
          bg-card/95
          backdrop-blur-xl
          shadow-glow
          sm:max-w-3xl
        "
      >
        <DialogTitle className="sr-only">Global Search</DialogTitle>

        <div className="relative">
          {/* Top Glow */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-orange/10 to-transparent pointer-events-none" />

          {/* Search Header */}
          <div className="relative border-b border-border/60 px-5 py-4">
            <div
              className="
                flex items-center gap-3
                rounded-2xl
                border border-border/70
                bg-background/80
                px-4 py-3
                shadow-sm
                transition-all
                focus-within:border-primary/40
                focus-within:shadow-glow
              "
            >
              <div
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl
                  bg-primary/10
                  text-primary
                "
              >
                <Search className="h-5 w-5" />
              </div>

              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, clients, BOQ, reports..."
                className="
                  flex-1
                  border-none
                  bg-transparent
                  p-0
                  text-base
                  text-foreground
                  placeholder:text-muted-foreground
                  focus-visible:ring-0
                "
              />

              <div
                className="
                  hidden sm:flex items-center gap-1
                  rounded-lg
                  border border-border/70
                  bg-muted/60
                  px-2 py-1
                  text-xs text-muted-foreground
                "
              >
                <Command className="h-3.5 w-3.5" />K
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between px-1">
              <p className="text-xs text-muted-foreground">
                Jump anywhere across your workspace
              </p>

              <p className="text-xs text-muted-foreground">
                Press ESC to close
              </p>
            </div>
          </div>

          {/* Results */}
          <ScrollArea className="max-h-[70vh]">
            <div className="p-4">
              {filteredItems.length === 0 ? (
                <div
                  className="
                    flex flex-col items-center justify-center
                    py-16 text-center animate-fadeIn
                  "
                >
                  <div
                    className="
                      mb-4 flex h-16 w-16 items-center justify-center
                      rounded-2xl
                      bg-muted
                    "
                  >
                    <Search className="h-7 w-7 text-muted-foreground" />
                  </div>

                  <h3 className="text-lg font-semibold">No results found</h3>

                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    We couldn&apos;t find anything matching{" "}
                    <span className="font-medium text-foreground">
                      "{searchQuery}"
                    </span>
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between px-1">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Quick Navigation
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {filteredItems.length} result
                        {filteredItems.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    {filteredItems.map((item, i) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={i}
                          onClick={() => handleQuickNav(item.path)}
                          className="
                            group
                            relative
                            overflow-hidden
                            rounded-2xl
                            border border-border/60
                            bg-card/70
                            p-4
                            text-left
                            transition-all duration-200
                            hover:-translate-y-0.5
                            hover:border-primary/30
                            hover:bg-accent/40
                            hover:shadow-soft
                            animate-fadeInUp
                          "
                        >
                          {/* Hover Gradient */}
                          <div
                            className="
                              absolute inset-0 opacity-0
                              transition-opacity duration-300
                              group-hover:opacity-100
                              bg-gradient-to-r
                              from-primary/5
                              via-transparent
                              to-primary/5
                            "
                          />

                          <div className="relative flex items-center gap-4">
                            <div
                              className="
                                flex h-12 w-12 shrink-0
                                items-center justify-center
                                rounded-2xl
                                bg-primary/10
                                text-primary
                                transition-transform
                                group-hover:scale-105
                              "
                            >
                              <Icon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-foreground">
                                {item.label}
                              </h3>

                              <p className="mt-1 text-sm text-muted-foreground">
                                {item.category}
                              </p>
                            </div>

                            <ArrowRight
                              className="
                                h-4 w-4 shrink-0
                                text-muted-foreground
                                transition-all
                                group-hover:translate-x-1
                                group-hover:text-primary
                              "
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
