"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Loader2 } from "lucide-react";
import { LayoutGrid, Table2, UserCheck, Shield } from "lucide-react";

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

import UserGrid from "@/components/users/UserGrid";
import UserTable from "@/components/users/UserTable";
import RoleGrid from "@/components/users/RoleGrid";
import RoleTable from "@/components/users/RoleTable";
import AddUserDialog from "@/components/users/AddUserDialog";
import AddRoleDialog from "@/components/users/AddRoleDialog";
import UserSheet from "@/components/users/UserSheet";
import RoleSheet from "@/components/users/RoleSheet";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(
    tabFromUrl === "roles" ? "roles" : "users",
  );

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("table");

  // Users
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  // Roles
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [showAddRole, setShowAddRole] = useState(false);

  // API
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: roles = [], isLoading: rolesLoading } = useGetRolesQuery();

  const [createUser, { isLoading: creatingUser }] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [createRole, { isLoading: creatingRole }] = useCreateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  // Sync tab with URL
  const handleTabChange = (value) => {
    setActiveTab(value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);

    router.replace(`?${params.toString()}`, { scroll: false });
  };

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

  // Users handlers
  const handleAddUser = () => {
    setUserToEdit(null);
    setShowAddUser(true);
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setShowAddUser(true);
  };

  // Roles handlers
  const handleAddRole = () => {
    setRoleToEdit(null);
    setShowAddRole(true);
  };

  const handleEditRole = (role) => {
    setRoleToEdit(role);
    setShowAddRole(true);
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
      {/* Header */}
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
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users or roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Toggle */}
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
              onClick={activeTab === "users" ? handleAddUser : handleAddRole}
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
        onValueChange={handleTabChange}
        className="flex flex-1 flex-col"
      >
        <div className="px-4 md:px-6 pt-5">
          <TabsList className="w-full md:w-fit">
            <TabsTrigger value="users" className="gap-2">
              <UserCheck className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-2">
              <Shield className="h-4 w-4" /> Roles & Permissions
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="users" className="flex-1 px-4 py-5 md:px-6">
          {filteredUsers.length === 0 ? (
            <div className="flex h-80 items-center justify-center text-muted-foreground">
              No users found
            </div>
          ) : viewMode === "grid" ? (
            <UserGrid
              users={filteredUsers}
              onUserClick={setSelectedUser}
              onDelete={deleteUser}
              onEdit={handleEditUser}
            />
          ) : (
            <UserTable
              users={filteredUsers}
              onUserClick={setSelectedUser}
              onDelete={deleteUser}
              onEdit={handleEditUser}
            />
          )}
        </TabsContent>

        <TabsContent value="roles" className="flex-1 px-4 py-5 md:px-6">
          {filteredRoles.length === 0 ? (
            <div className="flex h-80 items-center justify-center text-muted-foreground">
              No roles found
            </div>
          ) : viewMode === "grid" ? (
            <RoleGrid
              roles={filteredRoles}
              onRoleClick={setSelectedRole}
              onDelete={deleteRole}
              onEdit={handleEditRole}
            />
          ) : (
            <RoleTable
              roles={filteredRoles}
              onRoleClick={setSelectedRole}
              onDelete={deleteRole}
              onEdit={handleEditRole}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddUserDialog
        open={showAddUser}
        onOpenChange={setShowAddUser}
        onCreate={createUser}
        isCreating={creatingUser}
        roles={roles}
        userToEdit={userToEdit}
      />

      <AddRoleDialog
        open={showAddRole}
        onOpenChange={setShowAddRole}
        onCreate={createRole}
        isCreating={creatingRole}
        availablePermissions={AVAILABLE_PERMISSIONS}
        roleToEdit={roleToEdit}
      />

      {/* Sheets */}
      <UserSheet
        user={selectedUser}
        open={!!selectedUser}
        onOpenChange={() => setSelectedUser(null)}
        onDelete={deleteUser}
      />

      <RoleSheet
        role={selectedRole}
        open={!!selectedRole}
        onOpenChange={() => setSelectedRole(null)}
        onDelete={deleteRole}
      />
    </div>
  );
}
