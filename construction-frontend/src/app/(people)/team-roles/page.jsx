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
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

import { Search, Plus, Shield, Loader2, Trash2 } from "lucide-react";

// RTK Query Imports
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

  // Users State
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  // Roles State
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

  // RTK Queries & Mutations
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

  const getPermissionCount = (permissions) => {
    if (!permissions) return 0;
    if (Array.isArray(permissions)) return permissions.length;
    return 0;
  };

  const getRoleName = (role) => {
    if (!role) return "N/A";
    if (typeof role === "string") return role;
    return role.display_name || role.name || "N/A";
  };

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
      toast.success("User deleted");
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
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#ef7f1b]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="users-page">
      {/* Header */}
      <div className="p-6 border-b bg-white">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black">Users & Roles</h1>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2.5 w-80 border focus-within:border-[#ef7f1b]">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search users or roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
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
              <Plus className="w-4 h-4 mr-2" />
              {activeTab === "users" ? "Add User" : "Add Role"}
            </Button>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="mx-6 mt-4 w-fit">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="flex-1 mt-0">
          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredUsers.map((user) => (
                  <Card
                    key={user.id}
                    className="p-5 hover:shadow-lg cursor-pointer transition-all hover:border-[#ef7f1b]/30"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ef7f1b] to-orange-600 text-white flex items-center justify-center text-xl font-bold">
                        {user.name?.charAt(0)}
                      </div>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <h3 className="mt-4 font-bold text-lg">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>

                    <div className="mt-4">
                      <Badge variant="outline">{getRoleName(user.role)}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="flex-1 mt-0">
          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRoles.map((role) => (
                  <Card
                    key={role.id}
                    className="p-5 hover:shadow-md cursor-pointer"
                    onClick={() => setSelectedRole(role)}
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-8 h-8 text-[#ef7f1b]" />
                      <div>
                        <h3 className="font-bold">{role.name}</h3>
                        <p className="text-sm text-gray-500">
                          {role.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Badge variant="secondary">
                        {getPermissionCount(role.permissions)} permissions
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Name *</Label>
              <Input
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
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
                  <SelectValue />
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
              <Label>Active</Label>
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
              {creatingUser ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create User"
              )}
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
          <div className="space-y-4 py-4">
            <div>
              <Label>Role Name *</Label>
              <Input
                value={newRole.name}
                onChange={(e) =>
                  setNewRole({ ...newRole, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={newRole.description}
                onChange={(e) =>
                  setNewRole({ ...newRole, description: e.target.value })
                }
              />
            </div>

            <div>
              <Label className="mb-3 block">Permissions</Label>
              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-auto pr-2">
                {AVAILABLE_PERMISSIONS.map((perm) => (
                  <label
                    key={perm}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <Checkbox
                      checked={newRole.permissions.includes(perm)}
                      onCheckedChange={(checked) => {
                        setNewRole((prev) => ({
                          ...prev,
                          permissions: checked
                            ? [...prev.permissions, perm]
                            : prev.permissions.filter((p) => p !== perm),
                        }));
                      }}
                    />
                    {perm}
                  </label>
                ))}
              </div>
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
        <SheetContent className="w-[440px]">
          {selectedUser && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#ef7f1b] text-white flex items-center justify-center text-2xl">
                    {selectedUser.name?.charAt(0)}
                  </div>
                  {selectedUser.name}
                </SheetTitle>
              </SheetHeader>

              <div className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <strong>Email:</strong> {selectedUser.email}
                  </div>
                  <div>
                    <strong>Role:</strong>{" "}
                    <Badge>{getRoleName(selectedUser.role)}</Badge>
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    {selectedUser.is_active ? "Active" : "Inactive"}
                  </div>
                </div>

                <Separator />

                <Button
                  variant="destructive"
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  className="w-full"
                >
                  <Trash2 className="mr-2" /> Delete User
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
