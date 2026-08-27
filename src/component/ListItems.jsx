import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

// Either pass `url` to self-fetch (the common case), or pass `items`
// directly when the caller already has data that needed joining across
// more than one endpoint (e.g. inspections joined to their animal) —
// self-fetching can't express that, so this is the escape hatch rather
// than a second near-identical grid component.
export function ListItems({
  Component,
  url,
  items: providedItems,
  onCountChange,
  filterFn,
  emptyState,
}) {
  const [fetchedItems, setFetchedItems] = useState([]);

  useEffect(() => {
    if (providedItems) return;
    apiFetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setFetchedItems(data))
      .catch(console.error);
  }, [url, providedItems]);

  const items = providedItems ?? fetchedItems;

  useEffect(() => {
    onCountChange?.(items.length);
  }, [items]);

  const visibleItems = filterFn ? items.filter(filterFn) : items;

  // emptyState is for "you have nothing at all yet" (guides the farmer
  // to go create something) — if filters narrowed a non-empty list down
  // to nothing, that's a different, unguided case, so it falls through
  // to the plain empty grid rather than showing a misleading CTA.
  if (visibleItems.length === 0 && items.length === 0 && emptyState) {
    return emptyState;
  }

  return (
    <div className="claims-grid">
      {visibleItems.map((item) => (
        <Component key={item.id} item={item} />
      ))}
    </div>
  );
}
