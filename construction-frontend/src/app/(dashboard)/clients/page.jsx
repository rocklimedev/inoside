"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from "@/api/clientsApi";

import ClientForm from "@/components/client/ClientForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import {
  Plus,
  Search,
  Grid3X3,
  List,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const COMMUNICATION_COLORS = {
  Call: "bg-blue-100 text-blue-700",
  WhatsApp: "bg-green-100 text-green-700",
  Email: "bg-violet-100 text-violet-700",
};

export default function ClientsPage() {
  const { data: clients = [], isLoading } = useGetClientsQuery();

  const [createClient, { isLoading: creating }] = useCreateClientMutation();
  const [updateClient, { isLoading: updating }] = useUpdateClientMutation();
  const [deleteClient] = useDeleteClientMutation();

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showAdd, setShowAdd] = useState(false);
  const [activeClient, setActiveClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [filterComm, setFilterComm] = useState("all");

  // ================= FILTER OPTIONS =================
  const commOptions = useMemo(() => {
    return Array.from(
      new Set(clients.map((c) => c.preferred_communication).filter(Boolean)),
    );
  }, [clients]);

  // ================= FILTERED =================
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

  // ================= CREATE =================
  const handleCreate = async (data) => {
    try {
      await createClient(data).unwrap();
      toast.success("Client created successfully");
      setShowAdd(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to create client");
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async (data) => {
    try {
      await updateClient({
        id: editingClient.id,
        ...data,
      }).unwrap();
      toast.success("Client updated successfully");
      setEditingClient(null);
      setActiveClient(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to update client");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this client?")) return;

    try {
      await deleteClient(id).unwrap();
      toast.success("Client deleted successfully");
      setActiveClient(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to delete client");
    }
  };

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-[#fafafa]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-52 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#fafafa]">
      {/* ================= HEADER ================= */}
      <div className="border-b bg-white px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black">Clients</h1>
            <p className="mt-1 text-xs text-gray-400">
              {filteredClients.length} clients found
            </p>
          </div>

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
              className="bg-[#ef7f1b]"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Client
            </Button>
          </div>
        </div>

        {/* ================= FILTERS ================= */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients..."
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

      {/* ================= CONTENT ================= */}
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
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          COMMUNICATION_COLORS[
                            client.preferred_communication
                          ] || "bg-gray-100"
                        }`}
                      >
                        {client.preferred_communication}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg truncate">{client.name}</h3>

                  <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                    <Phone className="h-4 w-4" />
                    <span className="truncate">{client.contact_number}</span>
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
                          onClick={() => handleDelete(client.id)}
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
            /* ================= LIST VIEW ================= */
            <div className="space-y-3">
              {filteredClients.map((client) => (
                <Card
                  key={client.id}
                  onClick={() => setActiveClient(client)}
                  className="flex items-center gap-4 p-4 cursor-pointer hover:shadow-md transition"
                >
                  <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center font-bold text-2xl text-[#ef7f1b]">
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
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        COMMUNICATION_COLORS[client.preferred_communication] ||
                        "bg-gray-100"
                      }`}
                    >
                      {client.preferred_communication}
                    </span>
                  )}

                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* ================= CREATE DIALOG ================= */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <ClientForm onSubmit={handleCreate} disabled={creating} />
        </DialogContent>
      </Dialog>

      {/* ================= EDIT DIALOG ================= */}
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

      {/* ================= CLIENT DETAIL SHEET ================= */}
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
                      onClick={() => handleDelete(activeClient.id)}
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
    </div>
  );
}
