"use client";

import { useState } from "react";

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

import { toast } from "sonner";

import { useCreateSiteMutation } from "@/api/sitesApi";

export function SiteFormModal({ open, onClose, onCreated }) {
  const [createSite, { isLoading }] = useCreateSiteMutation();

  const [form, setForm] = useState({
    address: {
      line1: "",
      line2: "",
      landmark: "",
      google_map_link: "",
      city: "",
      state: "",
      country: "India",

      pincode: "",

      latitude: "",
      longitude: "",
    },

    ownership_status: "Owned",

    access_available: true,

    existing_structure: false,
  });

  const resetForm = () => {
    setForm({
      address: {
        line1: "",
        line2: "",
        landmark: "",
        google_map_link: "",
        city: "",
        state: "",
        country: "India",

        pincode: "",

        latitude: "",
        longitude: "",
      },

      ownership_status: "Owned",

      access_available: true,

      existing_structure: false,
    });
  };

  const updateAddressField = (field, value) => {
    setForm((prev) => ({
      ...prev,

      address: {
        ...prev.address,

        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.address.line1.trim()) {
      return toast.error("Address Line 1 is required");
    }

    if (!form.address.city.trim()) {
      return toast.error("City is required");
    }

    try {
      const payload = {
        address: {
          line1: form.address.line1,

          line2: form.address.line2 || null,

          landmark: form.address.landmark || null,

          city: form.address.city,

          state: form.address.state || null,
          google_map_link: form.address.google_map_link || null,
          country: form.address.country || "India",

          pincode: form.address.pincode || null,

          latitude: form.address.latitude
            ? Number(form.address.latitude)
            : null,

          longitude: form.address.longitude
            ? Number(form.address.longitude)
            : null,
        },

        ownership_status: form.ownership_status || null,

        access_available: form.access_available,

        existing_structure: form.existing_structure,
      };

      const result = await createSite(payload).unwrap();

      toast.success("Site created successfully");

      if (onCreated) {
        onCreated(result?.data || result);
      }

      resetForm();

      onClose();
    } catch (error) {
      console.error(error);

      toast.error(error?.data?.message || "Failed to create site");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Site</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ADDRESS LINE 1 */}
          <div className="space-y-2">
            <Label>Address Line 1 *</Label>

            <Input
              placeholder="House No, Street, Area"
              value={form.address.line1}
              onChange={(e) => updateAddressField("line1", e.target.value)}
            />
          </div>

          {/* ADDRESS LINE 2 */}
          <div className="space-y-2">
            <Label>Address Line 2</Label>

            <Input
              placeholder="Apartment, Floor, Suite"
              value={form.address.line2}
              onChange={(e) => updateAddressField("line2", e.target.value)}
            />
          </div>

          {/* LANDMARK */}
          <div className="space-y-2">
            <Label>Landmark</Label>

            <Input
              placeholder="Near Metro Station"
              value={form.address.landmark}
              onChange={(e) => updateAddressField("landmark", e.target.value)}
            />
          </div>

          {/* CITY + STATE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City *</Label>

              <Input
                placeholder="Delhi"
                value={form.address.city}
                onChange={(e) => updateAddressField("city", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>State</Label>

              <Input
                placeholder="Delhi"
                value={form.address.state}
                onChange={(e) => updateAddressField("state", e.target.value)}
              />
            </div>
          </div>

          {/* COUNTRY + PINCODE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Country</Label>

              <Input
                placeholder="India"
                value={form.address.country}
                onChange={(e) => updateAddressField("country", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Pincode</Label>

              <Input
                placeholder="110001"
                value={form.address.pincode}
                onChange={(e) => updateAddressField("pincode", e.target.value)}
              />
            </div>
          </div>

          {/* LATITUDE + LONGITUDE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Latitude</Label>

              <Input
                type="number"
                placeholder="28.6139"
                value={form.address.latitude}
                onChange={(e) => updateAddressField("latitude", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Longitude</Label>

              <Input
                type="number"
                placeholder="77.2090"
                value={form.address.longitude}
                onChange={(e) =>
                  updateAddressField("longitude", e.target.value)
                }
              />
            </div>
            {/* GOOGLE MAP LINK */}
            <div className="space-y-2">
              <Label>Google Map Link</Label>

              <Input
                placeholder="https://maps.google.com/..."
                value={form.address.google_map_link}
                onChange={(e) =>
                  updateAddressField("google_map_link", e.target.value)
                }
              />
            </div>
          </div>

          {/* OWNERSHIP */}
          <div className="space-y-2">
            <Label>Ownership Status</Label>

            <Select
              value={form.ownership_status}
              onValueChange={(value) =>
                setForm({
                  ...form,

                  ownership_status: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Owned">Owned</SelectItem>

                <SelectItem value="Rented">Rented</SelectItem>

                <SelectItem value="Under Process">Under Process</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CHECKBOXES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <Label>Access Available</Label>

                <p className="text-xs text-muted-foreground">
                  Site access availability
                </p>
              </div>

              <input
                type="checkbox"
                checked={form.access_available}
                onChange={(e) =>
                  setForm({
                    ...form,

                    access_available: e.target.checked,
                  })
                }
                className="h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <Label>Existing Structure</Label>

                <p className="text-xs text-muted-foreground">
                  Existing building on site
                </p>
              </div>

              <input
                type="checkbox"
                checked={form.existing_structure}
                onChange={(e) =>
                  setForm({
                    ...form,

                    existing_structure: e.target.checked,
                  })
                }
                className="h-4 w-4"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Site"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
