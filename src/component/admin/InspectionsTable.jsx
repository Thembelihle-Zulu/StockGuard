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

function renderCell(row, col, onStatusChange) {
  switch (col.key) {
    case "status":
      return (
        <StatusCell
          id={row.id}
          status={row.status}
          onStatusChange={onStatusChange}
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
      onView={onView}
      onStatusChange={onStatusChange}
    />
  );
}
