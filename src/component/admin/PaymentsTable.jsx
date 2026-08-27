import { GenericDataTable } from "./GenericDataTable";
import "../../styles/livestock-table.css";

const COLUMNS = [
  { key: "farm_name", label: "Farm", sortable: true },
  { key: "policy_number", label: "Policy #", sortable: true },
  { key: "amount", label: "Amount", sortable: true },
  { key: "payment_method", label: "Method", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "created_date", label: "Date", sortable: true },
];

function renderCell(row, col) {
  switch (col.key) {
    case "amount":
      return row.amount != null ? `R ${Number(row.amount).toLocaleString()}` : "-";
    case "status":
      return (
        <span className="status-pill status-pill--alive">{row.status}</span>
      );
    case "created_date":
      return row.created_date
        ? new Date(row.created_date).toLocaleDateString()
        : "-";
    default:
      return row[col.key] ?? "-";
  }
}

// Payments are historical facts, not something an admin edits — no
// status dropdown, no detail modal, just the list (matches how it was
// asked for).
export function PaymentsTable({ rows }) {
  return (
    <GenericDataTable
      rows={rows}
      columns={COLUMNS}
      renderCell={renderCell}
      searchPlaceholder="Search payments..."
      searchKeys={["farm_name", "policy_number", "payment_method", "status"]}
      emptyMessage="No payments match your search."
      exportFilename="payments"
      showActionsColumn={false}
    />
  );
}
