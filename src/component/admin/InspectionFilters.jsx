import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Collapse,
} from "@mui/material";
import { useState } from "react";
import "../../styles/admin-filters.css";

export function InspectionsFilters({
  filters,
  setFilters,
  farms = [],
  onClear,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field) => (event) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      farm: "",
      status: "",
      dateFrom: "",
      dateTo: "",
    });
    onClear?.();
  };

  return (
    <div className="filters-panel">
      <div className="filters-grid">
        <TextField
          label="Search"
          value={filters.search}
          onChange={handleChange("search")}
          placeholder="Tag number"
        />

        <FormControl>
          <InputLabel>Farm</InputLabel>
          <Select
            value={filters.farm}
            label="Farm"
            onChange={handleChange("farm")}
          >
            <MenuItem value="">All Farms</MenuItem>
            {farms.map((farm) => (
              <MenuItem key={farm.id} value={farm.id}>
                {farm.farm_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={handleChange("status")}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="denied">Denied</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="filters-actions">
        <Button
          variant="outlined"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? "Fewer Filters" : "More Filters"}
        </Button>
        <Button color="error" onClick={clearFilters}>
          Clear
        </Button>
      </div>

      <Collapse in={showAdvanced}>
        <div className="filters-advanced">
          <div className="filters-advanced-grid">
            <TextField
              type="date"
              label="Inspected From"
              InputLabelProps={{ shrink: true }}
              value={filters.dateFrom}
              onChange={handleChange("dateFrom")}
            />
            <TextField
              type="date"
              label="Inspected To"
              InputLabelProps={{ shrink: true }}
              value={filters.dateTo}
              onChange={handleChange("dateTo")}
            />
          </div>
        </div>
      </Collapse>
    </div>
  );
}
