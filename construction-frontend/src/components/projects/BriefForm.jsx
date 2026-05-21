"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ArrowLeft,
  Save,
  FileText,
  Send,
  ChevronDown,
  ChevronRight,
  Check,
  CalendarIcon,
} from "lucide-react";

import { toast } from "sonner";
import SectionFields from "./SectionFields";

import {
  useCreateBriefMutation,
  useUpdateBriefMutation,
  useSendBriefMutation,
  useGetProjectByIdQuery,
  useGetProjectsQuery,
  useGetClientsQuery,
} from "@/api/projectsApi";
import { format } from "date-fns";

/* ---------------- SECTIONS (unchanged) ---------------- */
const SECTIONS = [
  /* ... your existing SECTIONS ... */
];

const READONLY_FIELDS = [
  "client_name",
  "client_contact",
  "client_requirements",
];

/* ---------------- DATE PICKER (unchanged) ---------------- */
function DatePicker({ value, onChange, placeholder = "Select date" }) {
  const date = value ? new Date(value) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP")
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) =>
            onChange(selectedDate ? selectedDate.toISOString() : "")
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

/* ---------------- PLACEHOLDERS (unchanged) ---------------- */
const getPlaceholder = (key) => {
  /* ... your existing getPlaceholder ... */
};

/* ---------------- NORMALIZER ---------------- */
const normalizeProject = (project) => {
  if (!project) return {};
  return {
    project_name: project.name,
    project_type: project.project_type,
    site_location: project.site?.address || "",
    budget_range: project.budget_range,

    rooms_spaces_required: project.rooms_spaces_required || "",
    parking_required: project.parking_required || "",
    first_construction_project: project.first_construction_project || "",
    end_to_end_services: project.service_type || "",

    decision_readiness: project.current_stage,
    expected_start_date: project.expected_start_date || "",
    expected_completion: project.expected_completion || "",

    client_name: project.client?.name || "",
    client_contact: project.client?.contact_number || "",
    client_requirements: project.client?.requirements || "",

    output_client_profile: "",
    output_project_profile: "",
  };
};

const normalizeClient = (client) => ({
  client_name: client?.name || "",
  client_contact: client?.contact_number || client?.email || "",
  client_requirements: client?.requirements || "",
});

/* ---------------- MAIN COMPONENT ---------------- */
export default function BriefForm({ brief, onBack, onGenerated }) {
  const params = useParams();
  const urlProjectId = params?.id;

  const [form, setForm] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState(
    urlProjectId || "",
  );
  const [selectedClientId, setSelectedClientId] = useState("");

  const [openSections, setOpenSections] = useState({ project_info: true });

  // Queries
  const { data: projects = [], isLoading: projectsLoading } =
    useGetProjectsQuery();
  const { data: clients = [], isLoading: clientsLoading } =
    useGetClientsQuery();
  const { data: project } = useGetProjectByIdQuery(selectedProjectId, {
    skip: !selectedProjectId,
  });

  const [createBrief, { isLoading: creating }] = useCreateBriefMutation();
  const [updateBrief, { isLoading: updating }] = useUpdateBriefMutation();
  const [sendBrief, { isLoading: sending }] = useSendBriefMutation();

  const autoSaveTimer = useRef(null);
  const isNewBrief = !brief?.id;

  /* ---------------- SYNC DATA ---------------- */
  useEffect(() => {
    const normalizedProj = normalizeProject(project);
    const normalizedClient = normalizeClient(
      clients.find((c) => c.id === selectedClientId),
    );

    setForm((prev) => ({
      ...normalizedProj,
      ...normalizedClient,
      ...(brief || {}),
    }));
  }, [project, selectedClientId, clients, brief]);

  /* ---------------- FIELD UPDATE ---------------- */
  const updateField = (key, value) => {
    const newForm = { ...form, [key]: value };
    setForm(newForm);

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => handleAutoSave(newForm), 1200);
  };

  /* ---------------- API ACTIONS ---------------- */
  /* ---------------- PAYLOAD CLEANER ---------------- */
  const prepareBriefPayload = (formData, projectId) => {
    const payload = {
      project_id: projectId, // Must be snake_case
      rooms_spaces_required: formData.rooms_spaces_required || {},
      parking_required: formData.parking_required,
      first_construction_project: formData.first_construction_project,
      decision_readiness: formData.decision_readiness,
      end_to_end_services: formData.end_to_end_services,
      output_client_profile: formData.output_client_profile || {},
      output_project_profile: formData.output_project_profile || {},
      status: formData.status || "draft",
    };

    // Only add fields that are actually in your DTO / model
    if (formData.client_name) payload.client_name = formData.client_name;
    if (formData.client_contact)
      payload.client_contact = formData.client_contact;
    if (formData.client_requirements)
      payload.client_requirements = formData.client_requirements;

    // Add any other allowed fields from your form (e.g. project_type, timeline, etc.)

    return payload;
  };

  /* ---------------- AUTO SAVE ---------------- */
  const handleAutoSave = async (currentForm) => {
    if (!selectedProjectId) return;

    try {
      const payload = prepareBriefPayload(currentForm, selectedProjectId);

      if (isNewBrief) {
        await createBrief(payload).unwrap();
      } else {
        await updateBrief({
          briefId: brief?.id, // Important: use briefId for update, not projectId
          ...payload,
        }).unwrap();
      }
    } catch (err) {
      console.error("Auto-save failed:", err);
      // Optional: Don't show toast on every auto-save failure (too noisy)
      // toast.error("Auto-save failed");
    }
  };

  /* ---------------- MANUAL SAVE ---------------- */
  const handleManualSave = async () => {
    if (!selectedProjectId) {
      toast.error("Please select a project");
      return;
    }

    try {
      const payload = prepareBriefPayload(form, selectedProjectId);

      if (isNewBrief) {
        const result = await createBrief(payload).unwrap();
        toast.success("Brief created successfully");
        // Redirect or call onGenerated
        onGenerated?.(result);
      } else {
        await updateBrief({
          briefId: brief?.id,
          ...payload,
        }).unwrap();
        toast.success("Brief updated successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Save failed");
    }
  };
  const handleGenerate = async () => {
    /* similar to above */
  };
  const handleSendToClient = async () => {
    /* similar to above */
  };

  /* ---------------- UI HELPERS ---------------- */
  const toggleSection = (id) => {
    setOpenSections((p) => ({ ...p, [id]: !p[id] }));
  };

  const getSectionProgress = (section) => {
    const filled = section.fields.filter(
      (f) => form[f] !== undefined && String(form[f]).trim() !== "",
    ).length;
    return Math.round((filled / section.fields.length) * 100);
  };

  const totalProgress = Math.round(
    SECTIONS.reduce((acc, s) => acc + getSectionProgress(s), 0) /
      SECTIONS.length,
  );

  const isSaving = creating || updating;

  if (projectsLoading || clientsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-4 border-[#ef7f1b] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="p-4 border-b bg-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-black">
              {form.project_name || "New Brief"}
            </h1>
            <p className="text-xs text-gray-400">
              {isNewBrief ? "Creating New Brief" : "Editing Brief"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={handleManualSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-1" />
            {isNewBrief ? "Create Brief" : "Save"}
          </Button>

          <Button size="sm" onClick={handleGenerate} disabled={isSaving}>
            <FileText className="w-4 h-4 mr-1" />
            Generate
          </Button>

          <Button
            size="sm"
            onClick={handleSendToClient}
            className="bg-orange-500 hover:bg-orange-600"
            disabled={sending || isSaving || !selectedProjectId}
          >
            <Send className="w-4 h-4 mr-1" />
            Send to Client
          </Button>
        </div>
      </div>

      {/* PROJECT & CLIENT SELECTORS */}
      <div className="p-4 border-b bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Project</label>
          <Select
            value={selectedProjectId}
            onValueChange={setSelectedProjectId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((proj) => (
                <SelectItem key={proj.id} value={proj.id}>
                  {proj.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Client</label>
          <Select value={selectedClientId} onValueChange={setSelectedClientId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="p-3 flex items-center gap-3 border-b">
        <Progress value={totalProgress} className="flex-1 h-1.5" />
        <span className="text-xs font-medium whitespace-nowrap">
          {totalProgress}%
        </span>
      </div>

      {/* BODY */}
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isOpen = openSections[section.id];
            const prog = getSectionProgress(section);

            return (
              <Card key={section.id} className="overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
                >
                  <div className="flex gap-3 items-center">
                    {prog === 100 ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Icon className="w-5 h-5 text-orange-500" />
                    )}
                    <div>
                      <p className="font-semibold text-left">{section.title}</p>
                      <p className="text-xs text-gray-500">{prog}% completed</p>
                    </div>
                  </div>
                  {isOpen ? <ChevronDown /> : <ChevronRight />}
                </button>

                {isOpen && (
                  <div className="p-5 border-t">
                    <SectionFields
                      fields={section.fields}
                      form={form}
                      onChange={updateField}
                      readonlyFields={READONLY_FIELDS}
                      getPlaceholder={getPlaceholder}
                      DatePicker={DatePicker}
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
