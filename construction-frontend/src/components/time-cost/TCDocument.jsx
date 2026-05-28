"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Edit3, Download } from "lucide-react";
import { toast } from "sonner";

export default function TCDocument({ item, onBack, onEdit }) {
  const handleDownload = () => {
    if (item.document_url) {
      window.open(item.document_url, "_blank");
    } else {
      toast.info("Document not generated yet");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b bg-white">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-black"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onEdit}>
              <Edit3 className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#ef7f1b] to-orange-600 p-10 text-white">
              <h1 className="text-4xl font-bold">Cost Estimate</h1>
              <p className="mt-3 text-lg opacity-90">{item.estimate_type}</p>
            </div>

            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-gray-500">Consultation Fee</p>
                  <p className="text-3xl font-bold">
                    ₹
                    {Number(item.consultation_fee || 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tentative Total Cost</p>
                  <p className="text-3xl font-bold text-[#ef7f1b]">
                    ₹
                    {Number(item.tentative_total_cost || 0).toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">
                  Material & Labour Breakdown
                </h3>
                <pre className="bg-gray-50 p-6 rounded-xl text-sm overflow-auto">
                  {JSON.stringify(item.material_labour_estimate || {}, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">Payment Plan</h3>
                <pre className="bg-gray-50 p-6 rounded-xl text-sm overflow-auto">
                  {JSON.stringify(item.payment_plan || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
