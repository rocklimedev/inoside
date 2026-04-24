import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Grid3X3,
  List,
  Star,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  ArrowLeft,
  Loader2,
  Trash2,
  Edit3,
  Filter,
  X,
  DollarSign,
  Clock,
  Building2,
  Award,
  ChevronRight,
} from "lucide-react";

const TRADE_TYPES = [
  "Civil",
  "Electrical",
  "Plumbing",
  "Furniture",
  "Fixtures",
  "Painting",
  "HVAC",
  "Flooring",
  "Landscaping",
  "Interior",
  "Structural",
  "Other",
];
const BUDGET_SEGMENTS = ["Economy", "Mid-Range", "Premium", "Luxury"];
const PRICE_RANGES = ["Low", "Mid", "High", "Premium"];

const ratingStars = (r) => {
  const stars = [];
  for (let i = 0; i < 5; i++)
    stars.push(
      <Star
        key={i}
        className={`w-3 h-3 ${i < r ? "fill-[#ef7f1b] text-[#ef7f1b]" : "text-gray-200"}`}
      />,
    );
  return <div className="flex gap-0.5">{stars}</div>;
};

export default function VendorsPage() {
  const { api, user } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showAdd, setShowAdd] = useState(false);
  const [activeVendor, setActiveVendor] = useState(null);
  const [filterTrade, setFilterTrade] = useState("all");
  const [filterBudget, setFilterBudget] = useState("all");
  const isClient = user?.role === "Client";

  useEffect(() => {
    fetchVendors();
  }, []);
  const fetchVendors = async () => {
    try {
      const r = await api.get("/vendors");
      setVendors(r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/vendors/${id}`);
      setVendors((p) => p.filter((v) => v.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed");
    }
  };

  const filtered = vendors.filter((v) => {
    if (
      search &&
      !v.name?.toLowerCase().includes(search.toLowerCase()) &&
      !v.trade_type?.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (filterTrade !== "all" && v.trade_type !== filterTrade) return false;
    if (filterBudget !== "all" && v.budget_segment !== filterBudget)
      return false;
    return true;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="flex flex-col h-full" data-testid="vendors-page">
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1
              className="text-xl font-black text-black"
              data-testid="vendors-title"
            >
              Vendors
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {vendors.length} vendor{vendors.length !== 1 ? "s" : ""} in
              database
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 ${viewMode === "grid" ? "bg-gray-100" : ""}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 ${viewMode === "list" ? "bg-gray-100" : ""}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            {!isClient && (
              <Button
                onClick={() => setShowAdd(true)}
                className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
                size="sm"
                data-testid="add-vendor-btn"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Vendor
              </Button>
            )}
          </div>
        </div>
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors..."
              className="pl-10"
              data-testid="vendor-search"
            />
          </div>
          <Select value={filterTrade} onValueChange={setFilterTrade}>
            <SelectTrigger className="w-36 h-9 text-xs">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trades</SelectItem>
              {TRADE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterBudget} onValueChange={setFilterBudget}>
            <SelectTrigger className="w-36 h-9 text-xs">
              <DollarSign className="w-3 h-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Budgets</SelectItem>
              {BUDGET_SEGMENTS.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No vendors found</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((v, i) => (
                <Card
                  key={v.id}
                  className="p-4 hover:shadow-lg hover:border-[#ef7f1b]/20 transition-all cursor-pointer group"
                  onClick={() => setActiveVendor(v)}
                  data-testid={`vendor-card-${i}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#ef7f1b] flex items-center justify-center font-black text-sm">
                      {v.name?.[0]}
                    </div>
                    <Badge className="bg-gray-100 text-gray-600 text-[9px] border-0">
                      {v.trade_type}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-black">{v.name}</h3>
                  {v.location && (
                    <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {v.location}
                    </p>
                  )}
                  <div className="mt-2">{ratingStars(v.rating)}</div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 text-[10px] text-gray-400">
                    <span>{v.price_range || "—"} range</span>
                    <span>{v.past_projects_count} projects</span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((v, i) => (
                <Card
                  key={v.id}
                  className="p-3 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setActiveVendor(v)}
                  data-testid={`vendor-row-${i}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#ef7f1b] flex items-center justify-center font-black text-sm shrink-0">
                    {v.name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-black">{v.name}</h3>
                    <p className="text-[10px] text-gray-400">
                      {v.trade_type} &middot; {v.location}
                    </p>
                  </div>
                  {ratingStars(v.rating)}
                  <Badge className="bg-gray-100 text-gray-600 text-[9px] border-0">
                    {v.price_range}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Add Vendor Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg" data-testid="add-vendor-dialog">
          <DialogHeader>
            <DialogTitle>Add Vendor</DialogTitle>
          </DialogHeader>
          <AddVendorForm
            api={api}
            onSuccess={(v) => {
              setVendors((p) => [...p, v]);
              setShowAdd(false);
              toast.success("Vendor added");
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Vendor Profile Sheet */}
      <Sheet
        open={!!activeVendor}
        onOpenChange={(o) => {
          if (!o) setActiveVendor(null);
        }}
      >
        <SheetContent className="w-[420px] sm:w-[480px] p-0">
          {activeVendor && (
            <VendorProfile
              vendor={activeVendor}
              api={api}
              user={user}
              onClose={() => {
                setActiveVendor(null);
                fetchVendors();
              }}
              onDelete={() => {
                handleDelete(activeVendor.id);
                setActiveVendor(null);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function AddVendorForm({ api, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    trade_type: "Civil",
    services: "",
    products: "",
    location: "",
    rating: 3,
    price_range: "Mid",
    budget_segment: "Mid-Range",
    timeline_capability: "",
    past_projects_count: 0,
    internal_remarks: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Vendor name required");
      return;
    }
    setSaving(true);
    try {
      const r = await api.post("/vendors", form);
      onSuccess(r.data);
    } catch {
      toast.error("Failed");
    } finally {
      setSaving(false);
    }
  };

  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Vendor Name *
          </Label>
          <Input
            value={form.name}
            onChange={(e) => u("name", e.target.value)}
            className="mt-1"
            data-testid="vendor-name-input"
          />
        </div>
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Contact Person
          </Label>
          <Input
            value={form.contact_person}
            onChange={(e) => u("contact_person", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Phone
          </Label>
          <Input
            value={form.phone}
            onChange={(e) => u("phone", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Email
          </Label>
          <Input
            value={form.email}
            onChange={(e) => u("email", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Trade Type
          </Label>
          <Select
            value={form.trade_type}
            onValueChange={(v) => u("trade_type", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRADE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Location
          </Label>
          <Input
            value={form.location}
            onChange={(e) => u("location", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Rating (1-5)
          </Label>
          <Input
            type="number"
            min={1}
            max={5}
            value={form.rating}
            onChange={(e) => u("rating", Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Price Range
          </Label>
          <Select
            value={form.price_range}
            onValueChange={(v) => u("price_range", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRICE_RANGES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Past Projects
          </Label>
          <Input
            type="number"
            value={form.past_projects_count}
            onChange={(e) => u("past_projects_count", Number(e.target.value))}
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Services Offered
        </Label>
        <Textarea
          value={form.services}
          onChange={(e) => u("services", e.target.value)}
          className="mt-1"
          rows={2}
        />
      </div>
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Products
        </Label>
        <Textarea
          value={form.products}
          onChange={(e) => u("products", e.target.value)}
          className="mt-1"
          rows={2}
        />
      </div>
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Internal Remarks
        </Label>
        <Textarea
          value={form.internal_remarks}
          onChange={(e) => u("internal_remarks", e.target.value)}
          className="mt-1"
          rows={2}
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
          data-testid="vendor-submit"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Plus className="w-4 h-4 mr-1" />
          )}{" "}
          Add Vendor
        </Button>
      </div>
    </div>
  );
}

function VendorProfile({ vendor, api, user, onClose, onDelete }) {
  const isClient = user?.role === "Client";
  return (
    <div className="flex flex-col h-full" data-testid="vendor-profile">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-black">{vendor.name}</h2>
          {!isClient && (
            <button
              onClick={onDelete}
              className="text-gray-300 hover:text-[#e31d3b]"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge className="bg-gray-100 text-gray-600 text-[9px] border-0">
            {vendor.trade_type}
          </Badge>
          {ratingStars(vendor.rating)}
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <ProfileSection title="Contact">
            {vendor.contact_person && (
              <ProfileField
                icon={Briefcase}
                label="Contact Person"
                value={vendor.contact_person}
              />
            )}
            {vendor.phone && (
              <ProfileField icon={Phone} label="Phone" value={vendor.phone} />
            )}
            {vendor.email && (
              <ProfileField icon={Mail} label="Email" value={vendor.email} />
            )}
            {vendor.location && (
              <ProfileField
                icon={MapPin}
                label="Location"
                value={vendor.location}
              />
            )}
          </ProfileSection>
          <ProfileSection title="Capabilities">
            {vendor.services && (
              <ProfileField
                icon={Briefcase}
                label="Services"
                value={vendor.services}
              />
            )}
            {vendor.products && (
              <ProfileField
                icon={Building2}
                label="Products"
                value={vendor.products}
              />
            )}
            <ProfileField
              icon={DollarSign}
              label="Price Range"
              value={vendor.price_range || "—"}
            />
            <ProfileField
              icon={Award}
              label="Past Projects"
              value={String(vendor.past_projects_count)}
            />
            {vendor.timeline_capability && (
              <ProfileField
                icon={Clock}
                label="Timeline"
                value={vendor.timeline_capability}
              />
            )}
          </ProfileSection>
          {!isClient && vendor.internal_remarks && (
            <ProfileSection title="Internal Remarks">
              <p className="text-xs text-gray-600">{vendor.internal_remarks}</p>
            </ProfileSection>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function ProfileSection({ title, children }) {
  return (
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#ef7f1b] mb-2">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-[10px] text-gray-400">{label}</p>
        <p className="text-xs text-black">{value}</p>
      </div>
    </div>
  );
}
