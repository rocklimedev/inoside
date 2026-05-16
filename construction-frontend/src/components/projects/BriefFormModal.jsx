"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import BriefForm from "./BriefForm";

export default function BriefFormModal({
  open,
  onClose,
  projectId,
  brief,
  onGenerated,
  onSuccess,
}) {
  const handleBack = () => {
    onClose();
  };

  const handleGenerated = () => {
    onGenerated?.();
    onSuccess?.();
    // Optionally auto-close after success
    // onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full h-[95vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="border-b px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {brief?.id ? "Edit Project Brief" : "Create New Brief"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Brief Form Inside Modal */}
        <div className="flex-1 overflow-hidden">
          <BriefForm
            brief={brief}
            onBack={handleBack}
            onGenerated={handleGenerated}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
