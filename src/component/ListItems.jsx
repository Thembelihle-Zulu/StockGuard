import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export function ListItems({
  Component,
  url,
  items: providedItems,
  onCountChange,
  filterFn,
  emptyState,
  componentProps = {},
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

  if (visibleItems.length === 0 && items.length === 0 && emptyState) {
    return emptyState;
  }

  return (
    <div className="claims-grid">
      {visibleItems.map((item) => (
        <Component key={item.id} item={item} {...componentProps} />
      ))}
    </div>
  );
}
