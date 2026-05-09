"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Loader2, FolderPlus, Upload, Briefcase } from "lucide-react";

const inventoryFields = [
  { key: "date_added", label: "Date Added" },
  { key: "item_name", label: "Item Name" },
  { key: "quantity", label: "Quantity" },
  { key: "in", label: "In" },
  { key: "out", label: "Out" },
  { key: "receiver_name", label: "Receiver Name" },
  { key: "vendorId", label: "Vendor ID" },
  { key: "remarks", label: "Remarks" },
];

export default function NewProjectWithExcelDialog({
  open,
  onOpenChange,
  onCreate,
  saving = false,
}) {
  const [name, setName] = useState("");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [mapping, setMapping] = useState({});
  const [fileName, setFileName] = useState("");

  const resetForm = () => {
    setName("");
    setRows([]);
    setColumns([]);
    setMapping({});
    setFileName("");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    setRows(json);

    if (json.length > 0) {
      const cols = Object.keys(json[0]);
      setColumns(cols);

      // Auto-mapping
      const autoMap = {};
      inventoryFields.forEach((field) => {
        const found = cols.find(
          (c) =>
            c.toLowerCase().replace(/\s+/g, "") === field.key.toLowerCase(),
        );
        if (found) autoMap[field.key] = found;
      });
      setMapping(autoMap);
    }
  };

  const handleMappingChange = (field, column) => {
    setMapping((prev) => ({ ...prev, [field]: column }));
  };

  const formatExcelDate = (value) => {
    if (!value) return "";

    if (!isNaN(Number(value))) {
      const excelEpoch = new Date(1900, 0, 1);
      excelEpoch.setDate(excelEpoch.getDate() + Number(value) - 2);
      const day = String(excelEpoch.getDate()).padStart(2, "0");
      const month = String(excelEpoch.getMonth() + 1).padStart(2, "0");
      return `${day}/${month}/${excelEpoch.getFullYear()}`;
    }

    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${day}/${month}/${date.getFullYear()}`;
    }

    return String(value);
  };

  const transformRows = () => {
    return rows.map((row) => {
      const obj = {};
      inventoryFields.forEach((field) => {
        const col = mapping[field.key];
        let value = col ? row[col] : null;

        if (field.key === "date_added" && value) {
          value = formatExcelDate(value);
        }

        obj[field.key] = value;
      });
      return obj;
    });
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Project name is required");
      return;
    }
    if (rows.length === 0) {
      alert("Please upload an Excel file");
      return;
    }

    try {
      const inventory = transformRows();
      await onCreate({ name: name.trim(), inventory });
      resetForm();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-hidden rounded-[28px] border border-border bg-white p-0 shadow-2xl flex flex-col">
        {/* Top Accent */}
        <div className="h-1.5 w-full bg-[#ef7f1b]" />

        {/* Header */}
        <DialogHeader className="border-b border-border px-8 py-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#ef7f1b]/20 bg-[#fff4eb] text-[#ef7f1b]">
              <FolderPlus className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black tracking-tight">
                Create Project with Inventory
              </DialogTitle>
              <DialogDescription>
                Upload an Excel file and map columns to create a new project.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-8 space-y-8">
          {/* Project Name */}
          <div className="space-y-2">
            <Label className="text-xs font-bold tracking-wide text-foreground">
              Project Name *
            </Label>
            <div className="relative">
              <Briefcase className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                className="h-12 rounded-2xl pl-10 border-border focus-visible:border-[#ef7f1b] focus-visible:ring-[#ef7f1b]/15"
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label className="text-xs font-bold tracking-wide text-foreground">
              Upload Inventory Excel
            </Label>
            <label className="block">
              <div className="border-2 border-dashed border-border hover:border-[#ef7f1b]/50 rounded-3xl p-8 text-center cursor-pointer transition-colors">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="font-medium">
                  {fileName || "Click to select Excel file"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  .xlsx or .xls files only
                </p>
              </div>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Column Mapping */}
          {columns.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Column Mapping</h3>
              <div className="space-y-4">
                {inventoryFields.map((field) => (
                  <div key={field.key} className="flex items-center gap-4">
                    <div className="w-52 font-medium text-sm">
                      {field.label}
                    </div>
                    <Select
                      value={mapping[field.key] || ""}
                      onValueChange={(val) =>
                        handleMappingChange(field.key, val)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select column..." />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map((col) => (
                          <SelectItem key={col} value={col}>
                            {col}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Preview */}
          {rows.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">
                Preview ({rows.length} rows)
              </h3>
              <div className="border rounded-2xl overflow-hidden max-h-[380px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.slice(0, 8).map((col) => (
                        <TableHead key={col} className="whitespace-nowrap">
                          {col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.slice(0, 15).map((row, i) => (
                      <TableRow key={i}>
                        {columns.slice(0, 8).map((col) => (
                          <TableCell key={col} className="text-sm">
                            {col === mapping.date_added && row[col]
                              ? formatExcelDate(row[col])
                              : String(row[col] ?? "")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {rows.length > 15 && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Showing first 15 rows of {rows.length}
                </p>
              )}
            </Card>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="border-t border-border px-8 py-6 bg-white">
          <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              className="h-11 rounded-xl"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={saving || !name.trim() || rows.length === 0}
              className="h-11 rounded-xl bg-[#ef7f1b] hover:bg-[#d66e15] text-white shadow-lg shadow-[#ef7f1b]/20 px-8"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Project...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
