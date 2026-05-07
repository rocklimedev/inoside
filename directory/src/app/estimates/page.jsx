"use client";

import { useEffect, useState } from "react";
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
  quick: "border border-accent/20 bg-accent/10 text-accent",
  detailed: "border border-primary/20 bg-primary/10 text-primary",
  renovation:
    "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  interior:
    "border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400",
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

  const filtered = projects.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(q.toLowerCase()) ||
      (p.client_name || "").toLowerCase().includes(q.toLowerCase()) ||
      (p.location || "").toLowerCase().includes(q.toLowerCase()),
  );

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
      className="space-y-6 animate-in fade-in duration-300"
      data-testid="projects-page"
    >
      <PageHeader
        title="Projects"
        subtitle="Manage all estimates and BOQs in one place"
        actions={
          <Button
            onClick={() => router.push("/projects/new")}
            className="gap-2"
            data-testid="projects-new-btn"
          >
            <Plus className="h-4 w-4" />
            New Estimate
          </Button>
        }
      />

      {/* Search */}
      <Card className="border border-border/60 bg-card/60 backdrop-blur-sm">
        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search projects, client or location..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-10"
              data-testid="projects-search"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SquareStack className="h-4 w-4" />
            {filtered.length} of {projects.length} projects
          </div>
        </div>
      </Card>

      {/* Loading */}
      {loading ? (
        <Card className="flex min-h-[280px] items-center justify-center border border-border/60">
          <div className="space-y-3 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />

            <p className="text-sm text-muted-foreground">Loading projects...</p>
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        /* Empty State */
        <Card className="border border-dashed border-border/80 bg-card/40 p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FolderOpen className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-2xl font-semibold tracking-tight">
            No projects found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Create your first construction estimate and generate professional
            BOQs, costing sheets, and reports.
          </p>

          <Button
            className="mt-6 gap-2"
            onClick={() => router.push("/projects/new")}
            data-testid="empty-new-btn"
          >
            <Plus className="h-4 w-4" />
            Create First Estimate
          </Button>
        </Card>
      ) : (
        /* Cards */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((p) => {
            const total =
              (p.boq_items || []).reduce((s, i) => s + (i.amount || 0), 0) +
              (p.custom_items || []).reduce((s, i) => s + (i.amount || 0), 0);

            return (
              <Card
                key={p.id}
                className="group relative overflow-hidden border border-border/60 bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                data-testid={`project-card-${p.id}`}
              >
                {/* Top Accent */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

                <div className="space-y-5 p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/projects/${p.id}`}
                        className="line-clamp-1 text-lg font-semibold tracking-tight transition-colors hover:text-primary"
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
                      className={`capitalize ${MODE_BADGE[p.mode] || ""}`}
                    >
                      {p.mode}
                    </Badge>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 rounded-xl border border-border/50 bg-muted/30 p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <SquareStack className="h-3.5 w-3.5" />
                        Area
                      </div>

                      <div className="text-sm font-semibold tabular-nums">
                        {formatNumber(p.built_up_area || 0, 0)} sqft
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5" />
                        Quality
                      </div>

                      <div className="text-sm font-semibold capitalize">
                        {p.quality || "standard"}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        Location
                      </div>

                      <div className="line-clamp-1 text-sm font-semibold">
                        {p.location || "—"}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Updated
                      </div>

                      <div className="text-sm font-semibold">
                        {formatDate(p.updated_at)}
                      </div>
                    </div>
                  </div>

                  {/* Value */}
                  <div className="rounded-xl border border-border/50 bg-background/60 p-4">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
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
                          className="hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleDuplicate(p.id)}
                          data-testid={`duplicate-${p.id}`}
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-destructive/10 hover:text-destructive"
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
                      className="mt-4 w-full"
                      onClick={() => router.push(`/projects/${p.id}`)}
                      data-testid={`open-${p.id}`}
                    >
                      Open BOQ
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>

            <AlertDialogDescription>
              "{toDelete?.name}" will be permanently deleted. This action cannot
              be undone.
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
  );
}
