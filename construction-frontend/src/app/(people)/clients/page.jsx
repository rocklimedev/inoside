"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  ArrowUpRight,
  FolderOpen,
  Download,
  Loader2,
  Trash2,
} from "lucide-react";

// RTK Query
import {
  useGetClientsQuery,
  useCreateClientMutation,
  useDeleteClientMutation,
} from "@/api/clientsApi";

// Import the updated ClientForm
import ClientForm from "@/components/client/ClientForm";
export default function ClientsPage() {
  const { api } = useAuth();

  const { data: clients = [], isLoading, isError } = useGetClientsQuery();
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [deleteClient] = useDeleteClientMutation();

  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddClient, setShowAddClient] = useState(false);

  // Updated form state to match Sequelize Client model
  const [form, setForm] = useState({
    name: "",
    contact_number: "",
    email: "",
    preferred_communication: "Email",
    is_owner: true,
    representative_involved: false,
    representative_comment: "",

    // Extra helpful fields
    location: "",
    budget_comfort: "",
    design_style: "",
    material_preference: "",
    special_requirements: "",
  });

  const filtered = useMemo(() => {
    if (!search) return clients;
    const s = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.name?.toLowerCase().includes(s) ||
        c.contact_number?.includes(s) ||
        c.email?.toLowerCase().includes(s) ||
        c.active_project?.toLowerCase().includes(s),
    );
  }, [clients, search]);

  const handleCreate = async () => {
    if (!form.name) {
      toast.error("Client name is required");
      return;
    }
    if (!form.contact_number) {
      toast.error("Contact number is required");
      return;
    }

    try {
      await createClient(form).unwrap();
      setShowAddClient(false);

      // Reset form
      setForm({
        name: "",
        contact_number: "",
        email: "",
        preferred_communication: "Email",
        is_owner: true,
        representative_involved: false,
        representative_comment: "",
        location: "",
        budget_comfort: "",
        design_style: "",
        material_preference: "",
        special_requirements: "",
      });

      toast.success("Client added successfully");
    } catch (err) {
      toast.error("Failed to add client");
      console.error(err);
    }
  };

  const handleDelete = async (cid) => {
    if (!cid) return;
    try {
      await deleteClient(cid).unwrap();
      setSelectedClient(null);
      toast.success("Client deleted successfully");
    } catch (err) {
      toast.error("Failed to delete client");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh] text-red-500">
        Failed to load clients. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="clients-page">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1
            className="text-xl font-black text-black"
            data-testid="clients-title"
          >
            Clients
          </h1>

          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 flex-1 border border-transparent focus-within:border-[#ef7f1b]/30">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm outline-none w-full"
                data-testid="clients-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg overflow-hidden">
              {[
                { mode: "grid", icon: LayoutGrid },
                { mode: "list", icon: List },
              ].map((v) => (
                <button
                  key={v.mode}
                  onClick={() => setViewMode(v.mode)}
                  data-testid={`client-view-${v.mode}`}
                  className={`p-2 transition-colors ${
                    viewMode === v.mode
                      ? "bg-[#ef7f1b] text-white"
                      : "text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <v.icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" /> Export
            </Button>

            <Button
              onClick={() => setShowAddClient(true)}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
              size="sm"
              data-testid="add-client-btn"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Client
            </Button>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          {filtered.length} client{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Grid & List Views */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((c, i) => (
                <Card
                  key={c.id || i}
                  className="p-4 hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer group"
                  style={{ animationDelay: `${i * 40}ms` }}
                  onClick={() => setSelectedClient(c)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#ef7f1b] text-white flex items-center justify-center text-sm font-bold">
                      {c.name?.charAt(0)}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#ef7f1b]" />
                  </div>
                  <h3 className="text-sm font-bold text-black">{c.name}</h3>
                  <div className="mt-2 space-y-1 text-[11px] text-gray-400">
                    {c.contact_number && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3" /> {c.contact_number}
                      </div>
                    )}
                    {c.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3" /> {c.email}
                      </div>
                    )}
                    {c.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> {c.location}
                      </div>
                    )}
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-400">
                      {c.projects_count || 0} project
                      {(c.projects_count || 0) !== 1 ? "s" : ""}
                    </span>
                    {c.active_project && (
                      <Badge className="bg-orange-50 text-[#ef7f1b] border-orange-200 text-[10px]">
                        {c.active_project}
                      </Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            // List View (updated phone field)
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-7 gap-2 px-4 py-3 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b">
                <span className="col-span-2">Client</span>
                <span>Contact</span>
                <span>Email</span>
                <span>Projects</span>
                <span>Active</span>
                <span>Architect</span>
              </div>
              {filtered.map((c, i) => (
                <div
                  key={c.id || i}
                  onClick={() => setSelectedClient(c)}
                  className="grid grid-cols-7 gap-2 px-4 py-3 border-b hover:bg-orange-50/30 cursor-pointer items-center text-sm"
                >
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#ef7f1b] text-white flex items-center justify-center text-xs font-bold">
                      {c.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium truncate">{c.name}</p>
                      <p className="text-[10px] text-gray-400">{c.location}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 truncate">
                    {c.contact_number}
                  </span>
                  <span className="text-xs text-gray-600 truncate">
                    {c.email}
                  </span>
                  <span className="text-xs">{c.projects_count || 0}</span>
                  <span className="text-xs text-[#ef7f1b] truncate">
                    {c.active_project || "—"}
                  </span>
                  <span className="text-xs text-gray-400 truncate">
                    {c.assigned_architect || "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Add Client Dialog - Using ClientForm */}
      <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
        <DialogContent className="max-w-lg" data-testid="add-client-dialog">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Add New Client
            </DialogTitle>
          </DialogHeader>

          <ClientForm value={form} onChange={setForm} />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddClient(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Add Client"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Client Profile Sheet */}
      <Sheet
        open={!!selectedClient}
        onOpenChange={() => setSelectedClient(null)}
      >
        <SheetContent className="w-[420px] sm:w-[500px] overflow-auto">
          {selectedClient && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#ef7f1b] text-white flex items-center justify-center text-lg font-bold">
                    {selectedClient.name?.charAt(0)}
                  </div>
                  <div>
                    <SheetTitle>{selectedClient.name}</SheetTitle>
                    <p className="text-xs text-gray-400">
                      {selectedClient.location}
                    </p>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-5">
                <Section title="Contact Information">
                  <div className="space-y-2 text-sm">
                    {selectedClient.contact_number && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />{" "}
                        {selectedClient.contact_number}
                      </div>
                    )}
                    {selectedClient.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />{" "}
                        {selectedClient.email}
                      </div>
                    )}
                    {selectedClient.preferred_communication && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        Prefers {selectedClient.preferred_communication}
                      </div>
                    )}
                  </div>
                </Section>

                <Separator />

                <Section title="Preferences">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                        Budget
                      </p>
                      <p>{selectedClient.budget_comfort || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                        Design Style
                      </p>
                      <p>{selectedClient.design_style || "—"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                        Materials
                      </p>
                      <p>{selectedClient.material_preference || "—"}</p>
                    </div>
                    {selectedClient.special_requirements && (
                      <div className="col-span-2">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                          Special Requirements
                        </p>
                        <p className="text-[#ef7f1b]">
                          {selectedClient.special_requirements}
                        </p>
                      </div>
                    )}
                  </div>
                </Section>

                {/* You can add Owner / Representative section later */}

                <Separator />

                <Section title="Projects">
                  {selectedClient.active_project ? (
                    <div className="p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {selectedClient.active_project}
                        </span>
                        <Badge className="bg-green-50 text-green-700">
                          Active
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No active projects</p>
                  )}
                </Section>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">
                    <FolderOpen className="w-4 h-4 mr-2" /> View Projects
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleDelete(selectedClient.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}
