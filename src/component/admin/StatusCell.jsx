import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const STATUS_STYLES = {
  pending: { label: "Pending", className: "status-pill status-pill--sick" },
  approved: { label: "Approved", className: "status-pill status-pill--alive" },
  denied: { label: "Denied", className: "status-pill status-pill--deceased" },
};

function StatusPill({ status }) {
  const key = status?.toLowerCase();
  const style = STATUS_STYLES[key] ?? {
    label: status || "Unknown",
    className: "status-pill status-pill--unknown",
  };
  return <span className={style.className}>{style.label}</span>;
}

export function StatusCell({ claim, onStatusChange }) {
  const role = localStorage.getItem("role");
  const status = (claim.status || "pending").toLowerCase();

  if (role !== "ADMIN" || !onStatusChange) {
    return <StatusPill status={claim.status} />;
  }

  return (
    <Select
      key={`${claim.id}-${status}`}
      size="small"
      defaultValue={status}
      onChange={(e) => onStatusChange(claim.id, e.target.value)}
    >
      <MenuItem value="pending">Pending</MenuItem>
      <MenuItem value="approved">Approved</MenuItem>
      <MenuItem value="denied">Denied</MenuItem>
    </Select>
  );
}
