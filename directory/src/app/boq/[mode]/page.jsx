"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Layers,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { createProject, getRates } from "@/lib/api";
import { computeProject } from "@/lib/calculations";
import { formatCompactINR, formatNumber } from "@/lib/format";
import {
  CITY_MULTIPLIER,
  FLOORING_OPTIONS,
  WALL_FINISH_OPTIONS,
  ROOM_TYPES,
  PROJECT_TEMPLATES,
  QUALITY_MULTIPLIER,
} from "@/lib/defaults";

const MODE_TITLES = {
  quick: "Quick Estimate",
  detailed: "Detailed BOQ",
  renovation: "Renovation Estimate",
  interior: "Interior Fit-Out",
};

const defaultProject = (mode) => ({
  name: "",
  client_name: "",
  project_type:
    mode === "interior"
      ? "commercial"
      : mode === "renovation"
        ? "renovation"
        : "residential",
  construction_type: "rcc",
  location: "Tier 2 / Other",
  location_multiplier: 0.92,
  mode,
  scope:
    mode === "renovation"
      ? "renovation"
      : mode === "interior"
        ? "interior_only"
        : "full",
  quality: "standard",
  currency: "INR",
  plot_area: 0,
  built_up_area: mode === "quick" ? 1000 : 0,
  carpet_area: 0,
  floors: 1,
  ceiling_height: 10,
  bedrooms: 0,
  bathrooms: 0,
  kitchens: 0,
  balconies: 0,
  living_rooms: 0,
  include_labor: true,
  include_gst: true,
  gst_percent: 18,
  contingency_percent: 5,
  wastage_percent: 7,
  contractor_markup_percent: 10,
  rooms: [],
  notes: "",
  status: "draft",
});

export default function EstimateForm() {
  const { mode = "detailed" } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [rates, setRates] = useState({});
  const [project, setProject] = useState(() => defaultProject(mode));

  // Fetch Rates
  useEffect(() => {
    getRates()
      .then((d) => setRates(d?.rates || {}))
      .catch(() => setRates({}));
  }, []);

  // Apply template from query param
  useEffect(() => {
    const tplId = searchParams.get("templateId");
    if (tplId) {
      const tpl = PROJECT_TEMPLATES.find((t) => t.id === tplId);
      if (tpl) {
        setProject((p) => ({ ...p, ...tpl.preset, mode: tpl.mode }));
        toast.success(`Template loaded: ${tpl.name}`);
      }
    }
  }, [searchParams]);

  const update = (patch) => setProject((p) => ({ ...p, ...patch }));

  const STEPS = useMemo(() => {
    if (mode === "quick") return ["Basics", "Area & Quality", "Review"];
    return [
      "Basics",
      "Dimensions",
      "Rooms & Finishes",
      "Rates & Settings",
      "Review",
    ];
  }, [mode]);

  const progress = ((step + 1) / STEPS.length) * 100;

  const preview = useMemo(() => {
    try {
      return computeProject(project, rates);
    } catch (e) {
      return null;
    }
  }, [project, rates]);

  const canContinue = () => {
    if (step === 0) return !!project.name.trim();
    if (mode === "quick" && step === 1)
      return Number(project.built_up_area) > 0;
    if (mode !== "quick" && step === 1)
      return Number(project.built_up_area) > 0;
    return true;
  };

  const handleNext = () => {
    if (!canContinue()) {
      toast.error("Please fill required fields");
      return;
    }
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleGenerate = async () => {
    if (!project.name.trim()) {
      toast.error("Name your project first");
      return;
    }
    setSaving(true);
    try {
      const boq = computeProject(project, rates);
      const payload = {
        ...project,
        boq_items: boq.items,
        status: "active",
      };
      const created = await createProject(payload);
      toast.success("BOQ generated successfully");
      router.push(`/projects/${created.id}`);
    } catch (e) {
      toast.error("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const addRoom = () =>
    update({
      rooms: [
        ...project.rooms,
        {
          id: crypto.randomUUID(),
          type: "Bedroom",
          length: 12,
          width: 10,
          height: project.ceiling_height || 10,
          flooring: "vitrified_tile",
          wall: "emulsion_paint",
          false_ceiling: false,
        },
      ],
    });

  const updateRoom = (idx, patch) => {
    const rooms = [...project.rooms];
    rooms[idx] = { ...rooms[idx], ...patch };
    update({ rooms });
  };

  const removeRoom = (idx) => {
    const rooms = project.rooms.filter((_, i) => i !== idx);
    update({ rooms });
  };

  const onCityChange = (city) => {
    update({ location: city, location_multiplier: CITY_MULTIPLIER[city] || 1 });
  };

  return (
    <div className="fade-up" data-testid={`estimate-form-${mode}`}>
      <PageHeader
        title={MODE_TITLES[mode] || "New Estimate"}
        subtitle="Fill project details step-by-step. You can always edit line items after generation."
        actions={
          <Button
            variant="outline"
            onClick={() => router.push("/projects/new")}
            data-testid="change-mode-btn"
          >
            Change Mode
          </Button>
        }
      />

      {/* Progress Bar */}
      <div className="mb-6 rounded-xl border border-border bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`flex items-center gap-1.5 ${i <= step ? "text-primary" : "text-slate-400"}`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${i <= step ? "bg-primary text-white" : "bg-slate-200"}`}
                >
                  {i + 1}
                </span>
                <span className="font-medium">{s}</span>
                {i < STEPS.length - 1 && (
                  <span className="text-slate-300">›</span>
                )}
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-500 tabular-nums">
            Step {step + 1}/{STEPS.length}
          </div>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <Card className="rounded-xl border-border p-6 lg:col-span-2">
          {step === 0 && (
            <StepBasics
              project={project}
              update={update}
              onCity={onCityChange}
            />
          )}
          {mode === "quick" && step === 1 && (
            <StepQuickArea project={project} update={update} />
          )}
          {mode === "quick" && step === 2 && (
            <StepReview project={project} preview={preview} />
          )}

          {mode !== "quick" && step === 1 && (
            <StepDimensions project={project} update={update} />
          )}
          {mode !== "quick" && step === 2 && (
            <StepRooms
              project={project}
              addRoom={addRoom}
              updateRoom={updateRoom}
              removeRoom={removeRoom}
            />
          )}
          {mode !== "quick" && step === 3 && (
            <StepSettings project={project} update={update} />
          )}
          {mode !== "quick" && step === 4 && (
            <StepReview project={project} preview={preview} />
          )}

          <Separator className="my-6" />

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
              data-testid="step-back-btn"
            >
              <ArrowLeft size={16} className="mr-1" /> Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button onClick={handleNext} data-testid="step-next-btn">
                Continue <ArrowRight size={16} className="ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={saving}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                data-testid="generate-boq-btn"
              >
                {saving ? "Generating…" : "Generate BOQ"}{" "}
                <Sparkles size={16} className="ml-1" />
              </Button>
            )}
          </div>
        </Card>

        {/* Live Preview Sidebar */}
        <Card
          className="sticky top-6 h-fit rounded-xl border-border bg-slate-50 p-6"
          data-testid="live-preview"
        >
          <div className="section-label mb-2">Live Preview</div>
          <div className="font-display text-sm font-semibold text-slate-600">
            Estimated Total
          </div>
          <div className="mt-1 font-display text-4xl font-bold tabular-nums text-slate-900">
            {formatCompactINR(preview?.summary?.total || 0)}
          </div>

          {preview?.summary?.ratePerSqft > 0 && (
            <div className="mt-1 text-xs text-slate-500 tabular-nums">
              ≈ ₹{formatNumber(preview.summary.ratePerSqft, 0)} / sqft
            </div>
          )}

          <div className="mt-5 space-y-2 text-sm">
            <PreviewRow label="Subtotal" value={preview?.summary?.subtotal} />
            <PreviewRow label="Markup" value={preview?.summary?.markup} />
            <PreviewRow
              label="Contingency"
              value={preview?.summary?.contingency}
            />
            <PreviewRow label="GST" value={preview?.summary?.gst} />
            <Separator />
            <PreviewRow label="Total" value={preview?.summary?.total} bold />
            <PreviewRow
              label="Line items"
              value={preview?.summary?.itemCount}
              raw
            />
          </div>

          <div className="mt-4 rounded-lg border border-accent/30 bg-accent/10 p-3 text-xs text-slate-700">
            <Sparkles size={14} className="mr-1 inline text-accent" />
            Live updates as you type. Line items are editable after generation.
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ====================== SUB COMPONENTS ====================== */

function PreviewRow({ label, value, bold, raw }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-slate-500">{label}</span>
      <span
        className={`tabular-nums ${bold ? "text-lg font-bold text-slate-900" : "font-medium text-slate-800"}`}
      >
        {raw ? formatNumber(value || 0, 0) : formatCompactINR(value || 0)}
      </span>
    </div>
  );
}

function StepBasics({ project, update, onCity }) {
  return (
    <div className="space-y-5" data-testid="step-basics">
      <SectionHeader
        title="Project Basics"
        hint="Name, client, location and overall scope"
      />
      <Grid>
        <Field label="Project Name *" required>
          <Input
            value={project.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="e.g. Villa at Whitefield"
            data-testid="input-name"
          />
        </Field>
        <Field label="Client Name">
          <Input
            value={project.client_name}
            onChange={(e) => update({ client_name: e.target.value })}
            placeholder="e.g. Mr. Rajesh Kumar"
            data-testid="input-client"
          />
        </Field>
      </Grid>

      <Grid>
        <Field label="Project Type">
          <Select
            value={project.project_type}
            onValueChange={(v) => update({ project_type: v })}
          >
            <SelectTrigger data-testid="select-project-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="renovation">Renovation</SelectItem>
              <SelectItem value="interior">Interior</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="City / Location">
          <Select value={project.location} onValueChange={onCity}>
            <SelectTrigger data-testid="select-city">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CITY_MULTIPLIER).map(([c, m]) => (
                <SelectItem key={c} value={c}>
                  {c} ({m.toFixed(2)}×)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Grid>

      <Grid>
        <Field label="Scope">
          <Select
            value={project.scope}
            onValueChange={(v) => update({ scope: v })}
          >
            <SelectTrigger data-testid="select-scope">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Construction</SelectItem>
              <SelectItem value="renovation">Renovation</SelectItem>
              <SelectItem value="interior_only">Interior Only</SelectItem>
              <SelectItem value="civil_only">Civil Only</SelectItem>
              <SelectItem value="plumbing_only">Plumbing Only</SelectItem>
              <SelectItem value="electrical_only">Electrical Only</SelectItem>
              <SelectItem value="finishing_only">Finishing Only</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Quality Grade">
          <Select
            value={project.quality}
            onValueChange={(v) => update({ quality: v })}
          >
            <SelectTrigger data-testid="select-quality">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(QUALITY_MULTIPLIER).map(([k, m]) => (
                <SelectItem key={k} value={k} className="capitalize">
                  {k} ({m.toFixed(2)}×)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Grid>
    </div>
  );
}

function StepQuickArea({ project, update }) {
  return (
    <div className="space-y-5" data-testid="step-quick-area">
      <SectionHeader
        title="Area & Quality"
        hint="Just enter built-up area — we'll compute everything"
      />
      <Grid>
        <Field label="Built-up Area (sqft) *" required>
          <Input
            type="number"
            min="1"
            value={project.built_up_area}
            onChange={(e) => update({ built_up_area: Number(e.target.value) })}
            data-testid="input-built-up-area"
          />
        </Field>
        <Field label="Floors">
          <Input
            type="number"
            min="1"
            value={project.floors}
            onChange={(e) => update({ floors: Number(e.target.value) })}
            data-testid="input-floors"
          />
        </Field>
      </Grid>
      <div className="rounded-lg border border-border bg-slate-50 p-4">
        <div className="section-label mb-2">Presets applied</div>
        <div className="text-sm text-slate-700">
          Base rate for <b className="capitalize">{project.project_type}</b> is
          multiplied by quality (<b className="capitalize">{project.quality}</b>
          ) and city multiplier (
          <b className="tabular-nums">
            {project.location_multiplier.toFixed(2)}×
          </b>
          ).
        </div>
      </div>
    </div>
  );
}

function StepDimensions({ project, update }) {
  return (
    <div className="space-y-5" data-testid="step-dimensions">
      <SectionHeader
        title="Dimensions & Counts"
        hint="Areas, floors, rooms, bathrooms, kitchens"
      />
      <Grid>
        <Field label="Plot Area (sqft)">
          <Input
            type="number"
            min="0"
            value={project.plot_area}
            onChange={(e) => update({ plot_area: Number(e.target.value) })}
            data-testid="input-plot-area"
          />
        </Field>
        <Field label="Built-up Area (sqft) *" required>
          <Input
            type="number"
            min="0"
            value={project.built_up_area}
            onChange={(e) => update({ built_up_area: Number(e.target.value) })}
            data-testid="input-built-up-area"
          />
        </Field>
      </Grid>
      <Grid>
        <Field label="Carpet Area (sqft)">
          <Input
            type="number"
            min="0"
            value={project.carpet_area}
            onChange={(e) => update({ carpet_area: Number(e.target.value) })}
            data-testid="input-carpet-area"
          />
        </Field>
        <Field label="Ceiling Height (ft)">
          <Input
            type="number"
            min="0"
            step="0.5"
            value={project.ceiling_height}
            onChange={(e) => update({ ceiling_height: Number(e.target.value) })}
            data-testid="input-ceiling-height"
          />
        </Field>
      </Grid>
      <Grid cols={3}>
        <Field label="Floors">
          <Input
            type="number"
            min="1"
            value={project.floors}
            onChange={(e) => update({ floors: Number(e.target.value) })}
            data-testid="input-floors"
          />
        </Field>
        <Field label="Bedrooms">
          <Input
            type="number"
            min="0"
            value={project.bedrooms}
            onChange={(e) => update({ bedrooms: Number(e.target.value) })}
            data-testid="input-bedrooms"
          />
        </Field>
        <Field label="Living Rooms">
          <Input
            type="number"
            min="0"
            value={project.living_rooms}
            onChange={(e) => update({ living_rooms: Number(e.target.value) })}
            data-testid="input-living-rooms"
          />
        </Field>
      </Grid>
      <Grid cols={3}>
        <Field label="Bathrooms">
          <Input
            type="number"
            min="0"
            value={project.bathrooms}
            onChange={(e) => update({ bathrooms: Number(e.target.value) })}
            data-testid="input-bathrooms"
          />
        </Field>
        <Field label="Kitchens">
          <Input
            type="number"
            min="0"
            value={project.kitchens}
            onChange={(e) => update({ kitchens: Number(e.target.value) })}
            data-testid="input-kitchens"
          />
        </Field>
        <Field label="Balconies">
          <Input
            type="number"
            min="0"
            value={project.balconies}
            onChange={(e) => update({ balconies: Number(e.target.value) })}
            data-testid="input-balconies"
          />
        </Field>
      </Grid>
    </div>
  );
}

function StepRooms({ project, addRoom, updateRoom, removeRoom }) {
  return (
    <div className="space-y-5" data-testid="step-rooms">
      <div className="flex items-start justify-between">
        <SectionHeader
          title="Rooms & Finishes"
          hint="Per-room dimensions with flooring + wall finish. Optional but recommended for detailed BOQ."
        />
        <Button size="sm" onClick={addRoom} data-testid="add-room-btn">
          <Plus size={16} className="mr-1" /> Add Room
        </Button>
      </div>

      {project.rooms.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <Layers size={28} className="mx-auto mb-2 text-slate-400" />
          <div className="font-medium">No rooms added yet</div>
          <p className="mt-1 text-sm text-slate-500">
            Without rooms we'll estimate in bulk. Add rooms for accurate
            per-room materials.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            onClick={addRoom}
            data-testid="add-first-room"
          >
            <Plus size={16} className="mr-1" /> Add First Room
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {project.rooms.map((r, idx) => (
            <div
              key={r.id || idx}
              className="rounded-lg border border-border bg-slate-50 p-4"
              data-testid={`room-card-${idx}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <Select
                    value={r.type}
                    onValueChange={(v) => updateRoom(idx, { type: v })}
                  >
                    <SelectTrigger
                      className="h-9 max-w-[220px]"
                      data-testid={`room-type-${idx}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROOM_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeRoom(idx)}
                  data-testid={`remove-room-${idx}`}
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                <NumField
                  label="L (ft)"
                  value={r.length}
                  onChange={(v) => updateRoom(idx, { length: v })}
                  testId={`room-${idx}-length`}
                />
                <NumField
                  label="W (ft)"
                  value={r.width}
                  onChange={(v) => updateRoom(idx, { width: v })}
                  testId={`room-${idx}-width`}
                />
                <NumField
                  label="H (ft)"
                  value={r.height}
                  onChange={(v) => updateRoom(idx, { height: v })}
                  testId={`room-${idx}-height`}
                />
                <div className="col-span-3 sm:col-span-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">
                    Area
                  </div>
                  <div className="h-9 flex items-center font-mono-plex text-sm font-medium tabular-nums">
                    {formatNumber(
                      Number(r.length || 0) * Number(r.width || 0),
                      0,
                    )}{" "}
                    sqft
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Field label="Flooring">
                  <Select
                    value={r.flooring}
                    onValueChange={(v) => updateRoom(idx, { flooring: v })}
                  >
                    <SelectTrigger
                      className="h-9"
                      data-testid={`room-${idx}-flooring`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FLOORING_OPTIONS.map((o) => (
                        <SelectItem key={o.key} value={o.key}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Wall Finish">
                  <Select
                    value={r.wall}
                    onValueChange={(v) => updateRoom(idx, { wall: v })}
                  >
                    <SelectTrigger
                      className="h-9"
                      data-testid={`room-${idx}-wall`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WALL_FINISH_OPTIONS.map((o) => (
                        <SelectItem key={o.key} value={o.key}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <Switch
                  checked={!!r.false_ceiling}
                  onCheckedChange={(v) => updateRoom(idx, { false_ceiling: v })}
                  data-testid={`room-${idx}-fc`}
                />
                <Label className="text-sm">False Ceiling (Gypsum)</Label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepSettings({ project, update }) {
  return (
    <div className="space-y-5" data-testid="step-settings">
      <SectionHeader
        title="Rates & Settings"
        hint="Tune wastage, markup, GST and contingency. Rate library edits affect future generations."
      />
      <Grid cols={2}>
        <Field label={`Wastage % (${project.wastage_percent}%)`}>
          <Input
            type="number"
            min="0"
            max="20"
            value={project.wastage_percent}
            onChange={(e) =>
              update({ wastage_percent: Number(e.target.value) })
            }
            data-testid="input-wastage"
          />
        </Field>
        <Field
          label={`Contractor Markup % (${project.contractor_markup_percent}%)`}
        >
          <Input
            type="number"
            min="0"
            max="50"
            value={project.contractor_markup_percent}
            onChange={(e) =>
              update({ contractor_markup_percent: Number(e.target.value) })
            }
            data-testid="input-markup"
          />
        </Field>
        <Field label={`Contingency % (${project.contingency_percent}%)`}>
          <Input
            type="number"
            min="0"
            max="25"
            value={project.contingency_percent}
            onChange={(e) =>
              update({ contingency_percent: Number(e.target.value) })
            }
            data-testid="input-contingency"
          />
        </Field>
        <Field label={`GST % (${project.gst_percent}%)`}>
          <Input
            type="number"
            min="0"
            max="28"
            value={project.gst_percent}
            onChange={(e) => update({ gst_percent: Number(e.target.value) })}
            data-testid="input-gst"
          />
        </Field>
      </Grid>

      <div className="space-y-3 rounded-lg border border-border bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Include Labor</Label>
            <p className="text-xs text-slate-500">
              Skilled + unskilled mandays
            </p>
          </div>
          <Switch
            checked={project.include_labor}
            onCheckedChange={(v) => update({ include_labor: v })}
            data-testid="toggle-labor"
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Include GST</Label>
            <p className="text-xs text-slate-500">
              Adds GST on top of subtotal
            </p>
          </div>
          <Switch
            checked={project.include_gst}
            onCheckedChange={(v) => update({ include_gst: v })}
            data-testid="toggle-gst"
          />
        </div>
      </div>

      <Field label="Notes / Assumptions">
        <textarea
          value={project.notes}
          onChange={(e) => update({ notes: e.target.value })}
          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Site access, procurement notes, exclusions…"
          data-testid="input-notes"
        />
      </Field>
    </div>
  );
}

function StepReview({ project, preview }) {
  return (
    <div className="space-y-5" data-testid="step-review">
      <SectionHeader
        title="Review & Generate"
        hint="Check your inputs — you can edit every BOQ line after generation"
      />
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
        <div className="section-label mb-1">Preview Summary</div>
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <div>
            <div className="text-xs text-slate-500">Total Cost</div>
            <div className="font-display text-3xl font-bold tabular-nums text-slate-900">
              {formatCompactINR(preview?.summary?.total || 0)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Rate / sqft</div>
            <div className="font-mono-plex text-xl font-semibold tabular-nums">
              ₹{formatNumber(preview?.summary?.ratePerSqft || 0, 0)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Line Items</div>
            <div className="font-mono-plex text-xl font-semibold tabular-nums">
              {preview?.summary?.itemCount || 0}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ReviewRow label="Project" value={project.name || "Untitled"} />
        <ReviewRow label="Client" value={project.client_name || "—"} />
        <ReviewRow label="City" value={project.location} />
        <ReviewRow
          label="Type / Scope"
          value={`${project.project_type} / ${project.scope}`}
        />
        <ReviewRow label="Quality" value={project.quality} />
        <ReviewRow
          label="Built-up Area"
          value={`${formatNumber(project.built_up_area, 0)} sqft`}
        />
        <ReviewRow label="Floors" value={project.floors} />
        <ReviewRow label="Rooms Defined" value={project.rooms.length} />
      </div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded border border-border bg-white px-3 py-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium capitalize">{value ?? "—"}</span>
    </div>
  );
}

function SectionHeader({ title, hint }) {
  return (
    <div>
      <h3 className="font-display text-xl font-semibold text-slate-900">
        {title}
      </h3>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

function Grid({ children, cols = 2 }) {
  const c =
    cols === 3
      ? "sm:grid-cols-3"
      : cols === 4
        ? "sm:grid-cols-4"
        : "sm:grid-cols-2";
  return <div className={`grid grid-cols-1 gap-4 ${c}`}>{children}</div>;
}

function Field({ label, children, required }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function NumField({ label, value, onChange, testId }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <Input
        type="number"
        className="h-9"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        data-testid={testId}
      />
    </div>
  );
}
