"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Camera, X, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Adjust this according to your project setup
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "https://your-api.com";

export default function AddReportForm({ api, projectId, onSuccess }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    work_executed: "",
    manpower_count: "",
    materials_used: "",
    progress_notes: "",
    issues_faced: "",
    completion_pct: 0,
  });

  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const photoRef = useRef < HTMLInputElement > null;

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fd = new FormData();
      fd.append("file", file);

      const r = await api.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPhotos((p) => [...p, { url: r.data.url, name: file.name }]);
      toast.success("Photo uploaded");
    } catch (error) {
      toast.error("Upload failed");
      console.error(error);
    }

    // Reset input
    if (photoRef.current) photoRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!form.work_executed.trim()) {
      toast.error("Work executed is required");
      return;
    }

    setSaving(true);
    try {
      const r = await api.post("/execution/daily-reports", {
        ...form,
        project_id: projectId,
        site_photos: photos,
      });

      toast.success("Daily report submitted successfully");
      onSuccess(r.data);

      // Reset form after successful submission
      setForm({
        date: new Date().toISOString().split("T")[0],
        work_executed: "",
        manpower_count: "",
        materials_used: "",
        progress_notes: "",
        issues_faced: "",
        completion_pct: 0,
      });
      setPhotos([]);
    } catch (error) {
      toast.error("Failed to submit report");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto">
      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Date
        </Label>
        <Input
          type="date"
          value={form.date}
          onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Work Executed *
        </Label>
        <Textarea
          value={form.work_executed}
          onChange={(e) =>
            setForm((p) => ({ ...p, work_executed: e.target.value }))
          }
          className="mt-1"
          rows={3}
          placeholder="Describe the work done today..."
          data-testid="report-work-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Manpower Count
          </Label>
          <Input
            type="number"
            value={form.manpower_count}
            onChange={(e) =>
              setForm((p) => ({ ...p, manpower_count: e.target.value }))
            }
            className="mt-1"
            placeholder="Number of workers"
          />
        </div>

        <div>
          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Completion %
          </Label>
          <Input
            type="number"
            value={form.completion_pct}
            onChange={(e) =>
              setForm((p) => ({ ...p, completion_pct: Number(e.target.value) }))
            }
            className="mt-1"
            min={0}
            max={100}
          />
        </div>
      </div>

      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Materials Used
        </Label>
        <Textarea
          value={form.materials_used}
          onChange={(e) =>
            setForm((p) => ({ ...p, materials_used: e.target.value }))
          }
          className="mt-1"
          rows={2}
          placeholder="List materials used..."
        />
      </div>

      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Issues Faced
        </Label>
        <Textarea
          value={form.issues_faced}
          onChange={(e) =>
            setForm((p) => ({ ...p, issues_faced: e.target.value }))
          }
          className="mt-1"
          rows={2}
          placeholder="Any challenges or issues encountered..."
        />
      </div>

      {/* Note: progress_notes field exists in form but not in UI. Add if needed. */}

      <div>
        <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Site Photos
        </Label>
        <div className="flex gap-2 mt-1 flex-wrap">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={`${BACKEND}${photo.url}`}
                alt={photo.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() =>
                  setPhotos((prev) => prev.filter((_, j) => j !== i))
                }
                className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/70 hover:bg-black rounded-full text-white flex items-center justify-center"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}

          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhoto}
          />

          <button
            onClick={() => photoRef.current?.click()}
            className="w-16 h-16 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center hover:border-[#ef7f1b] hover:bg-orange-50 transition-colors"
          >
            <Camera className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white"
          data-testid="report-submit"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <FileText className="w-4 h-4 mr-1" />
          )}
          Submit Report
        </Button>
      </div>
    </div>
  );
}
