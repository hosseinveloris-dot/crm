import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 sm:gap-4">
      <div className="min-w-0">
        <h1 className="text-base font-bold text-slate-800 sm:text-lg">{title}</h1>
        {description && <p className="mt-1 text-xs text-slate-500 sm:text-sm">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
export function SearchInput({ value, onChange, placeholder = "جستجو...", className }) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="input-base pr-9"
      />
    </div>
  );
}
export function EmptyState({ title, description, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-slate-100 text-slate-400">
        {Icon ? <Icon className="size-5" /> : null}
      </div>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      {description && <p className="max-w-sm text-xs text-slate-400">{description}</p>}
    </div>
  );
}
