import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  StickyNote,
  Plus,
  Search,
  Pin,
  Archive,
  Edit3,
  Trash2,
  Loader2,
  Tag,
  Filter,
  Grid3X3,
  List,
  X,
} from "lucide-react";

const NOTE_TYPES = [
  "General",
  "Risk",
  "Vendor",
  "Client behavior",
  "Design direction",
  "Site",
  "Approval",
];
const MODULES = [
  "none",
  "Brief",
  "Pitch",
  "Site Reki",
  "Scope",
  "Time & Cost",
  "BOQ",
  "Design",
  "Execution",
  "Vendors",
  "Inventory",
  "Quality",
  "Handover",
];

const typeColor = (t) => {
  const m = {
    Risk: "bg-red-50 text-[#e31d3b]",
    Vendor: "bg-blue-50 text-blue-600",
    "Client behavior": "bg-purple-50 text-purple-600",
    "Design direction": "bg-indigo-50 text-indigo-600",
    Site: "bg-green-50 text-green-600",
    Approval: "bg-orange-50 text-[#ef7f1b]",
  };
  return m[t] || "bg-gray-100 text-gray-600";
};

export default function InternalNotesPage() {
  const { api, user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [viewMode, setViewMode] = useState("card");
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  useEffect(() => {
    Promise.all([api.get("/internal-notes"), api.get("/projects")])
      .then(([n, p]) => {
        setNotes(n.data);
        setProjects(p.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const reload = () => api.get("/internal-notes").then((r) => setNotes(r.data));

  const togglePin = async (note) => {
    try {
      await api.put(`/internal-notes/${note.id}`, { pinned: !note.pinned });
      reload();
    } catch {
      toast.error("Failed");
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/internal-notes/${id}`);
      setNotes((p) => p.filter((n) => n.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed");
    }
  };

  const filtered = notes.filter((n) => {
    if (n.archived) return false;
    if (
      search &&
      !n.title?.toLowerCase().includes(search.toLowerCase()) &&
      !n.content?.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (filterProject !== "all" && n.project !== filterProject) return false;
    if (showPinnedOnly && !n.pinned) return false;
    return true;
  });

  const pinnedNotes = filtered.filter((n) => n.pinned);
  const otherNotes = filtered.filter((n) => !n.pinned);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="flex flex-col h-full" data-testid="notes-page">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1
              className="text-xl font-black text-black"
              data-testid="notes-title"
            >
              Internal Notes
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {notes.filter((n) => !n.archived).length} note
              {notes.filter((n) => !n.archived).length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("card")}
                className={`p-1.5 ${viewMode === "card" ? "bg-gray-100" : ""}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 ${viewMode === "list" ? "bg-gray-100" : ""}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Button
              onClick={() => {
                setEditingNote(null);
                setShowAdd(true);
              }}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
              size="sm"
              data-testid="add-note-btn"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Note
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="pl-10"
              data-testid="note-search"
            />
          </div>
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-44 h-9 text-xs">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            onClick={() => setShowPinnedOnly(!showPinnedOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${showPinnedOnly ? "bg-[#ef7f1b] text-white" : "bg-gray-100 text-gray-600"}`}
            data-testid="pinned-toggle"
          >
            <Pin className="w-3 h-3 inline mr-1" />
            Pinned
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {/* Pinned section */}
          {pinnedNotes.length > 0 && !showPinnedOnly && (
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#ef7f1b] mb-2">
                Pinned Notes
              </p>
              <div
                className={
                  viewMode === "card"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                    : "space-y-2"
                }
              >
                {pinnedNotes.map((n, i) => (
                  <NoteCard
                    key={n.id}
                    note={n}
                    onPin={togglePin}
                    onDelete={deleteNote}
                    onEdit={(note) => {
                      setEditingNote(note);
                      setShowAdd(true);
                    }}
                    idx={i}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </div>
          )}
          {(showPinnedOnly ? pinnedNotes : otherNotes).length === 0 &&
          pinnedNotes.length === 0 ? (
            <div className="text-center py-16">
              <StickyNote className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No notes found</p>
            </div>
          ) : (
            <div
              className={
                viewMode === "card"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                  : "space-y-2"
              }
            >
              {(showPinnedOnly ? pinnedNotes : otherNotes).map((n, i) => (
                <NoteCard
                  key={n.id}
                  note={n}
                  onPin={togglePin}
                  onDelete={deleteNote}
                  onEdit={(note) => {
                    setEditingNote(note);
                    setShowAdd(true);
                  }}
                  idx={i}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg" data-testid="note-dialog">
          <DialogHeader>
            <DialogTitle>{editingNote ? "Edit Note" : "New Note"}</DialogTitle>
          </DialogHeader>
          <NoteForm
            api={api}
            projects={projects}
            existing={editingNote}
            onSuccess={() => {
              setShowAdd(false);
              setEditingNote(null);
              reload();
              toast.success(editingNote ? "Updated" : "Note created");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NoteCard({ note, onPin, onDelete, onEdit, idx, viewMode }) {
  if (viewMode === "list") {
    return (
      <Card
        className={`p-3 flex items-center gap-3 ${note.pinned ? "border-[#ef7f1b]/20 bg-orange-50/20" : ""}`}
        data-testid={`note-item-${idx}`}
      >
        {note.pinned && <Pin className="w-3 h-3 text-[#ef7f1b] shrink-0" />}
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-black truncate">
            {note.title}
          </h4>
          <p className="text-[10px] text-gray-400 truncate">
            {note.project} &middot; {note.author} &middot;{" "}
            {note.created_at
              ? new Date(note.created_at).toLocaleDateString()
              : ""}
          </p>
        </div>
        <Badge className={`${typeColor(note.note_type)} text-[9px] border-0`}>
          {note.note_type}
        </Badge>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onPin(note)}
            className="w-6 h-6 rounded flex items-center justify-center text-gray-300 hover:text-[#ef7f1b]"
          >
            <Pin className="w-3 h-3" />
          </button>
          <button
            onClick={() => onEdit(note)}
            className="w-6 h-6 rounded flex items-center justify-center text-gray-300 hover:text-gray-600"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="w-6 h-6 rounded flex items-center justify-center text-gray-300 hover:text-[#e31d3b]"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`p-4 hover:shadow-lg transition-all ${note.pinned ? "border-[#ef7f1b]/20 bg-orange-50/10" : ""}`}
      data-testid={`note-card-${idx}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5">
          {note.pinned && <Pin className="w-3 h-3 text-[#ef7f1b]" />}
          <Badge className={`${typeColor(note.note_type)} text-[9px] border-0`}>
            {note.note_type}
          </Badge>
        </div>
        <div className="flex gap-0.5">
          <button
            onClick={() => onPin(note)}
            className="w-6 h-6 rounded flex items-center justify-center text-gray-300 hover:text-[#ef7f1b]"
          >
            <Pin className="w-3 h-3" />
          </button>
          <button
            onClick={() => onEdit(note)}
            className="w-6 h-6 rounded flex items-center justify-center text-gray-300 hover:text-gray-600"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="w-6 h-6 rounded flex items-center justify-center text-gray-300 hover:text-[#e31d3b]"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <h4 className="text-xs font-bold text-black">{note.title}</h4>
      <p className="text-[10px] text-gray-600 mt-1 line-clamp-3">
        {note.content}
      </p>
      {note.tags?.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {note.tags.map((t, i) => (
            <span
              key={i}
              className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 text-[10px] text-gray-400">
        <span>{note.project || "General"}</span>
        <span>
          {note.author} &middot;{" "}
          {note.created_at
            ? new Date(note.created_at).toLocaleDateString()
            : ""}
        </span>
      </div>
    </Card>
  );
}

function NoteForm({ api, projects, existing, onSuccess }) {
  const [form, setForm] = useState(
    existing
      ? {
          ...existing,
          tags: existing.tags?.join(", ") || "",
          linked_module: existing.linked_module || "none",
        }
      : {
          title: "",
          content: "",
          project: "",
          note_type: "General",
          tags: "",
          linked_module: "none",
        },
  );
  const [saving, setSaving] = useState(false);
  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Title required");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      linked_module: form.linked_module === "none" ? "" : form.linked_module,
      project: form.project === "general" ? "" : form.project,
    };
    try {
      if (existing) {
        await api.put(`/internal-notes/${existing.id}`, payload);
      } else {
        await api.post("/internal-notes", payload);
      }
      onSuccess();
    } catch {
      toast.error("Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3 py-2">
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Title *
        </Label>
        <Input
          value={form.title}
          onChange={(e) => u("title", e.target.value)}
          className="mt-1"
          data-testid="note-title-input"
        />
      </div>
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Content
        </Label>
        <Textarea
          value={form.content}
          onChange={(e) => u("content", e.target.value)}
          className="mt-1"
          rows={4}
          data-testid="note-content-input"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Project
          </Label>
          <Select
            value={form.project || "general"}
            onValueChange={(v) => u("project", v === "general" ? "" : v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Note Type
          </Label>
          <Select
            value={form.note_type}
            onValueChange={(v) => u("note_type", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NOTE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Tags (comma separated)
          </Label>
          <Input
            value={form.tags}
            onChange={(e) => u("tags", e.target.value)}
            className="mt-1"
            placeholder="e.g. urgent, design"
          />
        </div>
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Linked Module
          </Label>
          <Select
            value={form.linked_module}
            onValueChange={(v) => u("linked_module", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              {MODULES.map((m) => (
                <SelectItem key={m} value={m}>
                  {m === "none" ? "None" : m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
          data-testid="note-submit"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Plus className="w-4 h-4 mr-1" />
          )}{" "}
          {existing ? "Update" : "Create"} Note
        </Button>
      </div>
    </div>
  );
}
