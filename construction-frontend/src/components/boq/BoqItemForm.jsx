"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BoqItemForm({ item, onSave, onCancel }) {
  const isNewItem = !item;

  const [form, setForm] = useState({
    id: item?.id || null,
    item_name: item?.item_name || "",
    item_code: item?.item_code || "",
    description: item?.description || "",
    specification: item?.specification || "",
    brand: item?.brand || "",
    qty: item?.qty || 0,
    unit_id: item?.unit_id || "", // Added
    rate: item?.rate || 0,
    wastage_percent: item?.wastage_percent || 0,
    discount_percent: item?.discount_percent || 0,
    tax_percent: item?.tax_percent || 18,
    remarks: item?.remarks || "",
  });

  // Reset form when item changes (important for switching between items)
  useEffect(() => {
    setForm({
      id: item?.id || null,
      item_name: item?.item_name || "",
      item_code: item?.item_code || "",
      description: item?.description || "",
      specification: item?.specification || "",
      brand: item?.brand || "",
      qty: item?.qty || 0,
      unit_id: item?.unit_id || "",
      rate: item?.rate || 0,
      wastage_percent: item?.wastage_percent || 0,
      discount_percent: item?.discount_percent || 0,
      tax_percent: item?.tax_percent || 18,
      remarks: item?.remarks || "",
    });
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.item_name?.trim()) {
      alert("Item Name is required");
      return;
    }
    if (form.qty <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }
    if (form.rate <= 0) {
      alert("Rate must be greater than 0");
      return;
    }

    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-lg font-semibold">
        {isNewItem ? "Add New Item" : "Edit Item"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label>Item Name *</Label>
          <Input
            value={form.item_name}
            onChange={(e) => setForm({ ...form, item_name: e.target.value })}
            placeholder="e.g. 600x600 False Ceiling Tiles"
            required
          />
        </div>

        <div>
          <Label>Item Code</Label>
          <Input
            value={form.item_code}
            onChange={(e) => setForm({ ...form, item_code: e.target.value })}
            placeholder="ITEM-001"
          />
        </div>

        <div>
          <Label>Brand</Label>
          <Input
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />
        </div>

        <div>
          <Label>Quantity *</Label>
          <Input
            type="number"
            step="0.001"
            value={form.qty}
            onChange={(e) =>
              setForm({ ...form, qty: parseFloat(e.target.value) || 0 })
            }
            required
          />
        </div>

        <div>
          <Label>Unit</Label>
          <Select
            value={form.unit_id}
            onValueChange={(value) => setForm({ ...form, unit_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sqft">Sq Ft</SelectItem>
              <SelectItem value="sqm">Sq M</SelectItem>
              <SelectItem value="nos">Nos</SelectItem>
              <SelectItem value="kg">Kg</SelectItem>
              <SelectItem value="m">Meter</SelectItem>
              {/* Add more units as needed */}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Rate (₹) *</Label>
          <Input
            type="number"
            step="0.01"
            value={form.rate}
            onChange={(e) =>
              setForm({ ...form, rate: parseFloat(e.target.value) || 0 })
            }
            required
          />
        </div>

        <div>
          <Label>Wastage (%)</Label>
          <Input
            type="number"
            step="0.01"
            value={form.wastage_percent}
            onChange={(e) =>
              setForm({
                ...form,
                wastage_percent: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>

        <div>
          <Label>Discount (%)</Label>
          <Input
            type="number"
            step="0.01"
            value={form.discount_percent}
            onChange={(e) =>
              setForm({
                ...form,
                discount_percent: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>

        <div>
          <Label>Tax (%)</Label>
          <Input
            type="number"
            step="0.01"
            value={form.tax_percent}
            onChange={(e) =>
              setForm({ ...form, tax_percent: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
      </div>

      <div>
        <Label>Specification</Label>
        <Textarea
          value={form.specification}
          onChange={(e) => setForm({ ...form, specification: e.target.value })}
          rows={2}
          placeholder="Technical specifications..."
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label>Remarks / Notes</Label>
        <Textarea
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          rows={2}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isNewItem ? "Add Item" : "Update Item"}</Button>
      </div>
    </form>
  );
}
