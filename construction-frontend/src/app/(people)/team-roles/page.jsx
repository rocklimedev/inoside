"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  SheetDescription,
} from "@/components/ui/sheet";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Search,
  Plus,
  Shield,
  Loader2,
  Trash2,
  UserCheck,
  Mail,
  Phone,
  MoreVertical,
  Pencil,
  LayoutGrid,
  Table2,
} from "lucide-react";

// RTK Query
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
} from "@/api/usersApi";

import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation,
} from "@/api/rbacApi";

const AVAILABLE_PERMISSIONS = [
  "projects.view",
  "projects.create",
  "projects.edit",
  "projects.delete",
  "clients.view",
  "clients.create",
  "clients.edit",
  "users.view",
  "users.create",
  "users.edit",
  "users.delete",
  "reports.view",
  "settings.manage",
];

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [search, setSearch] = useState("");

  const [viewMode, setViewMode] = useState("grid");

  // Users
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  // Roles
  const [selectedRole, setSelectedRole] = useState(null);
  const [showAddRole, setShowAddRole] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Staff",
    is_active: true,
  });

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [],
  });

  // Queries & Mutations
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();

  const { data: roles = [], isLoading: rolesLoading } = useGetRolesQuery();

  const [createUser, { isLoading: creatingUser }] = useCreateUserMutation();

  const [deleteUser] = useDeleteUserMutation();

  const [createRole, { isLoading: creatingRole }] = useCreateRoleMutation();

  const [deleteRole] = useDeleteRoleMutation();

  const filteredUsers = useMemo(() => {
    if (!search) return users;

    const term = search.toLowerCase();

    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term),
    );
  }, [users, search]);

  const filteredRoles = useMemo(() => {
    if (!search) return roles;

    const term = search.toLowerCase();

    return roles.filter((r) => r.name?.toLowerCase().includes(term));
  }, [roles, search]);

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Name and Email are required");
      return;
    }

    try {
      await createUser(newUser).unwrap();

      setShowAddUser(false);

      resetUserForm();

      toast.success("User created successfully");
    } catch (err) {
      toast.error("Failed to create user");
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.name) {
      toast.error("Role name is required");
      return;
    }

    try {
      await createRole(newRole).unwrap();

      setShowAddRole(false);

      setNewRole({
        name: "",
        description: "",
        permissions: [],
      });

      toast.success("Role created successfully");
    } catch (err) {
      toast.error("Failed to create role");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;

    try {
      await deleteUser(id).unwrap();

      setSelectedUser(null);

      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleDeleteRole = async (id) => {
    if (!confirm("Delete this role?")) return;

    try {
      await deleteRole(id).unwrap();

      setSelectedRole(null);

      toast.success("Role deleted successfully");
    } catch (err) {
      toast.error("Failed to delete role");
    }
  };

  const resetUserForm = () => {
    setNewUser({
      name: "",
      email: "",
      phone: "",
      role: "Staff",
      is_active: true,
    });
  };

  if (usersLoading || rolesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#ef7f1b]" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* HEADER */}
      <div className="border-b bg-card px-4 py-5 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Users & Roles
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              Manage team members and permissions
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* SEARCH */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search users or roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* VIEW TOGGLE */}
            <div className="flex items-center rounded-xl border bg-card overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 transition ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>

              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-2 transition ${
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <Table2 className="h-4 w-4" />
              </button>
            </div>

            <Button
              onClick={() =>
                activeTab === "users"
                  ? setShowAddUser(true)
                  : setShowAddRole(true)
              }
              className="bg-[#ef7f1b] hover:bg-[#d66e15]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add {activeTab === "users" ? "User" : "Role"}
            </Button>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-1 flex-col"
      >
        <div className="px-4 md:px-6 pt-5">
          <TabsList className="w-full md:w-fit">
            <TabsTrigger value="users" className="gap-2 flex-1 md:flex-none">
              <UserCheck className="h-4 w-4" />
              Users
            </TabsTrigger>

            <TabsTrigger value="roles" className="gap-2 flex-1 md:flex-none">
              <Shield className="h-4 w-4" />
              Roles & Permissions
            </TabsTrigger>
          </TabsList>
        </div>

        {/* USERS TAB */}
        <TabsContent value="users" className="flex-1 px-4 py-5 md:px-6">
          {filteredUsers.length === 0 ? (
            <div className="flex h-80 items-center justify-center text-muted-foreground">
              No users found
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredUsers.map((user) => (
                <Card
                  key={user.id}
                  className="cursor-pointer p-5 transition-all hover:border-primary/20 hover:shadow-soft"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-start justify-between">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-gradient-to-br from-[#ef7f1b] to-orange-600 text-xl font-bold text-white">
                        {user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info("Edit user");
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-lg font-semibold">{user.name}</h3>

                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{user.email}</span>
                    </div>

                    {user.phone && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {user.phone}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <Badge variant="outline">
                      {user.role?.display_name ||
                        user.role?.name ||
                        user.role ||
                        "No Role"}
                    </Badge>

                    <Badge variant={user.is_active ? "default" : "secondary"}>
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead className="bg-muted/40">
                    <tr className="border-b">
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        User
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Email
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Phone
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Role
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b hover:bg-muted/30 transition cursor-pointer"
                        onClick={() => setSelectedUser(user)}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-[#ef7f1b] text-white font-bold">
                                {user.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div>
                              <p className="font-medium">{user.name}</p>

                              <p className="text-xs text-muted-foreground">
                                ID: {user.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm">{user.email}</td>

                        <td className="px-5 py-4 text-sm">
                          {user.phone || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <Badge variant="outline">
                            {user.role?.display_name ||
                              user.role?.name ||
                              user.role ||
                              "No Role"}
                          </Badge>
                        </td>

                        <td className="px-5 py-4">
                          <Badge
                            variant={user.is_active ? "default" : "secondary"}
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </td>

                        <td
                          className="px-5 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-9 w-9"
                              onClick={() => toast.info("Edit user")}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-9 w-9"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ROLES TAB */}
        <TabsContent value="roles" className="flex-1 px-4 py-5 md:px-6">
          {filteredRoles.length === 0 ? (
            <div className="flex h-80 items-center justify-center text-muted-foreground">
              No roles found
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredRoles.map((role) => (
                <Card
                  key={role.id}
                  className="cursor-pointer p-6 hover:border-primary/20 hover:shadow-soft transition-all"
                  onClick={() => setSelectedRole(role)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="rounded-2xl bg-orange-100 p-3">
                        <Shield className="h-7 w-7 text-[#ef7f1b]" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">{role.name}</h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {role.description || "No description"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info("Edit role");
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Badge variant="secondary">
                      {role.permissions?.length || 0} permissions
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead className="bg-muted/40">
                    <tr className="border-b">
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Role
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Description
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Permissions
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRoles.map((role) => (
                      <tr
                        key={role.id}
                        className="border-b hover:bg-muted/30 transition cursor-pointer"
                        onClick={() => setSelectedRole(role)}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-orange-100 p-2">
                              <Shield className="h-5 w-5 text-[#ef7f1b]" />
                            </div>

                            <span className="font-medium">{role.name}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {role.description || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <Badge variant="secondary">
                            {role.permissions?.length || 0} permissions
                          </Badge>
                        </td>

                        <td
                          className="px-5 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-9 w-9"
                              onClick={() => toast.info("Edit role")}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-9 w-9"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteRole(role.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ADD USER DIALOG */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div>
              <Label>Name *</Label>

              <Input
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    name: e.target.value,
                  })
                }
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label>Email *</Label>

              <Input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    email: e.target.value,
                  })
                }
                placeholder="john@example.com"
              />
            </div>

            <div>
              <Label>Phone</Label>

              <Input
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Role</Label>

              <Select
                value={newUser.role}
                onValueChange={(v) =>
                  setNewUser({
                    ...newUser,
                    role: v,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.name}>
                      {r.display_name || r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Active Status</Label>

              <Switch
                checked={newUser.is_active}
                onCheckedChange={(v) =>
                  setNewUser({
                    ...newUser,
                    is_active: v,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUser(false)}>
              Cancel
            </Button>

            <Button
              onClick={handleCreateUser}
              disabled={creatingUser}
              className="bg-[#ef7f1b]"
            >
              {creatingUser && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADD ROLE DIALOG */}
      <Dialog open={showAddRole} onOpenChange={setShowAddRole}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div>
              <Label>Role Name *</Label>

              <Input
                value={newRole.name}
                onChange={(e) =>
                  setNewRole({
                    ...newRole,
                    name: e.target.value,
                  })
                }
                placeholder="Manager"
              />
            </div>

            <div>
              <Label>Description</Label>

              <Input
                value={newRole.description}
                onChange={(e) =>
                  setNewRole({
                    ...newRole,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label className="mb-3 block">Permissions</Label>

              <ScrollArea className="h-72 rounded-xl border p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {AVAILABLE_PERMISSIONS.map((perm) => (
                    <label
                      key={perm}
                      className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted cursor-pointer"
                    >
                      <Checkbox
                        checked={newRole.permissions.includes(perm)}
                        onCheckedChange={(checked) =>
                          setNewRole((prev) => ({
                            ...prev,
                            permissions: checked
                              ? [...prev.permissions, perm]
                              : prev.permissions.filter((p) => p !== perm),
                          }))
                        }
                      />

                      <span className="text-sm capitalize">
                        {perm.replace(".", " • ")}
                      </span>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRole(false)}>
              Cancel
            </Button>

            <Button
              onClick={handleCreateRole}
              disabled={creatingRole}
              className="bg-[#ef7f1b]"
            >
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* USER SHEET */}
      <Sheet open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <SheetContent className="w-full sm:w-[460px] overflow-auto">
          {selectedUser && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-gradient-to-br from-[#ef7f1b] to-orange-600 text-3xl font-bold text-white">
                      {selectedUser.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <SheetTitle>{selectedUser.name}</SheetTitle>

                    <SheetDescription>{selectedUser.email}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-8 space-y-6">
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    {selectedUser.email}
                  </div>

                  {selectedUser.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      {selectedUser.phone}
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />

                    <Badge variant="outline">
                      {selectedUser.role?.display_name ||
                        selectedUser.role?.name ||
                        selectedUser.role}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleDeleteUser(selectedUser.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ROLE SHEET */}
      <Sheet open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
        <SheetContent className="w-full sm:w-[480px] overflow-auto">
          {selectedRole && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <Shield className="h-7 w-7 text-[#ef7f1b]" />
                  {selectedRole.name}
                </SheetTitle>

                <SheetDescription>{selectedRole.description}</SheetDescription>
              </SheetHeader>

              <div className="mt-8">
                <h4 className="mb-4 font-semibold">Permissions</h4>

                <div className="space-y-2">
                  {selectedRole.permissions?.map((perm) => (
                    <div
                      key={perm}
                      className="rounded-xl border bg-muted/30 px-3 py-2 text-sm"
                    >
                      {perm}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleDeleteRole(selectedRole.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Role
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
