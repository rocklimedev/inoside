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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  Building2,
  ChevronRight,
  Filter,
} from "lucide-react";

// RTK Query
import {
  useGetPersonsQuery,
  useDeletePersonMutation,
  useGetPersonTypesQuery,
} from "@/api/personApi";

import AddVendorForm from "@/components/vendors/AddVendorForm";
import VendorProfile from "@/components/vendors/VendorProfile";

const ratingStars = (rating = 0) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 transition-all ${
            i < Math.floor(rating)
              ? "fill-[#ef7f1b] text-[#ef7f1b]"
              : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

export default function VendorsPage() {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showAdd, setShowAdd] = useState(false);
  const [activeVendor, setActiveVendor] = useState(null);
  const [filterTrade, setFilterTrade] = useState("all");

  const isClient = user?.role === "Client";

  // Queries
  const { data: persons = [], isLoading: personsLoading } =
    useGetPersonsQuery();
  const { data: personTypes = [] } = useGetPersonTypesQuery();
  const [deletePerson] = useDeletePersonMutation();

  // Get all vendor-like entries (you can adjust this logic)
  const vendors = useMemo(() => {
    return persons.filter((p) => {
      const typeName = p.type?.name?.toLowerCase() || "";
      return ["vendor", "materials", "contractor", "cm contractors"].some((t) =>
        typeName.includes(t),
      );
    });
  }, [persons]);

  const tradeOptions = useMemo(() => {
    const uniqueTrades = Array.from(
      new Set(vendors.map((v) => v.type_of_business).filter(Boolean)),
    );
    return uniqueTrades;
  }, [vendors]);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      await deletePerson(id).unwrap();
      toast.success("Vendor deleted successfully");
      setActiveVendor(null);
    } catch {
      toast.error("Failed to delete vendor");
    }
  };

  if (personsLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#ef7f1b] border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      className="flex h-full flex-col bg-[#fafafa]"
      data-testid="vendors-page"
    >
      {/* Header */}
      <div className="animate-fadeIn border-b bg-white px-4 py-4 shadow-sm md:px-6">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1
              className="text-2xl font-black tracking-tight text-black"
              data-testid="vendors-title"
            >
              Vendors
            </h1>
            <p className="mt-1 text-xs text-gray-400">
              {vendors.length} vendor{vendors.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-white">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-all ${viewMode === "grid" ? "bg-[#ef7f1b] text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-all ${viewMode === "list" ? "bg-[#ef7f1b] text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {!isClient && (
              <Button
                onClick={() => setShowAdd(true)}
                className="bg-[#ef7f1b] text-white hover:bg-[#d66e15]"
                size="sm"
                data-testid="add-vendor-btn"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Vendor
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors..."
              className="h-10 border-gray-200 pl-10 focus-visible:ring-[#ef7f1b]"
              data-testid="vendor-search"
            />
          </div>

          <Select value={filterTrade} onValueChange={setFilterTrade}>
            <SelectTrigger className="h-10 w-full border-gray-200 md:w-52">
              <div className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                <SelectValue placeholder="All Trades" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trades</SelectItem>
              {tradeOptions.map((trade) => (
                <SelectItem key={trade} value={trade}>
                  {trade}
                </SelectItem>
              ))}
              <SelectItem value="other">Other / Not Specified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {filtered.length === 0 ? (
            <div className="animate-fadeIn py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
                <Building2 className="h-8 w-8 text-[#ef7f1b]" />
              </div>
              <h3 className="text-sm font-semibold text-black">
                No vendors found
              </h3>
              <p className="mt-1 text-xs text-gray-400">
                Try adjusting your filters or search
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filtered.map((vendor, i) => (
                <Card
                  key={vendor.id}
                  onClick={() => setActiveVendor(vendor)}
                  data-testid={`vendor-card-${i}`}
                  className="animate-fadeInUp cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-[#ef7f1b]/30 hover:shadow-lg"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-sm font-black text-[#ef7f1b]">
                      {vendor.name?.[0] || "V"}
                    </div>
                    <Badge className="border-0 bg-gray-100 text-[10px] text-gray-600">
                      {vendor.type_of_business || vendor.type?.name || "Vendor"}
                    </Badge>
                  </div>

                  <h3 className="truncate text-sm font-bold text-black">
                    {vendor.name}
                  </h3>

                  {(vendor.area_covered || vendor.notes) && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">
                        {vendor.area_covered || vendor.notes}
                      </span>
                    </div>
                  )}

                  <div className="mt-3">{ratingStars(vendor.rating)}</div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-[10px] text-gray-500">
                    <span>{vendor.type_of_business || "—"}</span>
                    <span>{vendor.mobile_number}</span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-3">
              {filtered.map((vendor, i) => (
                <Card
                  key={vendor.id}
                  onClick={() => setActiveVendor(vendor)}
                  data-testid={`vendor-row-${i}`}
                  className="animate-fadeIn flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:border-[#ef7f1b]/30 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-sm font-black text-[#ef7f1b]">
                    {vendor.name?.[0] || "V"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-black">
                      {vendor.name}
                    </h3>
                    <p className="truncate text-[11px] text-gray-400">
                      {vendor.type_of_business || vendor.type?.name} •{" "}
                      {vendor.mobile_number}
                    </p>
                  </div>

                  <div className="hidden sm:block">
                    {ratingStars(vendor.rating)}
                  </div>

                  <Badge className="border-0 bg-gray-100 text-[10px] text-gray-600">
                    {vendor.type_of_business || "Vendor"}
                  </Badge>

                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Add & Profile Modals */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-2xl rounded-2xl border-0 p-0 shadow-2xl">
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle className="text-lg font-bold">Add Vendor</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <AddVendorForm
              vendorTypeId={null}
              onSuccess={() => setShowAdd(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Sheet open={!!activeVendor} onOpenChange={() => setActiveVendor(null)}>
        <SheetContent className="w-[420px] border-l bg-white p-0 sm:w-[500px]">
          {activeVendor && (
            <VendorProfile
              vendor={activeVendor}
              isClient={isClient}
              onDelete={() => handleDelete(activeVendor.id)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
