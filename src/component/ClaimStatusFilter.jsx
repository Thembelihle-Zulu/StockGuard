import { useState } from "react";
import "../styles/claims-list.css";
const statuses = [
  { key: "pending", label: "Pending" },
  { key: "denied", label: "Denied" },
  { key: "approved", label: "Approved" },
];

export function ClaimStatusFilter({ onFilterChange }) {
  const [active, setActive] = useState(null);

  const handleClick = (key) => {
    const next = active === key ? null : key; // click again to clear
    setActive(next);
    onFilterChange?.(next);
  };

  return (
    <div className="pills">
      {statuses.map((status) => (
        <button
          key={status.key}
          type="button"
          onClick={() => handleClick(status.key)}
          aria-pressed={active === status.key}
          className={`claim-status-badge claim-status-${status.key} pill-button${
            active === status.key ? " pill-button-active" : ""
          }`}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
}
