"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  FileText,
  CalendarDays,
  User2,
  DollarSign,
  Layers,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

import { toast } from "sonner";

import {
  useUpdateCostEstimateMutation,
  useDeleteCostEstimateMutation,
} from "@/api/projects/costEstimatesApi";

export default function CostEstimateDetail({ costEstimate, onBack }) {
  const router = useRouter();

  const [updateCostEstimate] = useUpdateCostEstimateMutation();
  const [deleteCostEstimate] = useDeleteCostEstimateMutation();

  const [data, setData] = useState(costEstimate);
  const [notes, setNotes] = useState(costEstimate?.notes || "");

  /* =========================
     UPDATE
  ========================= */
  const handleUpdate = async () => {
    try {
      const res = await updateCostEstimate({
        estimateId: data.id,
        notes,
      }).unwrap();

      setData((prev) => ({ ...prev, ...res }));
      toast.success("Updated successfully");
    } catch {
      toast.error("Update failed");
    }
  };

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async () => {
    try {
      await deleteCostEstimate(data.id).unwrap();
      toast.success("Deleted successfully");
      router.back();
    } catch {
      toast.error("Delete failed");
    }
  };

  const materials = data.material_labour_estimate || [];
  const payments = data.payment_plan || [];

  const materialTotal = materials.reduce(
    (sum, i) => sum + Number(i.price || 0),
    0,
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-lg border flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="font-bold text-lg">
              Cost Estimate #{data.id.slice(0, 6)}
            </h1>

            <p className="text-xs text-gray-500">
              {data.estimate_type} Estimate
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleUpdate}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Save
          </Button>

          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">
          {/* MATERIAL + LABOUR */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h2 className="font-semibold">Material & Labour</h2>
            </div>

            <div className="space-y-3">
              {materials.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b pb-2 text-sm"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <span className="font-semibold">₹ {item.price}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4 font-bold">
              <span>Material Total</span>
              <span>₹ {materialTotal}</span>
            </div>
          </Card>

          {/* PAYMENT PLAN */}
          <Card className="p-4">
            <h2 className="font-semibold mb-3">Payment Plan</h2>

            <div className="space-y-3">
              {payments.map((p, i) => (
                <div key={i} className="border-b pb-2">
                  <div className="flex justify-between text-sm">
                    <p className="font-medium">{p.title || "Stage"}</p>
                    <p className="font-semibold">₹ {p.amount || 0}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {p.description || "No description"}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* NOTES */}
          <Card className="p-4">
            <h2 className="font-semibold mb-2">Notes</h2>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes..."
            />
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <Card className="p-4">
            <p className="text-xs text-gray-500">Project</p>
            <p className="font-medium">{data.project?.name}</p>
          </Card>

          <Card className="p-4">
            <p className="text-xs text-gray-500">Consultation Fee</p>
            <p className="font-bold">₹ {data.consultation_fee}</p>
          </Card>

          <Card className="p-4">
            <p className="text-xs text-gray-500">Total Estimate</p>
            <p className="font-bold text-lg">₹ {data.tentative_total_cost}</p>
          </Card>

          <Card className="p-4">
            <p className="text-xs text-gray-500">Estimate Type</p>
            <Badge>{data.estimate_type}</Badge>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays className="w-4 h-4" />
              <span className="text-sm">Created</span>
            </div>
            <p className="text-sm">
              {new Date(data.created_at).toLocaleDateString("en-IN")}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
