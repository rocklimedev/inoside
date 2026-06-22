"use client";

import React, { useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "sonner";

import {
  Plus,
  Search,
  Grid3X3,
  List,
  Star,
  MapPin,
  Filter,
} from "lucide-react";

import { useGetVendorsQuery, useDeleteVendorMutation } from "@/api/vendorsApi";

import AddVendorForm from "@/components/vendors/AddVendorForm";
import VendorProfile from "@/components/vendors/VendorProfile";

/* ================= RATING ================= */
const RatingStars = ({ rating = 0 }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "fill-[#ef7f1b] text-[#ef7f1b]"
            : "text-gray-200"
        }`}
      />
    ))}
  </div>
);

export default function VendorsPage() {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showAdd, setShowAdd] = useState(false);

  const [activeVendor, setActiveVendor] = useState(null);
  const [editingVendor, setEditingVendor] = useState(null);

  const [filterTrade, setFilterTrade] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);

  const isClient = user?.role === "Client";

  const { data: vendors = [], isLoading } = useGetVendorsQuery();
  const [deleteVendor] = useDeleteVendorMutation();

  /* ================= FILTER OPTIONS ================= */
  const tradeOptions = useMemo(() => {
    return Array.from(
      new Set(vendors.map((v) => v.type_of_business).filter(Boolean)),
    );
  }, [vendors]);

  /* ================= FILTERED DATA ================= */
  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();

    return vendors.filter((v) => {
      const matchesSearch =
        !term ||
        v.name?.toLowerCase().includes(term) ||
        v.company_name?.toLowerCase().includes(term) ||
        v.type_of_business?.toLowerCase().includes(term) ||
        v.notes?.toLowerCase().includes(term);

      const matchesTrade =
        filterTrade === "all" ||
        v.type_of_business === filterTrade ||
        (filterTrade === "other" && !v.type_of_business);

      return matchesSearch && matchesTrade;
    });
  }, [vendors, search, filterTrade]);

  /* ================= ACTIONS ================= */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;

    try {
      await deleteVendor(id).unwrap();
      toast.success("Vendor deleted successfully");
      setActiveVendor(null);
      setEditingVendor(null);
    } catch {
      toast.error("Failed to delete vendor");
    }
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setActiveVendor(vendor);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
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
            <h1 className="text-2xl font-black">Vendors</h1>
            <p className="mt-1 text-xs text-gray-400">
              {vendors.length} vendors found
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-[#ef7f1b] text-white"
                    : "text-gray-500"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-[#ef7f1b] text-white"
                    : "text-gray-500"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {!isClient && (
              <Button
                onClick={() => setShowAdd(true)}
                className="bg-[#ef7f1b]"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Vendor
              </Button>
            )}
          </div>
        </div>

        {/* ================= FILTERS ================= */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors..."
              className="pl-10"
            />
          </div>

          <Select value={filterTrade} onValueChange={setFilterTrade}>
            <SelectTrigger className="w-full md:w-52">
              <Filter className="h-3 w-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trades</SelectItem>
              {tradeOptions.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No vendors found
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((vendor) => (
                <Card
                  key={vendor.id}
                  className="rounded-2xl border bg-white p-4 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center font-bold text-[#ef7f1b]">
                      {vendor.name?.[0] || "V"}
                    </div>

                    <Badge className="text-[10px] bg-gray-100">
                      {vendor.type_of_business || "Vendor"}
                    </Badge>
                  </div>

                  <h3 className="font-bold truncate">{vendor.name}</h3>

                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">
                      {vendor.area_covered || "—"}
                    </span>
                  </div>

                  <div className="mt-2">
                    <RatingStars rating={vendor.rating} />
                  </div>

                  {/* ================= 3 DOT MENU ================= */}
                  <div className="relative mt-3 flex justify-between border-t pt-2 text-xs">
                    <span className="text-gray-500">
                      {vendor.type_of_business}
                    </span>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === vendor.id ? null : vendor.id,
                          );
                        }}
                        className="text-lg px-2 hover:bg-gray-100 rounded"
                      >
                        ⋮
                      </button>

                      {openMenuId === vendor.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />

                          <div className="absolute right-0 bottom-6 z-20 w-32 rounded-lg border bg-white shadow-lg overflow-hidden">
                            <button
                              onClick={() => {
                                setActiveVendor(vendor);
                                setEditingVendor(null);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100"
                            >
                              View
                            </button>

                            <button
                              onClick={() => {
                                handleEdit(vendor);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 text-blue-600"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => {
                                handleDelete(vendor.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((vendor) => (
                <Card
                  key={vendor.id}
                  className="flex items-center gap-3 p-4 hover:shadow-md"
                >
                  <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center font-bold text-[#ef7f1b]">
                    {vendor.name?.[0] || "V"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{vendor.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {vendor.type_of_business} • {vendor.mobile_number}
                    </p>
                  </div>

                  <RatingStars rating={vendor.rating} />

                  {/* ================= 3 DOT MENU ================= */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(
                          openMenuId === vendor.id ? null : vendor.id,
                        );
                      }}
                      className="text-lg px-2 hover:bg-gray-100 rounded"
                    >
                      ⋮
                    </button>

                    {openMenuId === vendor.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                        />

                        <div className="absolute right-0 top-6 z-20 w-32 rounded-lg border bg-white shadow-lg overflow-hidden">
                          <button
                            onClick={() => {
                              setActiveVendor(vendor);
                              setEditingVendor(null);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100"
                          >
                            View
                          </button>

                          <button
                            onClick={() => {
                              handleEdit(vendor);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 text-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              handleDelete(vendor.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-left text-xs hover:bg-gray-100 text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* ================= ADD MODAL ================= */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-2xl">
          <AddVendorForm onSuccess={() => setShowAdd(false)} />
        </DialogContent>
      </Dialog>

      {/* ================= VIEW / EDIT SHEET ================= */}
      <Sheet
        open={!!activeVendor}
        onOpenChange={() => {
          setActiveVendor(null);
          setEditingVendor(null);
        }}
      >
        <SheetContent className="w-full sm:w-[500px] p-0">
          {activeVendor &&
            (editingVendor ? (
              <AddVendorForm
                vendor={editingVendor}
                onSuccess={() => {
                  setActiveVendor(null);
                  setEditingVendor(null);
                }}
              />
            ) : (
              <VendorProfile
                vendor={activeVendor}
                isClient={isClient}
                onDelete={() => handleDelete(activeVendor.id)}
              />
            ))}
        </SheetContent>
      </Sheet>
    </div>
  );
}
