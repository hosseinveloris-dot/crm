import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
const VARIANTS = {
  primary: "bg-brand text-brand-foreground hover:brightness-110 shadow-sm",
  secondary: "bg-muted text-foreground hover:bg-slate-200 dark:hover:bg-white/10",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "bg-danger text-white hover:brightness-110 shadow-sm",
  outline: "border border-border bg-surface text-foreground hover:bg-muted",
};
const SIZES = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-11 px-6 text-sm gap-2",
  icon: "h-9 w-9",
};
/** Shared class builder so non-button elements (e.g. links) can look like buttons. */
export function buttonClasses(variant = "primary", size = "md", className) {
  return cn(
    "inline-flex select-none items-center justify-center rounded-md font-medium",
    "transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
    "disabled:cursor-not-allowed disabled:opacity-60",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}
export const Button = forwardRef(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={buttonClasses(variant, size, className)}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  ),
);
Button.displayName = "Button";
