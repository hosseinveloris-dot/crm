import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
/**
 * Accessible dialog rendered in a portal.
 *
 * Render it conditionally (`{open && <Modal ... />}`) so form state inside is
 * reset on every open. On phones it docks to the bottom of the screen like a
 * sheet, and becomes a centered dialog from `sm` upwards.
 */
export function Modal({ title, description, onClose, footer, size = "md", children }) {
  const titleId = useId();
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="animate-overlay-in absolute inset-0 bg-slate-900/45"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "animate-dialog-in relative flex max-h-[92dvh] w-full flex-col overflow-hidden",
          "rounded-t-xl bg-surface shadow-pop sm:rounded-xl",
          size === "lg" ? "sm:max-w-2xl" : "sm:max-w-lg",
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
          <div className="min-w-0">
            <h2 id={titleId} className="text-sm font-bold text-foreground">
              {title}
            </h2>
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="grid size-8 shrink-0 place-items-center rounded-md text-faint transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </header>
        <div className="scrollbar-thin flex-1 overflow-y-auto px-4 py-4 sm:px-5">{children}</div>
        {footer && (
          <footer className="flex flex-col-reverse gap-2 border-t border-border px-4 py-3.5 sm:flex-row sm:justify-start sm:px-5">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
