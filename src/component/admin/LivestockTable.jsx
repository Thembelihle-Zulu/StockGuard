import Box from "@mui/material/Box";
import { GenericDataTable } from "./GenericDataTable";
import "../../styles/livestock-table.css";
const STATUS_STYLES = {
  alive: { label: "Healthy", className: "status-pill status-pill--alive" },
  sick: { label: "Sick", className: "status-pill status-pill--sick" },
  deceased: {
    label: "Deceased",
    className: "status-pill status-pill--deceased",
  },
};

function StatusPill({ status }) {
  const key = status?.toLowerCase();
  const style = STATUS_STYLES[key] ?? {
    label: status || "Unknown",
    className: "status-pill status-pill--unknown",
  };
  return <span className={style.className}>{style.label}</span>;
}

const COLUMNS = [
  { key: "tag_number", label: "Tag Number", sortable: true },
  { key: "species", label: "Species", sortable: true },
  { key: "breed", label: "Breed", sortable: true },
  { key: "farm_name", label: "Farm", sortable: true },
  { key: "province", label: "Province", sortable: true },
  { key: "age", label: "Age", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "estimated_value", label: "Est. Value", sortable: true },
  { key: "last_inspection_date", label: "Last Inspection", sortable: true },
];

function renderCell(row, col) {
  switch (col.key) {
    case "tag_number":
      return <span className="tag-number-cell">{row.tag_number}</span>;
    case "species":
      return <span className="species-tag">{row.species}</span>;
    case "farm_name":
      return (
        <Box className="farm-cell">
          <span className="farm-cell-name">{row.farm_name}</span>
          {row.farm_owner && (
            <span className="farm-cell-owner">{row.farm_owner}</span>
          )}
        </Box>
      );
    case "status":
      return <StatusPill status={row.status} />;
    case "estimated_value":
      return row.estimated_value != null
        ? `R ${Number(row.estimated_value).toLocaleString()}`
        : "-";
    case "last_inspection_date":
      return row.last_inspection_date
        ? new Date(row.last_inspection_date).toLocaleDateString()
        : "-";
    default:
      return row[col.key] ?? "-";
  }
}

export function LivestockTable({ rows, onAddAnimal, onView, onEdit, onHistory }) {
  return (
    <GenericDataTable
      rows={rows}
      columns={COLUMNS}
      renderCell={renderCell}
      searchPlaceholder="Search livestock..."
      searchKeys={[
        "tag_number",
        "species",
        "breed",
        "farm_name",
        "province",
        "status",
      ]}
      emptyMessage="No livestock records match your search."
      onAdd={onAddAnimal}
      addLabel="Add Animal"
      exportFilename="livestock"
      onView={onView}
      onEdit={onEdit}
      onHistory={onHistory}
    />
  );
}
