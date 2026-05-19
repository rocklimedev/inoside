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

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Phone,
  Mail,
  Building2,
  UserCheck,
  MessageSquare,
  Loader2,
  X,
  LayoutGrid,
  Table2,
} from "lucide-react";

const COMMUNICATION_COLORS = {
  Call: "bg-blue-100 text-blue-700 border-blue-200",
  WhatsApp: "bg-green-100 text-green-700 border-green-200",
  Email: "bg-violet-100 text-violet-700 border-violet-200",
};

export default function ClientsPage() {
  const { data: clients = [], isLoading } = useGetClientsQuery();

  const [createClient, { isLoading: creating }] = useCreateClientMutation();

  const [updateClient, { isLoading: updating }] = useUpdateClientMutation();

  const [deleteClient] = useDeleteClientMutation();

  const [search, setSearch] = useState("");

  const [openCreate, setOpenCreate] = useState(false);

  const [editingClient, setEditingClient] = useState(null);

  const [view, setView] = useState("cards");

  // ================= FILTERED =================
  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;

    const term = search.toLowerCase();

    return clients.filter((client) =>
      [
        client.name,
        client.email,
        client.contact_number,
        client.preferred_communication,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [clients, search]);

  // ================= CREATE =================
  const handleCreate = async (data) => {
    try {
      await createClient(data).unwrap();

      toast.success("Client created successfully");

      setOpenCreate(false);
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
    } catch (err) {
      console.error(err);

      toast.error(err?.data?.message || "Failed to update client");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Delete this client?")) return;

    try {
      await deleteClient(id).unwrap();

      toast.success("Client deleted");
    } catch (err) {
      console.error(err);

      toast.error(err?.data?.message || "Failed to delete client");
    }
  };

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-background">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-muted/30" />

      <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl -z-10" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl -z-10" />

      {/* HEADER */}
      <div className="border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="px-4 md:px-6 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6" />
                </div>

                <div>
                  <h1 className="text-3xl font-black tracking-tight">
                    Clients
                  </h1>

                  <p className="text-sm text-muted-foreground mt-1">
                    Manage all your project clients and communication
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* VIEW SWITCH */}
              <div className="flex border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setView("cards")}
                  className={`px-4 py-2.5 transition ${
                    view === "cards"
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setView("table")}
                  className={`px-4 py-2.5 transition ${
                    view === "table"
                      ? "bg-primary text-white"
                      : "hover:bg-muted"
                  }`}
                >
                  <Table2 className="w-4 h-4" />
                </button>
              </div>

              <Button
                onClick={() => setOpenCreate(true)}
                className="h-11 rounded-xl px-5 bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </div>
          </div>

          {/* SEARCH */}
          <div className="mt-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients..."
                className="pl-11 h-12 rounded-2xl border-border/60 bg-card/70 backdrop-blur-sm"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              {filteredClients.length} client
              {filteredClients.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {filteredClients.length === 0 ? (
            <Card className="border-dashed py-20 text-center rounded-3xl">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
                  <Users className="w-10 h-10 text-muted-foreground" />
                </div>

                <h3 className="text-2xl font-bold">No clients found</h3>

                <p className="text-muted-foreground mt-2 max-w-md">
                  Start by adding your first client.
                </p>

                <Button
                  onClick={() => setOpenCreate(true)}
                  className="mt-6 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Client
                </Button>
              </div>
            </Card>
          ) : (
            <>
              {/* ================= CARD VIEW ================= */}
              {view === "cards" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredClients.map((client, index) => (
                    <Card
                      key={client.id}
                      className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:border-orange-500/30"
                      style={{
                        animationDelay: `${index * 80}ms`,
                      }}
                    >
                      {/* Glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />
                      </div>

                      {/* Top Line */}
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-primary to-orange-500" />

                      <div className="relative p-6">
                        {/* HEADER */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-lg shrink-0">
                              <Building2 className="w-7 h-7" />
                            </div>

                            <div className="min-w-0">
                              <h3 className="text-lg font-bold truncate">
                                {client.name}
                              </h3>

                              <p className="text-sm text-muted-foreground truncate">
                                {client.email || "No email provided"}
                              </p>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-xl"
                              >
                                <MoreVertical className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setEditingClient(client)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Client
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => handleDelete(client.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Client
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* DETAILS */}
                        <div className="mt-6 space-y-4">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                              <Phone className="w-4 h-4 text-primary" />
                            </div>

                            <span className="font-medium">
                              {client.contact_number}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                              <Mail className="w-4 h-4 text-primary" />
                            </div>

                            <span className="truncate">
                              {client.email || "No email"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 text-primary" />
                            </div>

                            <Badge
                              className={
                                COMMUNICATION_COLORS[
                                  client.preferred_communication
                                ] ||
                                "bg-muted text-muted-foreground border-border"
                              }
                            >
                              {client.preferred_communication ||
                                "Not specified"}
                            </Badge>
                          </div>
                        </div>

                        {/* TAGS */}
                        <div className="mt-6 flex flex-wrap gap-2">
                          {client.is_owner && (
                            <Badge className="rounded-full bg-emerald-100 text-emerald-700 border-emerald-200">
                              <UserCheck className="w-3 h-3 mr-1" />
                              Owner
                            </Badge>
                          )}

                          {client.representative_involved && (
                            <Badge className="rounded-full bg-violet-100 text-violet-700 border-violet-200">
                              Representative
                            </Badge>
                          )}
                        </div>

                        {/* FOOTER */}
                        <div className="mt-6 pt-5 border-t border-border/60 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Created
                            </p>

                            <p className="text-sm font-medium">
                              {new Date(client.created_at).toLocaleDateString()}
                            </p>
                          </div>

                          <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => setEditingClient(client)}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* ================= TABLE VIEW ================= */}
              {view === "table" && (
                <div className="border rounded-3xl overflow-hidden bg-card">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[950px]">
                      <thead className="bg-muted/60 border-b">
                        <tr>
                          <th className="text-left p-4 text-xs uppercase tracking-wider font-bold text-muted-foreground">
                            Client
                          </th>

                          <th className="text-left p-4 text-xs uppercase tracking-wider font-bold text-muted-foreground">
                            Contact
                          </th>

                          <th className="text-left p-4 text-xs uppercase tracking-wider font-bold text-muted-foreground">
                            Communication
                          </th>

                          <th className="text-left p-4 text-xs uppercase tracking-wider font-bold text-muted-foreground">
                            Ownership
                          </th>

                          <th className="text-left p-4 text-xs uppercase tracking-wider font-bold text-muted-foreground">
                            Created
                          </th>

                          <th className="text-right p-4 text-xs uppercase tracking-wider font-bold text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredClients.map((client) => (
                          <tr
                            key={client.id}
                            className="border-b hover:bg-muted/50 transition-colors"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-md">
                                  <Building2 className="w-5 h-5" />
                                </div>

                                <div>
                                  <p className="font-semibold">{client.name}</p>

                                  <p className="text-sm text-muted-foreground">
                                    {client.email || "No email"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="p-4">
                              <div className="text-sm">
                                {client.contact_number}
                              </div>
                            </td>

                            <td className="p-4">
                              <Badge
                                className={
                                  COMMUNICATION_COLORS[
                                    client.preferred_communication
                                  ] ||
                                  "bg-muted text-muted-foreground border-border"
                                }
                              >
                                {client.preferred_communication ||
                                  "Not specified"}
                              </Badge>
                            </td>

                            <td className="p-4">
                              <div className="flex flex-wrap gap-2">
                                {client.is_owner && (
                                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                    Owner
                                  </Badge>
                                )}

                                {client.representative_involved && (
                                  <Badge className="bg-violet-100 text-violet-700 border-violet-200">
                                    Representative
                                  </Badge>
                                )}
                              </div>
                            </td>

                            <td className="p-4 text-sm text-muted-foreground">
                              {new Date(client.created_at).toLocaleDateString()}
                            </td>

                            <td className="p-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-5 h-5" />
                                  </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => setEditingClient(client)}
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Client
                                  </DropdownMenuItem>

                                  <DropdownMenuSeparator />

                                  <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    onClick={() => handleDelete(client.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Client
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* CREATE DIALOG */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              Create Client
            </DialogTitle>
          </DialogHeader>

          <ClientForm onSubmit={handleCreate} disabled={creating} />
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog
        open={!!editingClient}
        onOpenChange={(open) => !open && setEditingClient(null)}
      >
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              Edit Client
            </DialogTitle>
          </DialogHeader>

          {editingClient && (
            <ClientForm
              initialValues={editingClient}
              onSubmit={handleUpdate}
              disabled={updating}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
