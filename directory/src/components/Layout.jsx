import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  HouseSimple, Stack, Plus, Calculator, Books, Folder, GearSix, Ruler,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Dashboard", icon: HouseSimple, end: true },
  { to: "/projects", label: "Projects", icon: Folder },
  { to: "/projects/new", label: "New Estimate", icon: Plus },
  { to: "/rates", label: "Rate Library", icon: Calculator },
  { to: "/templates", label: "Templates", icon: Books },
  { to: "/settings", label: "Settings", icon: GearSix },
];

export default function Layout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-white lg:flex"
        data-testid="sidebar"
      >
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Ruler size={20} weight="bold" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold">BOQify</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Estimator</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          <div className="px-3 pb-2 section-label">Workspace</div>
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}
              data-testid={`nav-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <n.icon size={18} weight="regular" />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="m-3 rounded-lg border border-border bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <span className="accent-dot" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Quick Tip
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            Start from a template for fastest, most accurate estimates.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3 w-full"
            onClick={() => navigate("/templates")}
            data-testid="tip-browse-templates"
          >
            Browse Templates
          </Button>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Ruler size={16} weight="bold" />
          </div>
          <div className="font-display text-base font-bold">BOQify</div>
        </div>
        <Button size="sm" onClick={() => navigate("/projects/new")} data-testid="mobile-new-btn">
          <Plus size={16} className="mr-1" /> New
        </Button>
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-border bg-white lg:hidden">
        {NAV.slice(0, 5).map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium ${isActive ? "text-primary" : "text-slate-500"}`
            }
            data-testid={`mnav-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <n.icon size={18} weight="regular" />
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Main */}
      <main className="lg:pl-60">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
