import { GenericDataTable } from "./GenericDataTable";
import "../../styles/livestock-table.css";
import { StatusCell } from "./StatusCell";

const COLUMNS = [
  { key: "livestock_id", label: "Animal", sortable: true },
  { key: "claim_type", label: "Claim Type", sortable: true },
  { key: "cause", label: "Cause", sortable: false },
  { key: "farm_name", label: "Farm", sortable: true },
  { key: "date_of_incident", label: "Date of Incident", sortable: true },
  { key: "claim_amount", label: "Amount", sortable: true },
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
    case "claim_amount":
      return row.claim_amount != null
        ? `R ${Number(row.claim_amount).toLocaleString()}`
        : "-";
    case "date_of_incident":
      return row.date_of_incident
        ? new Date(row.date_of_incident).toLocaleDateString()
        : "-";
    case "cause":
      return row.cause && row.cause.length > 60
        ? `${row.cause.slice(0, 60)}…`
        : row.cause || "-";
    default:
      return row[col.key] ?? "-";
  }
}

export function ClaimsTable({ rows, onView, onEdit, onHistory, onStatusChange }) {
  return (
    <GenericDataTable
      rows={rows}
      columns={COLUMNS}
      renderCell={renderCell}
      searchPlaceholder="Search claims..."
      searchKeys={["claim_type", "cause", "farm_name", "status"]}
      emptyMessage="No claims match your search."
      exportFilename="claims"
      onView={onView}
      onEdit={onEdit}
      onHistory={onHistory}
      onStatusChange={onStatusChange}
    />
  );
}
