import { cn } from "@/lib/utils";
import { toFaDigits } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
/* -------------------------------------------------------------------------- */
/*                                Status badge                                */
/* -------------------------------------------------------------------------- */
const TONE_BY_STATUS = {
  // generic
  فعال: "success",
  غیرفعال: "neutral",
  "در انتظار تایید": "warning",
  // delivery
  "در حال آماده‌سازی": "info",
  "آماده ارسال": "brand",
  "در مسیر": "warning",
  "تحویل شده": "success",
  مرجوع: "danger",
  // repairs
  "در انتظار بررسی": "warning",
  "در حال تعمیر": "info",
  "آماده تحویل": "brand",
  "غیرقابل تعمیر": "danger",
  // support
  باز: "danger",
  "در حال بررسی": "warning",
  "پاسخ داده شده": "info",
  بسته: "success",
  // priority
  کم: "neutral",
  متوسط: "info",
  بالا: "warning",
  فوری: "danger",
  // leads
  سرنخ: "neutral",
  "تماس گرفته شده": "info",
  "واجد شرایط": "brand",
  "تبدیل شده": "success",
  "رد شده": "danger",
  // follow-up stages
  جدید: "neutral",
  "تماس اولیه": "info",
  "ارائه پیشنهاد": "brand",
  مذاکره: "warning",
  قرارداد: "success",
  ناموفق: "danger",
};
export function StatusBadge({ status }) {
  return <Badge tone={TONE_BY_STATUS[status] ?? "neutral"}>{status}</Badge>;
}
/* -------------------------------------------------------------------------- */
/*                                 Stat card                                  */
/* -------------------------------------------------------------------------- */
const KPI_TONES = {
  brand: "bg-brand-soft text-brand",
  success: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  warning: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  info: "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
};
export function StatCard({ title, value, hint, change, icon: Icon, tone = "brand" }) {
  const up = (change ?? 0) >= 0;
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 truncate text-lg font-bold text-foreground sm:text-xl">{value}</p>
        </div>
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-lg sm:size-10",
            KPI_TONES[tone],
          )}
        >
          <Icon className="size-5" />
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        {change !== undefined && (
          <span
            className={cn(
              "font-semibold",
              up ? "text-emerald-600 dark:text-emerald-400" : "text-danger",
            )}
          >
            {up ? "▲" : "▼"} {toFaDigits(Math.abs(change))}٪
          </span>
        )}
        {hint && <span className="text-faint">{hint}</span>}
      </div>
    </div>
  );
}
/* -------------------------------------------------------------------------- */
/*                                   Bar chart                                */
/* -------------------------------------------------------------------------- */
export function BarChart({ data, className }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className={cn("flex h-44 items-end gap-3", className)}>
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-full w-full items-end">
            <div
              className="w-full rounded-t-md bg-brand/85 transition-all hover:bg-brand"
              style={{ height: `${(item.value / max) * 100}%` }}
              title={`${item.label}: ${toFaDigits(item.value)}`}
            />
          </div>
          <span className="text-[11px] text-faint">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
/* -------------------------------------------------------------------------- */
/*                               Donut / channel                              */
/* -------------------------------------------------------------------------- */
export function ChannelBreakdown({ items }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">{item.label}</span>
            <span className="text-faint">{toFaDigits(item.value)}٪</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all", item.tone)}
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
