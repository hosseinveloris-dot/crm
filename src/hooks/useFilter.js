import { useMemo } from "react";
/**
 * Case-insensitive text filter over a list.
 * `toText` decides which fields participate in the search.
 */
export function useFilter(items, query, toText) {
  const normalized = query.trim().toLowerCase();
  return useMemo(() => {
    if (!normalized) return items;
    return items.filter((item) => toText(item).toLowerCase().includes(normalized));
  }, [items, normalized, toText]);
}
