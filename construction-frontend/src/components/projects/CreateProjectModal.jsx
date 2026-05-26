"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { useGetClientsQuery, useCreateClientMutation } from "@/api/clientsApi";

import { useGetSitesByClientQuery } from "@/api/sitesApi";

import { useCreateProjectMutation } from "@/api/projectsApi";

import { SiteFormModal } from "../sites/SiteFormModal";

import ClientForm from "../client/ClientForm";

export function CreateProjectModal({ open, onClose, onProjectCreated }) {
  // ======================================================
  // API
  // ======================================================

  const [createProject, { isLoading }] = useCreateProjectMutation();

  const [createClient, { isLoading: isCreatingClient }] =
    useCreateClientMutation();

  const { data: clients = [], refetch: refetchClients } = useGetClientsQuery();

  // ======================================================
  // FORM
  // ======================================================

  const [form, setForm] = useState({
    name: "",

    client_id: "",

    site_id: "",

    project_type: "Interior Fit-out",

    service_type: "Interior",

    purpose: "Residential",

    number_of_floors: "",

    approximate_area_sqft: "",

    budget_range: "",

    timeline_expectation: "",

    design_preference: "",

    current_stage: "",

    token_received: false,
  });

  // ======================================================
  // GET SITES BY CLIENT
  // ======================================================

  const {
    data: sites = [],
    refetch: refetchSites,
    isFetching: isFetchingSites,
  } = useGetSitesByClientQuery(form.client_id, {
    skip: !form.client_id,
  });

  // ======================================================
  // MODALS
  // ======================================================

  const [siteModalOpen, setSiteModalOpen] = useState(false);

  const [clientModalOpen, setClientModalOpen] = useState(false);

  // ======================================================
  // RESET
  // ======================================================

  const resetForm = () => {
    setForm({
      name: "",

      client_id: "",

      site_id: "",

      project_type: "Interior Fit-out",

      service_type: "Interior",

      purpose: "Residential",

      number_of_floors: "",

      approximate_area_sqft: "",

      budget_range: "",

      timeline_expectation: "",

      design_preference: "",

      current_stage: "",

      token_received: false,
    });
  };

  // ======================================================
  // CREATE PROJECT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return toast.error("Project name is required");
    }

    if (!form.client_id) {
      return toast.error("Please select a client");
    }

    try {
      const payload = {
        name: form.name,

        client_id: form.client_id,

        site_id: form.site_id || null,

        project_type: form.project_type,

        service_type: form.service_type || null,

        purpose: form.purpose || null,

        number_of_floors: form.number_of_floors
          ? Number(form.number_of_floors)
          : null,

        approximate_area_sqft: form.approximate_area_sqft
          ? Number(form.approximate_area_sqft)
          : null,

        budget_range: form.budget_range || null,

        timeline_expectation: form.timeline_expectation || null,

        design_preference: form.design_preference || null,

        current_stage: form.current_stage || null,

        token_received: form.token_received,
      };

      const result = await createProject(payload).unwrap();

      const newProjectId = result?.id || result?.data?.id;

      toast.success("Project created successfully");

      if (onProjectCreated) {
        onProjectCreated(newProjectId);
      }

      resetForm();

      onClose();
    } catch (error) {
      console.error(error);

      toast.error(error?.data?.message || "Failed to create project");
    }
  };

  return (
    <>
      {/* ====================================================== */}
      {/* PROJECT MODAL */}
      {/* ====================================================== */}

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          className="
            w-[95vw]
            sm:max-w-3xl
            max-h-[92vh]
            overflow-hidden
            flex
            flex-col
            rounded-3xl
            p-0
          "
        >
          {/* HEADER */}

          <DialogHeader className="border-b px-6 py-5 shrink-0">
            <DialogTitle className="text-xl font-bold">
              Create Project
            </DialogTitle>
          </DialogHeader>

          {/* BODY */}

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <form
              id="create-project-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* PROJECT NAME */}

              <div className="space-y-2">
                <Label>Project Name *</Label>

                <Input
                  placeholder="Luxury Villa - Phase 1"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="h-11 rounded-xl"
                />
              </div>

              {/* CLIENT */}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Client *</Label>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl"
                    onClick={() => setClientModalOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Select
                  value={form.client_id}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,

                      client_id: value,

                      // RESET SITE WHEN CLIENT CHANGES
                      site_id: "",
                    }))
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Select Client" />
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

              {/* SITE */}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Site</Label>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl"
                    disabled={!form.client_id}
                    onClick={() => setSiteModalOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Select
                  value={form.site_id}
                  disabled={!form.client_id}
                  onValueChange={(value) =>
                    setForm({
                      ...form,
                      site_id: value,
                    })
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue
                      placeholder={
                        !form.client_id
                          ? "Select client first"
                          : isFetchingSites
                            ? "Loading sites..."
                            : sites.length === 0
                              ? "No sites found"
                              : "Select Site"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.address?.city} -{" "}
                        {site.address?.line1?.slice(0, 40)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* TYPES */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* PROJECT TYPE */}

                <div className="space-y-2">
                  <Label>Project Type</Label>

                  <Select
                    value={form.project_type}
                    onValueChange={(value) =>
                      setForm({
                        ...form,
                        project_type: value,
                      })
                    }
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="New Construction">
                        New Construction
                      </SelectItem>

                      <SelectItem value="Renovation">Renovation</SelectItem>

                      <SelectItem value="Interior Fit-out">
                        Interior Fit-out
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* SERVICE TYPE */}

                <div className="space-y-2">
                  <Label>Service Type</Label>

                  <Select
                    value={form.service_type}
                    onValueChange={(value) =>
                      setForm({
                        ...form,
                        service_type: value,
                      })
                    }
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="Construction">Construction</SelectItem>

                      <SelectItem value="Interior">Interior</SelectItem>

                      <SelectItem value="Renovation">Renovation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* PURPOSE */}

                <div className="space-y-2">
                  <Label>Purpose</Label>

                  <Select
                    value={form.purpose}
                    onValueChange={(value) =>
                      setForm({
                        ...form,
                        purpose: value,
                      })
                    }
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>

                      <SelectItem value="Commercial">Commercial</SelectItem>

                      <SelectItem value="Mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* AREA */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Approx Area (sqft)</Label>

                  <Input
                    type="number"
                    value={form.approximate_area_sqft}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        approximate_area_sqft: e.target.value,
                      })
                    }
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Number of Floors</Label>

                  <Input
                    type="number"
                    value={form.number_of_floors}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        number_of_floors: e.target.value,
                      })
                    }
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              {/* BUDGET */}

              <div className="space-y-2">
                <Label>Budget Range</Label>

                <Input
                  placeholder="e.g. 50L - 80L"
                  value={form.budget_range}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      budget_range: e.target.value,
                    })
                  }
                  className="h-11 rounded-xl"
                />
              </div>

              {/* TIMELINE */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Timeline</Label>

                  <Input
                    type="date"
                    value={form.timeline_expectation}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        timeline_expectation: e.target.value,
                      })
                    }
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Design Preference</Label>

                  <Input
                    value={form.design_preference}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        design_preference: e.target.value,
                      })
                    }
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              {/* STAGE */}

              <div className="space-y-2">
                <Label>Current Stage</Label>

                <Input
                  value={form.current_stage}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      current_stage: e.target.value,
                    })
                  }
                  className="h-11 rounded-xl"
                />
              </div>

              {/* TOKEN */}

              <div
                className="
                  flex items-center justify-between
                  rounded-2xl
                  border
                  p-4
                "
              >
                <div>
                  <Label className="font-medium">Token Received</Label>

                  <p className="text-xs text-muted-foreground mt-1">
                    Advance payment status
                  </p>
                </div>

                <Switch
                  checked={form.token_received}
                  onCheckedChange={(checked) =>
                    setForm({
                      ...form,
                      token_received: checked,
                    })
                  }
                  className="
                    data-[state=checked]:bg-black
                    data-[state=unchecked]:bg-gray-300
                  "
                />
              </div>
            </form>
          </div>

          {/* FOOTER */}

          <DialogFooter className="border-t px-6 py-4 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="create-project-form"
              disabled={isLoading}
              className="
                rounded-xl
                bg-black
                hover:bg-black/90
              "
            >
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ====================================================== */}
      {/* CLIENT MODAL */}
      {/* ====================================================== */}

      <Dialog open={clientModalOpen} onOpenChange={setClientModalOpen}>
        <DialogContent
          className="
            w-[95vw]
            sm:max-w-2xl
            max-h-[92vh]
            overflow-y-auto
            rounded-3xl
          "
        >
          <DialogHeader>
            <DialogTitle>Create Client</DialogTitle>
          </DialogHeader>

          <ClientForm
            disabled={isCreatingClient}
            onSubmit={async (values) => {
              try {
                const client = await createClient(values).unwrap();

                toast.success("Client created successfully");

                await refetchClients();

                setForm((prev) => ({
                  ...prev,

                  client_id: client?.id || client?.data?.id,
                }));

                setClientModalOpen(false);
              } catch (err) {
                console.error(err);

                toast.error(err?.data?.message || "Failed to create client");
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* ====================================================== */}
      {/* SITE MODAL */}
      {/* ====================================================== */}

      <SiteFormModal
        open={siteModalOpen}
        clientId={form.client_id}
        onClose={() => setSiteModalOpen(false)}
        onCreated={async (site) => {
          await refetchSites();

          if (site?.id) {
            setForm((prev) => ({
              ...prev,

              site_id: site.id,
            }));
          }
        }}
      />
    </>
  );
}
