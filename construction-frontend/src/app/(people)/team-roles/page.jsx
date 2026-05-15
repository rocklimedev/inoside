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
  Search,
  Plus,
  Shield,
  Loader2,
  Trash2,
  UserCheck,
  Mail,
  Phone,
  Calendar,
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
      setNewRole({ name: "", description: "", permissions: [] });
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
    if (!confirm("Are you sure you want to delete this role?")) return;
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
    <div className="flex h-full flex-col" data-testid="users-page">
      {/* Header */}
      <div className="border-b bg-white px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users & Roles</h1>
            <p className="text-muted-foreground mt-1">
              Manage team members and permissions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users or roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
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
        onValueChange={(v) => setActiveTab(v)}
        className="flex flex-1 flex-col"
      >
        <TabsList className="mx-6 mt-6 w-fit">
          <TabsTrigger value="users" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="flex-1 px-6 py-6">
          {filteredUsers.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center text-center">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredUsers.map((user) => (
                <Card
                  key={user.id}
                  className="cursor-pointer p-6 transition-all hover:shadow-lg hover:border-[#ef7f1b]/30"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-start justify-between">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-gradient-to-br from-[#ef7f1b] to-orange-600 text-xl font-bold text-white">
                        {user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Badge variant={user.is_active ? "default" : "secondary"}>
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Badge variant="outline">
                      {user.role?.display_name ||
                        user.role?.name ||
                        user.role ||
                        "No Role"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="flex-1 px-6 py-6">
          {filteredRoles.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center text-center">
              <p className="text-muted-foreground">No roles found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredRoles.map((role) => (
                <Card
                  key={role.id}
                  className="cursor-pointer p-6 transition-all hover:shadow-md hover:border-[#ef7f1b]/30"
                  onClick={() => setSelectedRole(role)}
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-orange-100 p-3">
                      <Shield className="h-8 w-8 text-[#ef7f1b]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{role.name}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground mt-1">
                        {role.description || "No description provided"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Badge variant="secondary">
                      {Array.isArray(role.permissions)
                        ? role.permissions.length
                        : 0}{" "}
                      permissions
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
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
                  setNewUser({ ...newUser, name: e.target.value })
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
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(v) => setNewUser({ ...newUser, role: v })}
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
                  setNewUser({ ...newUser, is_active: v })
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

      {/* Add Role Dialog */}
      <Dialog open={showAddRole} onOpenChange={setShowAddRole}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div>
              <Label>Role Name *</Label>
              <Input
                value={newRole.name}
                onChange={(e) =>
                  setNewRole({ ...newRole, name: e.target.value })
                }
                placeholder="Manager"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={newRole.description}
                onChange={(e) =>
                  setNewRole({ ...newRole, description: e.target.value })
                }
                placeholder="Can manage projects and clients"
              />
            </div>

            <div>
              <Label className="mb-3 block">Permissions</Label>
              <ScrollArea className="h-80 rounded-md border p-4">
                <div className="grid grid-cols-2 gap-3">
                  {AVAILABLE_PERMISSIONS.map((perm) => (
                    <label
                      key={perm}
                      className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-1 rounded"
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
                      <span className="capitalize">
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

      {/* User Detail Sheet */}
      <Sheet open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <SheetContent className="w-[420px] sm:w-[460px]">
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
                    <span>{selectedUser.email}</span>
                  </div>
                  {selectedUser.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span>{selectedUser.phone}</span>
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
                  size="lg"
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Role Detail Sheet - NEW */}
      <Sheet open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
        <SheetContent className="w-[420px] sm:w-[480px]">
          {selectedRole && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-[#ef7f1b]" />
                  {selectedRole.name}
                </SheetTitle>
                <SheetDescription>{selectedRole.description}</SheetDescription>
              </SheetHeader>

              <div className="mt-8">
                <h4 className="font-medium mb-3">
                  Permissions ({selectedRole.permissions?.length || 0})
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedRole.permissions?.map((perm) => (
                    <div
                      key={perm}
                      className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm"
                    >
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      {perm}
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={() => handleDeleteRole(selectedRole.id)}
                  className="w-full"
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
