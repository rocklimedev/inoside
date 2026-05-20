"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Search,
  Command,
  ArrowRight,
  LayoutDashboard,
  FolderKanban,
  Users,
  MessageCircle,
  Sparkles,
  ClipboardList,
  BarChart3,
  FileText,
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
  { label: "Clients", path: "/clients", icon: Users, category: "CRM" },
  {
    label: "Chat",
    path: "/chat",
    icon: MessageCircle,
    category: "Communication",
  },
  { label: "Designs", path: "/designs", icon: Sparkles, category: "Creative" },
  { label: "BOQ", path: "/boq", icon: ClipboardList, category: "Operations" },
  {
    label: "Reports",
    path: "/reports",
    icon: BarChart3,
    category: "Analytics",
  },
  { label: "Documents", path: "/documents", icon: FileText, category: "Files" },
];

export default function GlobalSearchModal({ open, onOpenChange }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  const results = useMemo(() => {
    if (!q.trim()) return quickLinks;
    return quickLinks.filter((i) =>
      `${i.label} ${i.category}`.toLowerCase().includes(q.toLowerCase()),
    );
  }, [q]);

  const go = (path) => {
    router.push(path);
    setQ("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-[95vw]
          sm:w-[640px]
          max-w-[95vw]

          max-h-[85vh]
          overflow-hidden

          p-0
          rounded-2xl
          border border-border/60
          bg-card/90
          backdrop-blur-2xl
          shadow-glow
        "
      >
        <DialogTitle className="sr-only">Command Palette</DialogTitle>

        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60 bg-background/60">
          <Search className="h-4 w-4 text-muted-foreground" />

          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search anything…"
            className="
              flex-1
              bg-transparent
              outline-none
              text-sm
              text-foreground
              placeholder:text-muted-foreground
            "
          />

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Command className="h-3.5 w-3.5" />K
          </div>
        </div>

        {/* RESULTS (SCROLL FIX) */}
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="p-2">
            {results.length === 0 ? (
              <div className="py-14 text-center text-sm text-muted-foreground">
                No results found
              </div>
            ) : (
              results.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.path}
                    onClick={() => go(item.path)}
                    className="
                      group
                      w-full
                      flex items-center gap-3
                      rounded-xl
                      px-3 py-2
                      text-left
                      transition
                      hover:bg-muted
                    "
                  >
                    {/* ICON */}
                    <div
                      className="
                        flex h-9 w-9 items-center justify-center
                        rounded-lg
                        bg-muted
                        group-hover:bg-primary/10
                        transition
                      "
                    >
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </div>

                    {/* TEXT */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.category}
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border/60 bg-background/40 text-xs text-muted-foreground">
          <span>Navigate with ↑ ↓ Enter</span>
          <span>ESC to close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
