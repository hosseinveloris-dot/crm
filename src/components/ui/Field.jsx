import { cn } from "@/lib/utils";
export function Field({ label, hint, error, required, children, className }) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="flex items-center gap-1 text-xs font-medium text-foreground">
        {label}
        {required && <span className="text-danger">*</span>}
      </span>
      {children}
      {error ? (
        <span className="block text-[11px] text-danger">{error}</span>
      ) : (
        hint && <span className="block text-[11px] text-faint">{hint}</span>
      )}
    </label>
  );
}
export function Input({ className, ...props }) {
  return <input className={cn("input-base", className)} {...props} />;
}
export function Select({ className, children, ...props }) {
  return (
    <select className={cn("input-base cursor-pointer", className)} {...props}>
      {children}
    </select>
  );
}
export function Textarea({ className, ...props }) {
  return (
    <textarea className={cn("input-base h-auto min-h-24 resize-y py-2.5", className)} {...props} />
  );
}
