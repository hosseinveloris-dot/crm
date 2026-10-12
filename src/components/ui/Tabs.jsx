import { createContext, useContext, useId, useState } from "react";
import { cn } from "@/lib/utils";
const TabsContext = createContext(null);
function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used inside <Tabs>");
  return ctx;
}
export function Tabs({ defaultValue, value: controlled, onValueChange, children, className }) {
  const baseId = useId();
  const [internal, setInternal] = useState(defaultValue ?? "");
  const value = controlled ?? internal;
  const setValue = (next) => {
    setInternal(next);
    onValueChange?.(next);
  };
  return (
    <TabsContext.Provider value={{ value, setValue, baseId }}>
      <div className={cn("min-w-0", className)}>{children}</div>
    </TabsContext.Provider>
  );
}
export function TabsList({ children, className }) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex max-w-full flex-wrap items-center gap-1 rounded-lg bg-muted p-1",
        className,
      )}
    >
      {children}
    </div>
  );
}
export function TabsTrigger({ value, children }) {
  const { value: active, setValue, baseId } = useTabs();
  const selected = active === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={selected}
      onClick={() => setValue(value)}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-md px-3.5 py-1.5 text-sm font-medium transition sm:px-4",
        selected
          ? "bg-surface text-brand shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
export function TabsContent({ value, children, className }) {
  const { value: active, baseId } = useTabs();
  if (active !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      className={className}
    >
      {children}
    </div>
  );
}
