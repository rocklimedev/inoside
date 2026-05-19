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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function BoqItemForm({
  item,
  onSave,
  onCancel,
  inventoryItems = [],
  isLoadingInventory = false,
  searchTerm = "",
  onSearchChange,
}) {
  const isNewItem = !item?.id;

  const [form, setForm] = useState({
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

  const [openInventory, setOpenInventory] = useState(false);

  // Reset form when item changes
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

  const handleInventorySelect = (invItem) => {
    setForm({
      ...form,
      item_name: invItem.item_name || invItem.name || "",
      item_code: invItem.item_code || invItem.code || "",
      description: invItem.description || form.description,
      specification: invItem.specification || form.specification,

      // ✅ FIX HERE
      brand: invItem.brand?.name || "",

      rate: invItem.default_rate || invItem.rate || form.rate,
      unit_id: invItem.unit_id || form.unit_id,
    });

    setOpenInventory(false);
  };

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">
          {isNewItem ? "Add New Item" : "Edit Item"}
        </h3>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {/* ====================== INVENTORY SEARCH ====================== */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          Load from Inventory (Optional)
        </Label>
        <Popover open={openInventory} onOpenChange={setOpenInventory}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between h-11"
            >
              {form.item_name ? (
                <span className="truncate">{form.item_name}</span>
              ) : (
                "Search and select from inventory..."
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search inventory items..."
                value={searchTerm}
                onValueChange={onSearchChange}
              />
              <CommandList>
                {isLoadingInventory && (
                  <CommandEmpty>Loading inventory...</CommandEmpty>
                )}
                {!isLoadingInventory &&
                  inventoryItems.length === 0 &&
                  searchTerm.length > 1 && (
                    <CommandEmpty>No items found.</CommandEmpty>
                  )}
                <CommandGroup>
                  {inventoryItems.map((inv) => (
                    <CommandItem
                      key={inv.id}
                      value={inv.name || inv.item_name || ""}
                      onSelect={() => handleInventorySelect(inv)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          form.item_name === (inv.name || inv.item_name)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {inv.name || inv.item_name}
                        </span>
                        {inv.code || inv.item_code ? (
                          <span className="text-xs text-muted-foreground">
                            {inv.code || inv.item_code}
                          </span>
                        ) : null}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <p className="text-xs text-muted-foreground">
          You can still edit all fields after selecting from inventory
        </p>
      </div>

      {/* ====================== ITEM DETAILS ====================== */}
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
              <SelectItem value="ltr">Liter</SelectItem>
              <SelectItem value="ton">Ton</SelectItem>
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
          placeholder="Technical specifications, size, grade, etc."
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          placeholder="Detailed description..."
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

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#ef7f1b] hover:bg-[#d66e15]">
          {isNewItem ? "Add Item" : "Update Item"}
        </Button>
      </div>
    </form>
  );
}
