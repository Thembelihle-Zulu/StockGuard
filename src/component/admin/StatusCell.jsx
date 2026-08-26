import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const DEFAULT_STATUS_STYLES = {
  pending: { label: "Pending", className: "status-pill status-pill--sick" },
  approved: { label: "Approved", className: "status-pill status-pill--alive" },
  denied: { label: "Denied", className: "status-pill status-pill--deceased" },
};

const DEFAULT_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "denied", label: "Denied" },
];

function StatusPill({ status, styles }) {
  const key = status?.toLowerCase();
  const style = styles[key] ?? {
    label: status || "Unknown",
    className: "status-pill status-pill--unknown",
  };
  return <span className={style.className}>{style.label}</span>;
}

export function StatusCell({
  id,
  status,
  onStatusChange,
  options = DEFAULT_OPTIONS,
  styles = DEFAULT_STATUS_STYLES,
}) {
  const role = localStorage.getItem("role");
  const normalized = (status || options[0].value).toLowerCase();

  if (role !== "ADMIN") {
    return <StatusPill status={status} styles={styles} />;
  }

  return (
    <Select
      key={`${id}-${normalized}`}
      size="small"
      defaultValue={normalized}
      onChange={(e) => onStatusChange(id, e.target.value)}
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value.toLowerCase()}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
}
