"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from "@/api/clientsApi";

import {
  useGetSitesQuery,
  useCreateSiteMutation,
  useUpdateSiteMutation,
  useDeleteSiteMutation,
} from "@/api/sitesApi";

import ClientForm from "@/components/client/ClientForm";
import SiteForm from "@/components/client/SiteForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Plus,
  Search,
  Grid3X3,
  List,
  Phone,
  Mail,
  ChevronRight,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
  MapPin,
  Building2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// ─── constants ────────────────────────────────────────────────────────────────

const COMMUNICATION_COLORS = {
  Call: "bg-blue-100 text-blue-700",
  WhatsApp: "bg-green-100 text-green-700",
  Email: "bg-violet-100 text-violet-700",
};

const OWNERSHIP_COLORS = {
  Owned: "bg-emerald-100 text-emerald-700",
  Rented: "bg-amber-100 text-amber-700",
  "Under Process": "bg-sky-100 text-sky-700",
};

// ─── component ────────────────────────────────────────────────────────────────

export default function ClientsPage() {
  // ── clients data ──────────────────────────────────────────────────────────
  const { data: clients = [], isLoading: clientsLoading } =
    useGetClientsQuery();
  const [createClient, { isLoading: creating }] = useCreateClientMutation();
  const [updateClient, { isLoading: updating }] = useUpdateClientMutation();
  const [deleteClient] = useDeleteClientMutation();

  // ── sites data ────────────────────────────────────────────────────────────
  const { data: sites = [], isLoading: sitesLoading } = useGetSitesQuery();
  const [createSite, { isLoading: creatingsite }] = useCreateSiteMutation();
  const [updateSite, { isLoading: updatingSite }] = useUpdateSiteMutation();
  const [deleteSite] = useDeleteSiteMutation();

  // ── client UI state ───────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showAdd, setShowAdd] = useState(false);
  const [activeClient, setActiveClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [filterComm, setFilterComm] = useState("all");

  // ── site UI state ─────────────────────────────────────────────────────────
  const [siteSearch, setSiteSearch] = useState("");
  const [showAddSite, setShowAddSite] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [filterOwnership, setFilterOwnership] = useState("all");

  // ── derived: clients ──────────────────────────────────────────────────────
  const commOptions = useMemo(
    () =>
      Array.from(
        new Set(clients.map((c) => c.preferred_communication).filter(Boolean)),
      ),
    [clients],
  );

  const filteredClients = useMemo(() => {
    const term = search.toLowerCase().trim();
    return clients.filter((client) => {
      const matchesSearch =
        !term ||
        client.name?.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term) ||
        client.contact_number?.toLowerCase().includes(term) ||
        client.preferred_communication?.toLowerCase().includes(term);
      const matchesComm =
        filterComm === "all" || client.preferred_communication === filterComm;
      return matchesSearch && matchesComm;
    });
  }, [clients, search, filterComm]);

  // ── derived: sites ────────────────────────────────────────────────────────
  // Build a quick lookup map  { clientId → clientName }
  const clientMap = useMemo(
    () => Object.fromEntries(clients.map((c) => [c.id, c.name])),
    [clients],
  );

  const filteredSites = useMemo(() => {
    const term = siteSearch.toLowerCase().trim();
    return sites.filter((site) => {
      const clientName = clientMap[site.client_id] || "";
      const matchesSearch =
        !term ||
        clientName.toLowerCase().includes(term) ||
        site.ownership_status?.toLowerCase().includes(term) ||
        site.address_id?.toLowerCase().includes(term);
      const matchesOwnership =
        filterOwnership === "all" || site.ownership_status === filterOwnership;
      return matchesSearch && matchesOwnership;
    });
  }, [sites, siteSearch, filterOwnership, clientMap]);

  // ── client handlers ───────────────────────────────────────────────────────
  const handleCreate = async (data) => {
    try {
      await createClient(data).unwrap();
      toast.success("Client created successfully");
      setShowAdd(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create client");
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateClient({ id: editingClient.id, ...data }).unwrap();
      toast.success("Client updated successfully");
      setEditingClient(null);
      setActiveClient(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update client");
    }
  };

  const handleDeleteClient = async (id) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    try {
      await deleteClient(id).unwrap();
      toast.success("Client deleted successfully");
      setActiveClient(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete client");
    }
  };

  // ── site handlers ─────────────────────────────────────────────────────────
  const handleCreateSite = async (data) => {
    try {
      await createSite(data).unwrap();
      toast.success("Site created successfully");
      setShowAddSite(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create site");
    }
  };

  const handleUpdateSite = async (data) => {
    try {
      await updateSite({ id: editingSite.id, ...data }).unwrap();
      toast.success("Site updated successfully");
      setEditingSite(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update site");
    }
  };

  const handleDeleteSite = async (id) => {
    if (!confirm("Are you sure you want to delete this site?")) return;
    try {
      await deleteSite(id).unwrap();
      toast.success("Site deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete site");
    }
  };

  // ── loading skeleton ──────────────────────────────────────────────────────
  if (clientsLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-[#fafafa]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-52 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    );
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full flex-col bg-[#fafafa]">
      {/* ── page header ── */}
      <div className="border-b bg-white px-4 py-4 md:px-6">
        <h1 className="text-2xl font-black">Clients & Sites</h1>
      </div>

      {/* ── tabs ── */}
      <Tabs defaultValue="clients" className="flex flex-1 flex-col">
        <div className="border-b bg-white px-4 md:px-6">
          <TabsList className="h-10 bg-transparent gap-1 p-0">
            <TabsTrigger
              value="clients"
              className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-[#ef7f1b] data-[state=active]:text-[#ef7f1b] data-[state=active]:shadow-none bg-transparent"
            >
              Clients
            </TabsTrigger>
            <TabsTrigger
              value="sites"
              className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-[#ef7f1b] data-[state=active]:text-[#ef7f1b] data-[state=active]:shadow-none bg-transparent"
            >
              Sites
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ════════════════════════════════════════════
            CLIENTS TAB
        ════════════════════════════════════════════ */}
        <TabsContent value="clients" className="flex-1 flex flex-col m-0">
          {/* sub-header */}
          <div className="border-b bg-white px-4 py-4 md:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-xs text-gray-400">
                {filteredClients.length} clients found
              </p>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-[#ef7f1b] text-white" : "text-gray-500"}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-[#ef7f1b] text-white" : "text-gray-500"}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  onClick={() => setShowAdd(true)}
                  className="bg-[#ef7f1b] hover:bg-[#d96e0e]"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Client
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search clients…"
                  className="pl-10"
                />
              </div>
              <Select value={filterComm} onValueChange={setFilterComm}>
                <SelectTrigger className="w-full md:w-52">
                  <Filter className="h-3 w-3 mr-1" />
                  <SelectValue placeholder="All Communication" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Communication</SelectItem>
                  {commOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 md:p-6">
              {filteredClients.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  No clients found
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {filteredClients.map((client) => (
                    <Card
                      key={client.id}
                      onClick={() => setActiveClient(client)}
                      className="cursor-pointer rounded-2xl border bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center font-bold text-2xl text-[#ef7f1b]">
                          {client.name?.[0] || "C"}
                        </div>
                        {client.preferred_communication && (
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${COMMUNICATION_COLORS[client.preferred_communication] || "bg-gray-100"}`}
                          >
                            {client.preferred_communication}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg truncate">
                        {client.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                        <Phone className="h-4 w-4" />
                        <span className="truncate">
                          {client.contact_number}
                        </span>
                      </div>
                      {client.email && (
                        <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                      <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#ef7f1b] hover:text-[#ef7f1b]/80 p-0 h-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingClient(client);
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setEditingClient(client)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteClient(client.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredClients.map((client) => (
                    <Card
                      key={client.id}
                      onClick={() => setActiveClient(client)}
                      className="flex items-center gap-4 p-4 cursor-pointer hover:shadow-md transition group"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center font-bold text-2xl text-[#ef7f1b] flex-shrink-0">
                        {client.name?.[0] || "C"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate text-base">
                          {client.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {client.contact_number} • {client.email || "No email"}
                        </p>
                      </div>
                      {client.preferred_communication && (
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 ${COMMUNICATION_COLORS[client.preferred_communication] || "bg-gray-100"}`}
                        >
                          {client.preferred_communication}
                        </span>
                      )}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#ef7f1b] hover:text-[#ef7f1b]/80 p-2 h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingClient(client);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingClient(client);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClient(client.id);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <ChevronRight className="h-5 w-5 text-gray-300 ml-2" />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ════════════════════════════════════════════
            SITES TAB
        ════════════════════════════════════════════ */}
        <TabsContent value="sites" className="flex-1 flex flex-col m-0">
          {/* sub-header */}
          <div className="border-b bg-white px-4 py-4 md:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-xs text-gray-400">
                {filteredSites.length} sites found
              </p>
              <Button
                onClick={() => setShowAddSite(true)}
                className="bg-[#ef7f1b] hover:bg-[#d96e0e]"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Site
              </Button>
            </div>

            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  value={siteSearch}
                  onChange={(e) => setSiteSearch(e.target.value)}
                  placeholder="Search by client or ownership…"
                  className="pl-10"
                />
              </div>
              <Select
                value={filterOwnership}
                onValueChange={setFilterOwnership}
              >
                <SelectTrigger className="w-full md:w-52">
                  <Filter className="h-3 w-3 mr-1" />
                  <SelectValue placeholder="All Ownership" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ownership</SelectItem>
                  <SelectItem value="Owned">Owned</SelectItem>
                  <SelectItem value="Rented">Rented</SelectItem>
                  <SelectItem value="Under Process">Under Process</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 md:p-6">
              {sitesLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-14 animate-pulse rounded-xl bg-gray-100"
                    />
                  ))}
                </div>
              ) : filteredSites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                  <Building2 className="h-12 w-12 text-gray-200" />
                  <p>No sites found</p>
                  <Button
                    onClick={() => setShowAddSite(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add your first site
                  </Button>
                </div>
              ) : (
                <div className="rounded-2xl border bg-white overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-600">
                          Client
                        </TableHead>
                        <TableHead className="font-semibold text-gray-600">
                          Address ID
                        </TableHead>
                        <TableHead className="font-semibold text-gray-600">
                          Ownership
                        </TableHead>
                        <TableHead className="font-semibold text-gray-600 text-center">
                          Access
                        </TableHead>
                        <TableHead className="font-semibold text-gray-600 text-center">
                          Existing Structure
                        </TableHead>
                        <TableHead className="w-12" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSites.map((site) => (
                        <TableRow
                          key={site.id}
                          className="hover:bg-orange-50/40 transition-colors group"
                        >
                          {/* Client */}
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center font-bold text-sm text-[#ef7f1b] flex-shrink-0">
                                {(site.client?.name || "?")[0]}
                              </div>

                              <span className="font-medium text-sm">
                                {site.client?.name || (
                                  <span className="text-gray-400 italic">
                                    Unknown
                                  </span>
                                )}
                              </span>
                            </div>
                          </TableCell>

                          {/* Address */}
                          <TableCell>
                            <div className="flex flex-col text-sm text-gray-600">
                              <div className="font-medium text-gray-800">
                                {site.address?.line1 || "—"}
                              </div>

                              <div className="text-xs text-gray-500">
                                {site.address?.city}, {site.address?.state} -{" "}
                                {site.address?.pincode}
                              </div>

                              {site.address?.landmark && (
                                <div className="text-xs text-gray-400">
                                  📍 {site.address.landmark}
                                </div>
                              )}
                            </div>
                          </TableCell>

                          {/* Ownership */}
                          <TableCell>
                            {site.ownership_status ? (
                              <span
                                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                  OWNERSHIP_COLORS[site.ownership_status] ||
                                  "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {site.ownership_status}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </TableCell>

                          {/* Access */}
                          <TableCell className="text-center">
                            {site.access_available ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400 mx-auto" />
                            )}
                          </TableCell>

                          {/* Existing Structure */}
                          <TableCell className="text-center">
                            {site.existing_structure ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400 mx-auto" />
                            )}
                          </TableCell>

                          {/* Actions */}
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setEditingSite(site)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() => handleDeleteSite(site.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* ── CLIENT dialogs ── */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <ClientForm onSubmit={handleCreate} disabled={creating} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingClient}
        onOpenChange={(open) => !open && setEditingClient(null)}
      >
        <DialogContent className="max-w-2xl rounded-3xl">
          {editingClient && (
            <ClientForm
              initialValues={editingClient}
              onSubmit={handleUpdate}
              disabled={updating}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ── CLIENT detail sheet ── */}
      <Sheet open={!!activeClient} onOpenChange={() => setActiveClient(null)}>
        <SheetContent className="w-full sm:w-[480px] p-0">
          {activeClient && (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center font-bold text-4xl text-[#ef7f1b] mb-4">
                    {activeClient.name?.[0] || "C"}
                  </div>
                  <h2 className="text-2xl font-bold">{activeClient.name}</h2>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setEditingClient(activeClient)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteClient(activeClient.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="font-medium">{activeClient.contact_number}</p>
                </div>
                {activeClient.email && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium">{activeClient.email}</p>
                  </div>
                )}
                {activeClient.preferred_communication && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Preferred Communication
                    </p>
                    <span
                      className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${COMMUNICATION_COLORS[activeClient.preferred_communication] || "bg-gray-100"}`}
                    >
                      {activeClient.preferred_communication}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ── SITE dialogs ── */}
      <Dialog open={showAddSite} onOpenChange={setShowAddSite}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <SiteForm
            clients={clients}
            onSubmit={handleCreateSite}
            disabled={creatingsite}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingSite}
        onOpenChange={(open) => !open && setEditingSite(null)}
      >
        <DialogContent className="max-w-2xl rounded-3xl">
          {editingSite && (
            <SiteForm
              clients={clients}
              initialValues={editingSite}
              onSubmit={handleUpdateSite}
              disabled={updatingSite}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
