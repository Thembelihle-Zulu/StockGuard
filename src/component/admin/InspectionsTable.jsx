import { GenericDataTable } from "./GenericDataTable";
import "../../styles/livestock-table.css";
import { StatusCell } from "./StatusCell";

const COLUMNS = [
  { key: "tag_number", label: "Animal", sortable: true },
  { key: "species", label: "Species", sortable: true },
  { key: "farm_name", label: "Farm", sortable: true },
  { key: "inspection_date", label: "Inspection Date", sortable: true },
  { key: "status", label: "Status", sortable: true },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "denied", label: "Changes Requested" },
];

const STATUS_STYLES = {
  pending: { label: "Pending", className: "status-pill status-pill--sick" },
  approved: { label: "Approved", className: "status-pill status-pill--alive" },
  denied: {
    label: "Changes Requested",
    className: "status-pill status-pill--deceased",
  },
};

function renderCell(row, col, onStatusChange) {
  switch (col.key) {
    case "status":
      return (
        <StatusCell
          id={row.id}
          status={row.status}
          onStatusChange={onStatusChange}
          options={STATUS_OPTIONS}
          styles={STATUS_STYLES}
        />
      );
    case "inspection_date":
      return row.inspection_date
        ? new Date(row.inspection_date).toLocaleDateString()
        : "-";
    default:
      return row[col.key] ?? "-";
  }
}

export function InspectionsTable({ rows, onView, onStatusChange }) {
  return (
    <GenericDataTable
      rows={rows}
      columns={COLUMNS}
      renderCell={renderCell}
      searchPlaceholder="Search inspections..."
      searchKeys={["tag_number", "species", "farm_name", "status"]}
      emptyMessage="No inspections match your search."
      exportFilename="inspections"
      onView={onView}
      onStatusChange={onStatusChange}
    />
  );
}
