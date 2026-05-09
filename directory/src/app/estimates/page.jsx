"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Plus,
  Copy,
  Trash2,
  Search,
  FolderOpen,
  MapPin,
  CalendarDays,
  SquareStack,
  Sparkles,
  ArrowRight,
  Building2,
  TrendingUp,
  Layers3,
} from "lucide-react";

import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { listProjects, duplicateProject, deleteProject } from "@/lib/api";

import { formatCompactINR, formatNumber, formatDate } from "@/lib/format";

const MODE_BADGE = {
  quick:
    "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400",

  detailed: "border-primary/20 bg-primary/10 text-primary",

  renovation:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

  interior:
    "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

export default function ProjectsList() {
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [toDelete, setToDelete] = useState(null);

  const load = () => {
    setLoading(true);

    listProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return projects.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q.toLowerCase()) ||
        (p.client_name || "").toLowerCase().includes(q.toLowerCase()) ||
        (p.location || "").toLowerCase().includes(q.toLowerCase()),
    );
  }, [projects, q]);

  const totalValue = filtered.reduce((sum, p) => {
    const total =
      (p.boq_items || []).reduce((s, i) => s + (i.amount || 0), 0) +
      (p.custom_items || []).reduce((s, i) => s + (i.amount || 0), 0);

    return sum + total;
  }, 0);

  const handleDuplicate = async (id) => {
    try {
      const p = await duplicateProject(id);

      toast.success("Project duplicated");

      router.push(`/projects/${p.id}`);
    } catch (e) {
      toast.error("Failed to duplicate");
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;

    try {
      await deleteProject(toDelete.id);

      toast.success("Project deleted");

      setToDelete(null);

      load();
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      data-testid="projects-page"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-muted/20" />

      {/* Decorative Blurs */}
      <div className="absolute left-0 top-0 -z-10 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <PageHeader
            title="Projects"
            subtitle="Manage all estimates, BOQs and costing reports in one place."
            actions={
              <Button
                onClick={() => router.push("/projects/new")}
                className="group gap-2 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
                data-testid="projects-new-btn"
              >
                <Plus className="h-4 w-4" />
                New Estimate
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            }
          />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <MiniStat label="Projects" value={projects.length} icon={Layers3} />

            <MiniStat label="Active" value={filtered.length} icon={Building2} />

            <MiniStat
              label="Portfolio"
              value={formatCompactINR(totalValue)}
              icon={TrendingUp}
            />
          </div>
        </div>

        {/* Search Bar */}
        <Card className="overflow-hidden border border-border/60 bg-card/70 shadow-xl backdrop-blur-sm">
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full max-w-lg">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  placeholder="Search projects, client or location..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="h-11 rounded-xl border-border/60 bg-background/70 pl-11 shadow-sm backdrop-blur-sm"
                  data-testid="projects-search"
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/60 px-4 py-2 text-sm text-muted-foreground">
                <SquareStack className="h-4 w-4" />
                <span className="font-medium text-foreground">
                  {filtered.length}
                </span>
                of {projects.length} projects
              </div>
            </div>
          </div>
        </Card>

        {/* Loading */}
        {loading ? (
          <Card className="flex min-h-[320px] items-center justify-center border border-border/60 bg-card/70 shadow-xl backdrop-blur-sm">
            <div className="space-y-4 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />

              <div>
                <p className="font-medium">Loading Projects</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Fetching your latest estimates...
                </p>
              </div>
            </div>
          </Card>
        ) : filtered.length === 0 ? (
          /* Empty State */
          <Card className="overflow-hidden border border-dashed border-border/70 bg-card/60 p-14 text-center shadow-xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-primary/5" />

            <div className="relative">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 to-orange-500/10 text-primary shadow-inner">
                <FolderOpen className="h-10 w-10" />
              </div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight">
                No projects found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                Create your first construction estimate and generate
                professional BOQs, costing sheets and reports.
              </p>

              <Button
                className="mt-8 gap-2 rounded-xl shadow-lg"
                onClick={() => router.push("/projects/new")}
                data-testid="empty-new-btn"
              >
                <Plus className="h-4 w-4" />
                Create First Estimate
              </Button>
            </div>
          </Card>
        ) : (
          /* Project Cards */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {filtered.map((p, index) => {
              const total =
                (p.boq_items || []).reduce((s, i) => s + (i.amount || 0), 0) +
                (p.custom_items || []).reduce((s, i) => s + (i.amount || 0), 0);

              return (
                <Card
                  key={p.id}
                  className="group relative overflow-hidden border border-border/60 bg-card/80 shadow-lg backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl"
                  data-testid={`project-card-${p.id}`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-transparent to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Top Accent */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-primary to-orange-500" />

                  {/* Hover Glow */}
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative space-y-5 p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/projects/${p.id}`}
                          className="line-clamp-1 text-xl font-bold tracking-tight transition-colors hover:text-primary"
                        >
                          {p.name}
                        </Link>

                        {p.client_name && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            Client:{" "}
                            <span className="font-medium text-foreground">
                              {p.client_name}
                            </span>
                          </p>
                        )}
                      </div>

                      <Badge
                        variant="outline"
                        className={`capitalize rounded-full px-3 py-1 text-xs ${MODE_BADGE[p.mode] || ""}`}
                      >
                        {p.mode}
                      </Badge>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/50 bg-muted/20 p-4 backdrop-blur-sm">
                      <InfoItem
                        icon={SquareStack}
                        label="Area"
                        value={`${formatNumber(p.built_up_area || 0, 0)} sqft`}
                      />

                      <InfoItem
                        icon={Sparkles}
                        label="Quality"
                        value={p.quality || "standard"}
                        capitalize
                      />

                      <InfoItem
                        icon={MapPin}
                        label="Location"
                        value={p.location || "—"}
                      />

                      <InfoItem
                        icon={CalendarDays}
                        label="Updated"
                        value={formatDate(p.updated_at)}
                      />
                    </div>

                    {/* Value */}
                    <div className="rounded-2xl border border-border/50 bg-background/70 p-5 shadow-inner">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                            Estimated Value
                          </p>

                          <h3 className="mt-1 text-3xl font-bold tracking-tight tabular-nums">
                            {formatCompactINR(total)}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="rounded-xl hover:bg-primary/10 hover:text-primary"
                            onClick={() => handleDuplicate(p.id)}
                            data-testid={`duplicate-${p.id}`}
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setToDelete(p)}
                            data-testid={`delete-${p.id}`}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="group/btn mt-5 h-11 w-full rounded-xl border-border/60 bg-background/80 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
                        onClick={() => router.push(`/projects/${p.id}`)}
                        data-testid={`open-${p.id}`}
                      >
                        Open BOQ
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Delete Dialog */}
        <AlertDialog
          open={!!toDelete}
          onOpenChange={(o) => !o && setToDelete(null)}
        >
          <AlertDialogContent className="border-border/60 bg-background/95 backdrop-blur-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this project?</AlertDialogTitle>

              <AlertDialogDescription>
                "
                <span className="font-medium text-foreground">
                  {toDelete?.name}
                </span>
                " will be permanently deleted. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel data-testid="delete-cancel">
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-testid="delete-confirm"
              >
                Delete Project
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-background/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xl font-bold tracking-tight">{value}</div>

          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, capitalize = false }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />

        {label}
      </div>

      <div
        className={`line-clamp-1 text-sm font-semibold ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
