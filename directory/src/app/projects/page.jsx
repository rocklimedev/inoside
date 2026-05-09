"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

import { useAuth } from "@/contexts/AuthContext";

import {
  useGetAllProjectsQuery,
  useDeleteProjectMutation,
} from "@/api/projectApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ScrollArea } from "@/components/ui/scroll-area";

import { toast } from "sonner";

import {
  Search,
  LayoutGrid,
  List,
  Plus,
  Trash2,
  FolderOpen,
  Pencil,
} from "lucide-react";

import NewProjectDialog from "@/components/projects/NewprojectDialog";

import { Card } from "@/components/ui/card";

// ===================== MAIN COMPONENT =====================

export default function ProjectsPage() {
  const { api } = useAuth();

  // ===================== API =====================

  const {
    data: projectsData = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllProjectsQuery();

  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  // ===================== STATES =====================

  const [viewMode, setViewMode] = useState("grid");

  const [search, setSearch] = useState("");

  const [showNewProject, setShowNewProject] = useState(false);

  const [saving, setSaving] = useState(false);

  const [editingProject, setEditingProject] = useState(null);

  const [newProject, setNewProject] = useState({
    name: "",
  });

  // ===================== CREATE PROJECT =====================

  const handleCreate = async () => {
    if (!newProject.name.trim()) {
      toast.error("Project Name is required");
      return;
    }

    setSaving(true);

    try {
      await api.post("/projects", {
        name: newProject.name,
      });

      toast.success("Project created successfully");

      setShowNewProject(false);

      setEditingProject(null);

      setNewProject({
        name: "",
      });

      refetch();
    } catch (err) {
      toast.error("Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  // ===================== EDIT PROJECT =====================

  const handleEdit = async () => {
    if (!newProject.name.trim()) {
      toast.error("Project Name is required");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/projects/${editingProject.id}`, {
        name: newProject.name,
      });

      toast.success("Project updated successfully");

      setShowNewProject(false);

      setEditingProject(null);

      setNewProject({
        name: "",
      });

      refetch();
    } catch (err) {
      toast.error("Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  // ===================== DELETE =====================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) return;

    try {
      await deleteProject(id).unwrap();

      toast.success("Project deleted successfully");
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  // ===================== FILTERED DATA =====================

  const filtered = useMemo(() => {
    let result = [...projectsData];

    if (search) {
      const s = search.toLowerCase();

      result = result.filter((p) => p.name?.toLowerCase().includes(s));
    }

    result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    return result;
  }, [projectsData, search]);

  // ===================== LOADING =====================

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fafafa]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#ef7f1b] border-t-transparent" />
      </div>
    );
  }

  // ===================== ERROR =====================

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#fafafa]">
        <p className="text-sm font-medium text-red-600">
          Failed to load projects
        </p>

        <Button
          onClick={() => refetch()}
          className="bg-[#ef7f1b] text-white hover:bg-[#d66e15]"
        >
          Retry
        </Button>
      </div>
    );
  }

  // ===================== UI =====================

  return (
    <div
      className="flex h-full overflow-hidden bg-[#fafafa]"
      data-testid="projects-page"
    >
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ===================== HEADER ===================== */}

        <div className="border-b border-gray-200 bg-white px-4 py-5 shadow-sm md:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-black tracking-tight text-black">
                Projects
              </h1>

              <p className="mt-1 text-xs text-gray-400">
                {filtered.length} project
                {filtered.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative min-w-[240px] flex-1 xl:w-[320px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 border-gray-200 bg-gray-50 pl-10 text-sm focus-visible:ring-[#ef7f1b]"
                />
              </div>

              {/* View Switch */}
              <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white">
                {[
                  {
                    mode: "grid",
                    icon: LayoutGrid,
                  },
                  {
                    mode: "list",
                    icon: List,
                  },
                ].map((v) => (
                  <button
                    key={v.mode}
                    onClick={() => setViewMode(v.mode)}
                    className={`p-2 transition-all ${
                      viewMode === v.mode
                        ? "bg-[#ef7f1b] text-white"
                        : "text-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <v.icon className="h-4 w-4" />
                  </button>
                ))}
              </div>

              {/* Add */}
              <Button
                onClick={() => {
                  setEditingProject(null);

                  setNewProject({
                    name: "",
                  });

                  setShowNewProject(true);
                }}
                className="h-10 bg-[#ef7f1b] text-white hover:bg-[#d66e15]"
              >
                <Plus className="mr-1 h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>
        </div>

        {/* ===================== CONTENT ===================== */}

        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6">
            {filtered.length === 0 ? (
              <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff4eb] text-[#ef7f1b]">
                  <FolderOpen className="h-8 w-8" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-black">
                  No Projects Found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Create your first project to get started.
                </p>

                <Button
                  onClick={() => {
                    setEditingProject(null);

                    setNewProject({
                      name: "",
                    });

                    setShowNewProject(true);
                  }}
                  className="mt-5 bg-[#ef7f1b] text-white hover:bg-[#d66e15]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </div>
            ) : (
              <>
                {/* GRID VIEW */}
                {viewMode === "grid" && (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((project) => (
                      <Card
                        key={project.id}
                        className="group border border-gray-200 p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="flex h-full flex-col justify-between gap-5">
                          <Link
                            href={`/projects/${project.id}/inventory`}
                            className="block"
                          >
                            <div className="space-y-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff4eb] text-[#ef7f1b]">
                                <FolderOpen className="h-6 w-6" />
                              </div>

                              <div>
                                <h3 className="text-lg font-bold text-black">
                                  {project.name}
                                </h3>
                              </div>
                            </div>
                          </Link>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingProject(project);

                                setNewProject({
                                  name: project.name || "",
                                });

                                setShowNewProject(true);
                              }}
                              className="flex-1"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Button>

                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={isDeleting}
                              onClick={() => handleDelete(project.id)}
                              className="flex-1"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* LIST VIEW */}
                {viewMode === "list" && (
                  <div className="space-y-3">
                    {filtered.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                      >
                        <Link
                          href={`/projects/${project.id}/inventory`}
                          className="flex flex-1 items-center gap-4"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff4eb] text-[#ef7f1b]">
                            <FolderOpen className="h-6 w-6" />
                          </div>

                          <div>
                            <h3 className="font-semibold text-black">
                              {project.name}
                            </h3>
                          </div>
                        </Link>

                        <div className="ml-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingProject(project);

                              setNewProject({
                                name: project.name || "",
                              });

                              setShowNewProject(true);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isDeleting}
                            onClick={() => handleDelete(project.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* ===================== DIALOG ===================== */}

      <NewProjectDialog
        open={showNewProject}
        onOpenChange={setShowNewProject}
        newProject={newProject}
        setNewProject={setNewProject}
        onCreate={editingProject ? handleEdit : handleCreate}
        saving={saving}
        editingProject={editingProject}
      />
    </div>
  );
}
