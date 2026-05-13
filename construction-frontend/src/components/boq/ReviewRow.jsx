export default function ReviewRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded border border-border bg-white px-3 py-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium capitalize">{value ?? "—"}</span>
    </div>
  );
}
