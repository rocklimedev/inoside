// components/boq/StepReview.tsx
import PreviewRow from "./PreviewRow";

export default function StepReview({ project, preview }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Project Summary</h3>
        <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
          <p>
            <strong>Title:</strong> {project.title}
          </p>
          <p>
            <strong>Built-up Area:</strong> {project.built_up_area} sqft
          </p>
          <p>
            <strong>Floors:</strong> {project.floors}
          </p>
          <p>
            <strong>Quality:</strong> {project.quality}
          </p>
          <p>
            <strong>Location:</strong> {project.location}
          </p>
        </div>
      </div>

      {preview && (
        <div>
          <h3 className="font-semibold mb-3">Cost Breakdown</h3>
          <div className="space-y-3">
            <PreviewRow label="Subtotal" value={preview.summary?.subtotal} />
            <PreviewRow label="Markup" value={preview.summary?.markup} />
            <PreviewRow
              label="Contingency"
              value={preview.summary?.contingency}
            />
            <PreviewRow label="GST" value={preview.summary?.gst} />
            <PreviewRow label="Total" value={preview.summary?.total} bold />
          </div>
        </div>
      )}
    </div>
  );
}
