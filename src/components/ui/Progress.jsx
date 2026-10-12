import { cn } from "@/lib/utils";
const TONES = {
  brand: "bg-brand",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};
export function Progress({ value, tone = "brand", className }) {
  const safe = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
      role="progressbar"
      aria-valuenow={safe}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-all", TONES[tone])}
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}
