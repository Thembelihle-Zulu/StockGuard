import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export function ListItems({ Component, url, onCountChange, filterFn }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    apiFetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setItems(data))
      .catch(console.error);
  }, [url]);

  useEffect(() => {
    onCountChange?.(items.length);
  }, [items]);

  const visibleItems = filterFn ? items.filter(filterFn) : items;

  return (
    <div className="claims-grid">
      {visibleItems.map((item) => (
        <Component key={item.id} item={item} />
      ))}
    </div>
  );
}
