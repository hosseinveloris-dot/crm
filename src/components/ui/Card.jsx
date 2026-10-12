import { cn } from "@/lib/utils";
export function Card({ className, ...props }) {
  return <div className={cn("card", className)} {...props} />;
}
export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5 sm:py-4",
        className,
      )}
      {...props}
    />
  );
}
export function CardTitle({ className, ...props }) {
  return <h3 className={cn("text-sm font-semibold text-foreground", className)} {...props} />;
}
export function CardDescription({ className, ...props }) {
  return <p className={cn("mt-1 text-xs text-muted-foreground", className)} {...props} />;
}
export function CardBody({ className, ...props }) {
  return <div className={cn("p-4 sm:p-5", className)} {...props} />;
}
