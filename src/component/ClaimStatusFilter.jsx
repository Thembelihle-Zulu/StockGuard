import { useState } from "react";

const statuses = [
  { key: "pending", label: "Pending" },
  { key: "denied", label: "Denied" },
  { key: "approved", label: "Approved" },
];

// Filter bar for claim status — reuses the same .claim-status-* pill
// classes already defined in Claim.css for the badges on individual
// claim cards, so a "Pending" filter pill and a "Pending" status badge
// look identical on purpose.
//
// onFilterChange(status) fires with "pending" | "denied" | "approved" |
// null (null = "All" / filter cleared) — wire this to whatever filters
// your claims list.
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
