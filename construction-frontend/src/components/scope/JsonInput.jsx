import { Textarea } from "@/components/ui/textarea";
export default function JsonInput({ value, onChange }) {
  return (
    <Textarea
      rows={6}
      value={value ? JSON.stringify(value, null, 2) : ""}
      onChange={(e) => {
        try {
          onChange(JSON.parse(e.target.value));
        } catch {
          onChange(e.target.value);
        }
      }}
      placeholder='{"key": "value"} or plain text'
    />
  );
}
