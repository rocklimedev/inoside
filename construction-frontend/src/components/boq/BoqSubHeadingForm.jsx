"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function BoqSubHeadingForm({
  open,
  onClose,
  onSave,
  sectionTitle,
  initialData,
}) {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Subheading title is required");

    onSave(form);
    setForm({ title: "", description: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Subheading" : "Add Subheading"}
          </DialogTitle>
          {sectionTitle && (
            <p className="text-sm text-muted-foreground">
              Section: {sectionTitle}
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Subheading Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. False Ceiling, Wall Painting, Flooring"
              required
            />
          </div>

          <div>
            <Label>Description (Optional)</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Details about this subheading..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Update" : "Add Subheading"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
