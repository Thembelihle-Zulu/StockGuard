// Plain CSV, not a real .xlsx — Excel opens .csv natively (double-click
// just works), so this covers "export to Excel" without a charting/xlsx
// library or any backend involvement. Reused by every admin table via
// GenericDataTable.jsx, rather than each page building its own export.
function csvCell(value) {
  const str = value == null ? "" : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function downloadCsv(rows, columns, filename = "export") {
  const header = columns.map((col) => csvCell(col.label)).join(",");
  const lines = rows.map((row) =>
    columns.map((col) => csvCell(row[col.key])).join(","),
  );
  const csvContent = [header, ...lines].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
