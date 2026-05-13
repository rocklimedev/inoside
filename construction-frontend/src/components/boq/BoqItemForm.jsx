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
  const [form, setForm] = useState({
    id: item?.id,
    item_name: item?.item_name || "",
    item_code: item?.item_code || "",
    description: item?.description || "",
    specification: item?.specification || "",
    brand: item?.brand || "",
    qty: item?.qty || 0,
    rate: item?.rate || 0,
    wastage_percent: item?.wastage_percent || 0,
    discount_percent: item?.discount_percent || 0,
    tax_percent: item?.tax_percent || 18,
    inventory_item_id: item?.inventory_item_id || "",
    unit_id: item?.unit_id || "",
    remarks: item?.remarks || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.item_name || form.qty <= 0 || form.rate <= 0) {
      alert("Please fill required fields");
      return;
    }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-lg font-semibold">Edit Item</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label>Item Name *</Label>
          <Input
            value={form.item_name}
            onChange={(e) => setForm({ ...form, item_name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>Item Code</Label>
          <Input
            value={form.item_code}
            onChange={(e) => setForm({ ...form, item_code: e.target.value })}
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
          <Label>Wastage %</Label>
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
          <Label>Discount %</Label>
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
          <Label>Tax %</Label>
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
        <Button type="submit">Save Item</Button>
      </div>
    </form>
  );
}
