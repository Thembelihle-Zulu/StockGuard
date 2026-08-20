import { useEffect, useState } from "react";
import { Claim } from "../component/Claim";

export function ListItems({ Component, url }) {
  const [items, setItems] = useState([]);
  // http://127.0.0.1:5000/api/claims
  useEffect(() => {
    fetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setItems(data))
      .catch(console.error);
  }, [url]);

  return (
    <div className="claims-grid">
      {items.map((item) => (
        <Component key={item.id} claim={item} />
      ))}
    </div>
  );
}
