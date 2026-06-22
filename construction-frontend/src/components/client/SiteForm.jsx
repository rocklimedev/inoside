"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Checkbox } from "@/components/ui/checkbox";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

const siteSchema = z.object({
  ownership_status: z.enum(["Owned", "Rented", "Under Process"]),
  access_available: z.boolean().default(true),
  existing_structure: z.boolean().default(false),

  // Address fields
  address_line1: z.string().min(5, "Address line 1 is required"),
  address_line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postal_code: z.string().min(4, "Postal code is required"),
  country: z.string().default("India"),
});

export default function SiteForm({
  initialValues,
  onSubmit,
  disabled = false,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm <
  SiteFormValues >
  {
    resolver: zodResolver(siteSchema),
    defaultValues: {
      ownership_status: "Owned",
      access_available: true,
      existing_structure: false,
      country: "India",
    },
  };

  // Populate form when editing
  useEffect(() => {
    if (initialValues) {
      setValue("ownership_status", initialValues.ownership_status || "Owned");
      setValue("access_available", initialValues.access_available ?? true);
      setValue("existing_structure", initialValues.existing_structure ?? false);

      // Address fields
      if (initialValues.address) {
        setValue("address_line1", initialValues.address.line1 || "");
        setValue("address_line2", initialValues.address.line2 || "");
        setValue("city", initialValues.address.city || "");
        setValue("state", initialValues.address.state || "");
        setValue("postal_code", initialValues.address.postal_code || "");
        setValue("country", initialValues.address.country || "India");
      }
    }
  }, [initialValues, setValue]);

  const onFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ownership_status: data.ownership_status,
        access_available: data.access_available,
        existing_structure: data.existing_structure,
        // Address object (will be handled in backend or via address API)
        address: {
          line1: data.address_line1,
          line2: data.address_line2,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country: data.country,
        },
      };

      await onSubmit(payload);
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {initialValues ? "Edit Site" : "Add New Site"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 py-4">
        {/* Ownership Status */}
        <div className="space-y-2">
          <Label>Ownership Status</Label>
          <Select
            onValueChange={(value) => setValue("ownership_status")}
            defaultValue={watch("ownership_status")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ownership status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Owned">Owned</SelectItem>
              <SelectItem value="Rented">Rented</SelectItem>
              <SelectItem value="Under Process">Under Process</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Address Information</h3>

          <div className="space-y-2">
            <Label>
              Address Line 1 <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("address_line1")}
              placeholder="House no, Street, Area"
            />
            {errors.address_line1 && (
              <p className="text-red-500 text-sm">
                {errors.address_line1.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Address Line 2 (Optional)</Label>
            <Input
              {...register("address_line2")}
              placeholder="Landmark, Floor, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                City <span className="text-red-500">*</span>
              </Label>
              <Input {...register("city")} />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                State <span className="text-red-500">*</span>
              </Label>
              <Input {...register("state")} />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Postal Code <span className="text-red-500">*</span>
              </Label>
              <Input {...register("postal_code")} />
              {errors.postal_code && (
                <p className="text-red-500 text-sm">
                  {errors.postal_code.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Country</Label>
              <Input {...register("country")} disabled />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox
              id="access_available"
              checked={watch("access_available")}
              onCheckedChange={(checked) =>
                setValue("access_available", !!checked)
              }
            />
            <Label htmlFor="access_available" className="cursor-pointer">
              Access Available
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="existing_structure"
              checked={watch("existing_structure")}
              onCheckedChange={(checked) =>
                setValue("existing_structure", !!checked)
              }
            />
            <Label htmlFor="existing_structure" className="cursor-pointer">
              Has Existing Structure
            </Label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()} // or close dialog via parent
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#ef7f1b] hover:bg-[#ef7f1b]/90"
            disabled={isSubmitting || disabled}
          >
            {isSubmitting
              ? "Saving..."
              : initialValues
                ? "Update Site"
                : "Create Site"}
          </Button>
        </div>
      </form>
    </>
  );
}
