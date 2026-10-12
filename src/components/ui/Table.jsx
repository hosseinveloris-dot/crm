import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
/**
 * Responsive column helpers — hide low-priority columns on small screens so
 * wide data tables stay usable on phones.
 */
export const COL_HIDE_SM = "hidden sm:table-cell";
export const COL_HIDE_MD = "hidden md:table-cell";
export const COL_HIDE_LG = "hidden lg:table-cell";
export function Table({ className, ...props }) {
  return (
    <div className="scrollbar-thin w-full touch-pan-x overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", className)} {...props} />
    </div>
  );
}
export function THead({ className, ...props }) {
  return <thead className={cn("bg-muted/80", className)} {...props} />;
}
export function TBody({ className, ...props }) {
  return <tbody className={cn("divide-y divide-border", className)} {...props} />;
}
export function TR({ className, ...props }) {
  return <tr className={cn("transition hover:bg-muted/70", className)} {...props} />;
}
export function TH({ className, ...props }) {
  return (
    <th
      className={cn(
        "whitespace-nowrap px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground sm:px-4 sm:py-3",
        className,
      )}
      {...props}
    />
  );
}
export function TD({ className, ...props }) {
  return (
    <td
      className={cn("whitespace-nowrap px-3 py-2.5 text-foreground sm:px-4 sm:py-3", className)}
      {...props}
    />
  );
}
/** Compact icon button for table action columns. */
export function EditButton({ label = "ویرایش", className, ...props }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={cn(
        "grid size-8 place-items-center rounded-md text-faint transition hover:bg-muted hover:text-foreground",
        className,
      )}
      {...props}
    >
      <Pencil className="size-4" />
    </button>
  );
}
