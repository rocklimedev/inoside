"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
import { format } from "date-fns";

import SectionFields from "@/components/projects/SectionFields";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import ClientForm from "@/components/client/ClientForm";

import {
  useCreateBriefMutation,
  useUpdateBriefMutation,
  useSendBriefMutation,
  useGetProjectByIdQuery,
  useGetProjectsQuery,
  useGetBriefByIdQuery,
} from "@/api/projectsApi";

import { useGetClientsQuery, useCreateClientMutation } from "@/api/clientsApi";

/* =================================================
   SECTIONS
================================================= */

const SECTIONS = [
  {
    id: "project_info",
    title: "Project Information",
    icon: FileText,
    fields: ["project_name", "project_type", "site_location", "budget_range"],
  },
  {
    id: "client_info",
    title: "Client Profile",
    icon: FileText,
    fields: ["client_name", "client_contact", "client_requirements"],
  },
  {
    id: "requirements",
    title: "Spaces & Requirements",
    icon: FileText,
    fields: [
      "rooms_spaces_required",
      "parking_required",
      "first_construction_project",
      "end_to_end_services",
    ],
  },
  {
    id: "decision",
    title: "Decision & Timeline",
    icon: FileText,
    fields: [
      "decision_readiness",
      "expected_start_date",
      "expected_completion",
    ],
  },
];

const READONLY_FIELDS = [
  "client_name",
  "client_contact",
  "client_requirements",
];

/* =================================================
   DATE PICKER
================================================= */

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

/* =================================================
   PLACEHOLDERS
================================================= */

const getPlaceholder = (key) => {
  const map = {
    project_name: "Select Project",
    project_type: "Residential / Commercial / Office",
    site_location: "e.g. South Delhi, India",
    budget_range: "e.g. ₹50L – ₹1Cr",

    client_name: "Select Client",
    client_contact: "Phone or email",
    client_requirements: "What the client is looking for",

    rooms_spaces_required: "e.g. 2BHK, office cabins, lobby",
    parking_required: "Yes / No",
    first_construction_project: "Yes / No",
    end_to_end_services: "Design + Build / Only Design",

    decision_readiness: "Ready / Planning / Exploring",
    expected_start_date: "Planned start date",
    expected_completion: "Expected completion date",
  };

  return map[key] || "Enter value...";
};

/* =================================================
   NORMALIZERS
================================================= */

const normalizeProject = (project) => {
  if (!project) return {};

  return {
    project_name: project?.name || "",
    project_type: project?.project_type || "",
    site_location: project?.site?.address || "",
    budget_range: project?.budget_range || "",

    client_name: project?.client?.name || "",
    client_contact: project?.client?.contact_number || "",
    client_requirements: project?.client?.requirements || "",
  };
};

const normalizeClient = (client) => ({
  client_name: client?.name || "",
  client_contact: client?.contact_number || client?.email || "",
  client_requirements: client?.requirements || "",
});

const normalizeBrief = (brief) => {
  if (!brief) return {};

  return {
    id: brief.id,
    project_id: brief.project_id,

    rooms_spaces_required: brief.rooms_spaces_required || "",

    parking_required:
      brief.parking_required === true
        ? "Yes"
        : brief.parking_required === false
          ? "No"
          : "",

    first_construction_project:
      brief.first_construction_project === true
        ? "Yes"
        : brief.first_construction_project === false
          ? "No"
          : "",

    end_to_end_services:
      brief.end_to_end_services === true
        ? "Yes"
        : brief.end_to_end_services === false
          ? "No"
          : "",

    decision_readiness: brief.decision_readiness || "",
    expected_start_date: brief.expected_start_date || "",
    expected_completion: brief.expected_completion || "",

    output_client_profile: brief.output_client_profile || "",
    output_project_profile: brief.output_project_profile || "",

    project_name: brief?.project?.name || "",
    project_type: brief?.project?.project_type || "",
    site_location: brief?.project?.site?.address || "",
    budget_range: brief?.project?.budget_range || "",

    client_name: brief?.project?.client?.name || "",
    client_contact:
      brief?.project?.client?.contact_number ||
      brief?.project?.client?.email ||
      "",
    client_requirements: brief?.project?.client?.requirements || "",
  };
};

/* =================================================
   MAIN COMPONENT
================================================= */

export default function BriefForm({ onBack, onGenerated }) {
  const params = useParams();
  const searchParams = useSearchParams();

  const urlProjectId = params?.id;

  // ✅ /brief/add?briefId=xxxx
  const briefId = searchParams.get("briefId");

  const [form, setForm] = useState({});

  const [selectedProjectId, setSelectedProjectId] = useState(
    urlProjectId || "",
  );

  const [selectedClientId, setSelectedClientId] = useState("");

  const [openSections, setOpenSections] = useState({
    project_info: true,
  });

  const [showProjectModal, setShowProjectModal] = useState(false);

  const [showClientModal, setShowClientModal] = useState(false);

  const autoSaveTimer = useRef(null);

  /* =================================================
     API
  ================================================= */

  const { data: allProjects = [] } = useGetProjectsQuery();

  const { data: clients = [] } = useGetClientsQuery();

  // ✅ FETCH BRIEF BY ID
  const { data: briefData, isLoading: briefLoading } = useGetBriefByIdQuery(
    briefId,
    {
      skip: !briefId,
    },
  );

  // ✅ SET PROJECT ID FROM BRIEF
  useEffect(() => {
    if (briefData?.project_id) {
      setSelectedProjectId(briefData.project_id);
    }

    if (briefData?.project?.client?.id) {
      setSelectedClientId(briefData.project.client.id);
    }
  }, [briefData]);

  const { data: project } = useGetProjectByIdQuery(selectedProjectId, {
    skip: !selectedProjectId,
  });

  const [createBrief, { isLoading: creating }] = useCreateBriefMutation();

  const [updateBrief, { isLoading: updating }] = useUpdateBriefMutation();

  const [sendBrief, { isLoading: sending }] = useSendBriefMutation();

  const [createClientMutation] = useCreateClientMutation();

  /* =================================================
     MODE
  ================================================= */

  const isNewBrief = !briefId;

  /* =================================================
     FILTERED PROJECTS
  ================================================= */

  const filteredProjects = selectedClientId
    ? allProjects.filter((p) => p.client?.id === selectedClientId)
    : allProjects;

  /* =================================================
     SYNC FORM
  ================================================= */

  useEffect(() => {
    // ✅ EDIT MODE
    if (briefData) {
      const normalized = normalizeBrief(briefData);

      setForm((prev) => {
        const prevStr = JSON.stringify(prev);
        const nextStr = JSON.stringify(normalized);

        if (prevStr === nextStr) return prev;

        return normalized;
      });

      return;
    }

    // ✅ CREATE MODE
    const normalizedProj = normalizeProject(project);

    const selectedClient = clients.find((c) => c.id === selectedClientId);

    const normalizedClient = normalizeClient(selectedClient);

    const nextForm = {
      ...normalizedProj,
      ...normalizedClient,
    };

    setForm((prev) => {
      const prevStr = JSON.stringify(prev);
      const nextStr = JSON.stringify(nextForm);

      if (prevStr === nextStr) return prev;

      return nextForm;
    });
  }, [briefData, project, selectedClientId, clients]);

  /* =================================================
     FIELD UPDATE
  ================================================= */

  const updateField = (key, value) => {
    const updatedForm = {
      ...form,
      [key]: value,
    };

    setForm(updatedForm);

    // PROJECT SELECT
    if (key === "project_name") {
      const proj = allProjects.find((p) => p.name === value);

      if (proj) {
        setSelectedProjectId(proj.id);

        if (proj.client?.id) {
          setSelectedClientId(proj.client.id);
        }
      }
    }

    // CLIENT SELECT
    if (key === "client_name") {
      const client = clients.find((c) => c.name === value);

      if (client) {
        setSelectedClientId(client.id);

        const clientProjects = allProjects.filter(
          (p) => p.client?.id === client.id,
        );

        if (clientProjects.length > 0 && !selectedProjectId) {
          setSelectedProjectId(clientProjects[0].id);
        }
      }
    }

    // AUTO SAVE
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(() => {
      handleAutoSave(updatedForm);
    }, 1200);
  };

  /* =================================================
     PAYLOAD
  ================================================= */

  const buildPayload = (data) => ({
    rooms_spaces_required: data.rooms_spaces_required || "",

    parking_required:
      data.parking_required === "Yes" || data.parking_required === true,

    first_construction_project:
      data.first_construction_project === "Yes" ||
      data.first_construction_project === true,

    end_to_end_services:
      data.end_to_end_services === "Yes" || data.end_to_end_services === true,

    decision_readiness: data.decision_readiness || "",

    expected_start_date: data.expected_start_date || null,

    expected_completion: data.expected_completion || null,

    output_client_profile: data.output_client_profile || "",

    output_project_profile: data.output_project_profile || "",
  });

  /* =================================================
     AUTO SAVE
  ================================================= */

  const handleAutoSave = async (data) => {
    if (!selectedProjectId) return;

    try {
      const payload = buildPayload(data);

      if (isNewBrief) {
        await createBrief({
          projectId: selectedProjectId,
          ...payload,
        }).unwrap();
      } else {
        await updateBrief({
          projectId: selectedProjectId,
          ...payload,
        }).unwrap();
      }
    } catch (err) {
      console.error("Auto-save failed:", err);
    }
  };

  /* =================================================
     SAVE
  ================================================= */

  const handleManualSave = async () => {
    if (!selectedProjectId) {
      return toast.error("Please select a project");
    }

    try {
      const payload = buildPayload(form);

      if (isNewBrief) {
        await createBrief({
          projectId: selectedProjectId,
          ...payload,
        }).unwrap();

        toast.success("Brief created successfully");
      } else {
        await updateBrief({
          projectId: selectedProjectId,
          ...payload,
        }).unwrap();

        toast.success("Brief updated successfully");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Save failed");
    }
  };

  /* =================================================
     GENERATE
  ================================================= */

  const handleGenerate = async () => {
    try {
      await handleManualSave();

      toast.success("Document generated");

      onGenerated?.();
    } catch (err) {
      toast.error("Generation failed");
    }
  };

  /* =================================================
     SEND
  ================================================= */

  const handleSendToClient = async () => {
    try {
      if (!briefId) {
        return toast.error("Please save brief first");
      }

      await sendBrief(briefId).unwrap();

      toast.success("Sent to client");

      onGenerated?.();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send");
    }
  };

  /* =================================================
     TOGGLE SECTION
  ================================================= */

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* =================================================
     PROGRESS
  ================================================= */

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

  const defaultClientValues = {
    name: "",
    contact_number: "",
    email: "",
    preferred_communication: "",
    is_owner: false,
    representative_involved: false,
    representative_comment: "",
    location: "",
    budget_comfort: "",
    design_style: "",
    material_preference: "",
    special_requirements: "",
  };

  const [clientFormData, setClientFormData] = useState(defaultClientValues);

  /* =================================================
     LOADING
  ================================================= */

  if (briefLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        Loading brief...
      </div>
    );
  }

  /* =================================================
     UI
  ================================================= */

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
              {form.project_name || "New Project Brief"}
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
            disabled={sending || isSaving || !briefId}
          >
            <Send className="w-4 h-4 mr-1" />
            Send to Client
          </Button>
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
          {SECTIONS.map((section) => (
            <Card key={section.id} className="overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex gap-3 items-center">
                  {getSectionProgress(section) === 100 ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <section.icon className="w-5 h-5 text-orange-500" />
                  )}

                  <div>
                    <p className="font-semibold text-left">{section.title}</p>

                    <p className="text-xs text-gray-500">
                      {getSectionProgress(section)}% completed
                    </p>
                  </div>
                </div>

                {openSections[section.id] ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>

              {openSections[section.id] && (
                <div className="p-5 border-t">
                  <SectionFields
                    fields={section.fields}
                    form={form}
                    onChange={updateField}
                    readonlyFields={READONLY_FIELDS}
                    getPlaceholder={getPlaceholder}
                    DatePicker={DatePicker}
                    projects={filteredProjects}
                    clients={clients}
                    onAddProject={() => setShowProjectModal(true)}
                    onAddClient={() => setShowClientModal(true)}
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* PROJECT MODAL */}
      <CreateProjectModal
        open={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onProjectCreated={(newId) => {
          setSelectedProjectId(newId);

          toast.success("Project created successfully!");
        }}
      />

      {/* CLIENT MODAL */}
      <Dialog open={showClientModal} onOpenChange={setShowClientModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Client</DialogTitle>
          </DialogHeader>

          <ClientForm
            initialValues={clientFormData}
            onSubmit={async (data) => {
              try {
                const res = await createClientMutation(data).unwrap();

                setSelectedClientId(res.id);

                setForm((prev) => ({
                  ...prev,
                  client_name: res.name,
                  client_contact: res.contact_number || res.email || "",
                  client_requirements: res.special_requirements || "",
                }));

                toast.success("Client created successfully!");

                setShowClientModal(false);

                setClientFormData(defaultClientValues);
              } catch (err) {
                toast.error(err?.data?.message || "Failed to create client");
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
