import { GenericDataTable } from "./GenericDataTable";
import "../../styles/livestock-table.css";
import { StatusCell } from "./StatusCell";

const POLICY_STATUS_STYLES = {
  active: { label: "Active", className: "status-pill status-pill--alive" },
  cancelled: {
    label: "Cancelled",
    className: "status-pill status-pill--deceased",
  },
  expired: { label: "Expired", className: "status-pill status-pill--sick" },
};

const POLICY_STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Expired", label: "Expired" },
];

const COLUMNS = [
  { key: "policy_number", label: "Policy #", sortable: true },
  { key: "farm_name", label: "Farm", sortable: true },
  { key: "monthly_premium", label: "Monthly Premium", sortable: true },
  { key: "animal_count_at_pricing", label: "Animals Covered", sortable: true },
  { key: "creation_date", label: "Created", sortable: true },
  { key: "status", label: "Status", sortable: true },
];

function renderCell(row, col, onStatusChange) {
  switch (col.key) {
    case "status":
      return (
        <StatusCell
          id={row.policy_number}
          status={row.status}
          onStatusChange={onStatusChange}
          options={POLICY_STATUS_OPTIONS}
          styles={POLICY_STATUS_STYLES}
        />
      );
    case "monthly_premium":
      return row.monthly_premium != null
        ? `R ${Number(row.monthly_premium).toLocaleString()}`
        : "-";
    case "creation_date":
      return row.creation_date
        ? new Date(row.creation_date).toLocaleDateString()
        : "-";
    default:
      return row[col.key] ?? "-";
  }
}

export function PoliciesTable({ rows, onView, onStatusChange }) {
  return (
    <GenericDataTable
      rows={rows}
      columns={COLUMNS}
      renderCell={renderCell}
      getRowId={(row) => row.policy_number}
      searchPlaceholder="Search policies..."
      searchKeys={["policy_number", "farm_name", "status"]}
      emptyMessage="No policies match your search."
      onView={onView}
      onStatusChange={onStatusChange}
    />
  );
}
