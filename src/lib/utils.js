import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
/** Merge Tailwind class names safely. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
/**
 * Short, collision-resistant id.
 *
 * `crypto.randomUUID` is unavailable on plain HTTP origins (for example when
 * the dev server is opened from a phone over the LAN), so a timestamp +
 * random suffix is used instead.
 */
export function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}
/** Build the next sequential code, e.g. `ORD-5007` from `["ORD-5001", ...]`. */
export function nextCode(prefix, existing) {
  const highest = existing.reduce((max, code) => {
    const value = Number(code.split("-")[1]);
    return Number.isFinite(value) && value > max ? value : max;
  }, 0);
  return `${prefix}-${highest + 1}`;
}
/** Keep only digits and cap the length — used for phone / national-id inputs. */
export function digitsOnly(value, length) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, length);
}
/** Clamp a number into `[min, max]`; empty or non-numeric input becomes `min`. */
export function clampNumber(value, min, max) {
  const parsed = Number(value);
  if (value === "" || value == null || Number.isNaN(parsed)) return min;
  return Math.min(max, Math.max(min, parsed));
}
