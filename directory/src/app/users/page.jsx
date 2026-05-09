"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";

// RTK Query
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/api/userApi";

// UI Components
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// Icons
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  ArrowUpDown,
  User as UserIcon,
  Mail,
  Calendar,
  Trash2,
  Pencil,
} from "lucide-react";

// Components
import UserForm from "@/components/users/UserForm";
import GridView from "@/components/users/GridView";
import ListView from "@/components/users/ListView";

const ROLES = [
  "Admin",
  "Manager",
  "Architect",
  "Engineer",
  "Designer",
  "Viewer",
];

export default function UsersPage() {
  const [viewMode, setViewMode] = useState("grid");

  const [search, setSearch] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    roles: [],
  });

  const [sortBy, setSortBy] = useState("name");

  const [selectedUser, setSelectedUser] = useState(null);

  const [showNewUser, setShowNewUser] = useState(false);

  const [editingUser, setEditingUser] = useState(null);

  // RTK Query
  const { data: users = [], isLoading, isError } = useGetUsersQuery();

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Filter + Sort
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search
    if (search) {
      const s = search.toLowerCase();

      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(s) ||
          u.username?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s),
      );
    }

    // Role Filter
    if (filters.roles.length > 0) {
      result = result.filter((u) => filters.roles.includes(u.role));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }

      if (sortBy === "email") {
        return (a.email || "").localeCompare(b.email || "");
      }

      return 0;
    });

    return result;
  }, [users, search, filters.roles, sortBy]);

  // Create User
  const handleCreateUser = async (data) => {
    try {
      await createUser(data).unwrap();

      toast.success("User created successfully");

      setShowNewUser(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create user");
    }
  };

  // Update User
  const handleUpdateUser = async (data) => {
    try {
      await updateUser({
        id: editingUser.id,
        ...data,
      }).unwrap();

      toast.success("User updated successfully");

      setEditingUser(null);
      setSelectedUser(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update user");
    }
  };

  // Delete User
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await deleteUser(id).unwrap();

      toast.success("User deleted successfully");

      setSelectedUser(null);
    } catch {
      toast.error("Failed to delete user");
    }
  };

  // Toggle Role Filter
  const toggleRole = (role) => {
    setFilters((prev) => ({
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  // Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full" />
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-destructive">
        Failed to load users. Please try again.
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Filters Sidebar */}
      {showFilters && (
        <div className="w-64 border-r bg-card p-5 shrink-0 overflow-auto">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Filters
            </h3>

            <button
              onClick={() => setShowFilters(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          {/* Roles */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
              ROLE
            </p>

            <div className="space-y-3">
              {ROLES.map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={filters.roles.includes(role)}
                    onCheckedChange={() => toggleRole(role)}
                  />

                  <span className="text-sm">{role}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear */}
          {filters.roles.length > 0 && (
            <button
              onClick={() =>
                setFilters({
                  roles: [],
                })
              }
              className="mt-6 text-sm text-primary hover:underline font-medium"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b bg-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title */}
            <h1 className="text-3xl font-black tracking-tight">Users</h1>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />

                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-muted/50"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Filters */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
                <SelectTrigger className="w-36 h-9">
                  <ArrowUpDown className="w-4 h-4 mr-2" />

                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>

                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex border rounded-lg overflow-hidden">
                {[
                  {
                    mode: "grid",
                    icon: LayoutGrid,
                  },
                  {
                    mode: "list",
                    icon: List,
                  },
                ].map(({ mode, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`p-2.5 transition-all ${
                      viewMode === mode
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {/* New User */}
              <Button
                onClick={() => setShowNewUser(true)}
                className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New User
              </Button>
            </div>
          </div>

          {/* Count */}
          <p className="text-sm text-muted-foreground mt-3">
            {filteredUsers.length} user
            {filteredUsers.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6">
            {viewMode === "grid" && (
              <GridView users={filteredUsers} onSelect={setSelectedUser} />
            )}

            {viewMode === "list" && (
              <ListView users={filteredUsers} onSelect={setSelectedUser} />
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Create User Dialog */}
      <Dialog open={showNewUser} onOpenChange={setShowNewUser}>
        <DialogContent className="max-w-lg bg-white border border-gray-200 shadow-xl">
          <UserForm
            onSubmit={handleCreateUser}
            isLoading={isCreating}
            onCancel={() => setShowNewUser(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Update User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="max-w-lg bg-white border border-gray-200 shadow-xl">
          <UserForm
            initialData={editingUser}
            onSubmit={handleUpdateUser}
            isLoading={isUpdating}
            onCancel={() => setEditingUser(null)}
          />
        </DialogContent>
      </Dialog>

      {/* User Details Sheet */}
      <Sheet open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <SheetContent className="w-[420px] sm:w-[480px]">
          {selectedUser && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedUser.name}</SheetTitle>
              </SheetHeader>

              <div className="mt-8 space-y-6">
                {/* Username */}
                <div className="flex gap-4">
                  <UserIcon className="w-5 h-5 text-muted-foreground mt-0.5" />

                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Username
                    </p>

                    <p className="font-medium">@{selectedUser.username}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />

                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Email
                    </p>

                    <p>{selectedUser.email}</p>
                  </div>
                </div>

                {/* Joined */}
                <div className="flex gap-4">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />

                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Joined
                    </p>

                    <p>
                      {selectedUser.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Role */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Role
                  </p>

                  <Badge
                    variant="outline"
                    className="border-[#ef7f1b]/30 text-[#ef7f1b] bg-[#ef7f1b]/10"
                  >
                    {selectedUser.role || "Viewer"}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {/* Edit */}
                  <Button
                    className="w-full bg-[#ef7f1b] hover:bg-[#d66e15]"
                    onClick={() => setEditingUser(selectedUser)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit User
                  </Button>

                  {/* Delete */}
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleDelete(selectedUser.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />

                    {isDeleting ? "Deleting..." : "Delete User"}
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
