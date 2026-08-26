import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import "../../Livestocktable.css";

export function GenericDataTable({
  rows,
  columns,
  renderCell,
  getRowId = (row) => row.id,
  searchPlaceholder = "Search...",
  searchKeys,
  emptyMessage = "No records match your search.",
  onAdd,
  addLabel = "Add",
  onExport,
  onView,
  onEdit,
  onHistory,
  showActionsColumn = true,
  onStatusChange,
}) {
  const [orderBy, setOrderBy] = useState(columns[0]?.key);
  const [orderDirection, setOrderDirection] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const effectiveSearchKeys = searchKeys || columns.map((c) => c.key);

  const handleSort = (key) => {
    if (orderBy === key) {
      setOrderDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(key);
      setOrderDirection("asc");
    }
  };

  const searchedRows = !search
    ? rows
    : rows.filter((row) =>
        effectiveSearchKeys.some((key) =>
          String(row[key] ?? "")
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
      );

  const sortedRows = [...searchedRows].sort((a, b) => {
    const aVal = a[orderBy] ?? "";
    const bVal = b[orderBy] ?? "";
    if (aVal < bVal) return orderDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return orderDirection === "asc" ? 1 : -1;
    return 0;
  });

  const pageStart = page * rowsPerPage;
  const pagedRows = sortedRows.slice(pageStart, pageStart + rowsPerPage);

  const allPageIds = pagedRows.map(getRowId);
  const allPageSelected =
    allPageIds.length > 0 && allPageIds.every((id) => selected.includes(id));
  const somePageSelected = allPageIds.some((id) => selected.includes(id));

  const toggleSelectAll = () => {
    if (allPageSelected) {
      setSelected((prev) => prev.filter((id) => !allPageIds.includes(id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...allPageIds])]);
    }
  };

  const toggleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const hasRowActions = onView || onEdit || onHistory;

  return (
    <Box className="livestock-table-container">
      <Box className="table-toolbar">
        <TextField
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          size="small"
          className="table-search-field"
        />
        <Box className="table-toolbar-actions">
          {onExport && (
            <Button
              startIcon={<DownloadIcon />}
              onClick={onExport}
              className="table-export-btn"
            >
              Export
            </Button>
          )}
          {onAdd && (
            <Button
              startIcon={<AddIcon />}
              onClick={onAdd}
              className="table-add-btn"
            >
              {addLabel}
            </Button>
          )}
        </Box>
      </Box>

      <TableContainer className="livestock-table-scroll">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                padding="checkbox"
                className="livestock-table-head-cell"
              >
                <Checkbox
                  indeterminate={somePageSelected && !allPageSelected}
                  checked={allPageSelected}
                  onChange={toggleSelectAll}
                />
              </TableCell>
              {columns.map((col) => (
                <TableCell key={col.key} className="livestock-table-head-cell">
                  {col.sortable ? (
                    <TableSortLabel
                      active={orderBy === col.key}
                      direction={orderBy === col.key ? orderDirection : "asc"}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
              {showActionsColumn && (
                <TableCell className="livestock-table-head-cell">
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedRows.map((row) => {
              const rowId = getRowId(row);
              return (
                <TableRow key={rowId} hover className="livestock-table-row">
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(rowId)}
                      onChange={() => toggleSelectRow(rowId)}
                    />
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {renderCell
                        ? renderCell(row, col, onStatusChange)
                        : (row[col.key] ?? "-")}
                    </TableCell>
                  ))}
                  {showActionsColumn && (
                    <TableCell>
                      <Box className="row-actions">
                        {onView && (
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              onClick={() => onView(row)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onEdit && (
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => onEdit(row)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onHistory && (
                          <Tooltip title="History">
                            <IconButton
                              size="small"
                              onClick={() => onHistory(row)}
                            >
                              <HistoryIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            {pagedRows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1 + (showActionsColumn ? 1 : 0)}
                  className="empty-row"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sortedRows.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </Box>
  );
}
