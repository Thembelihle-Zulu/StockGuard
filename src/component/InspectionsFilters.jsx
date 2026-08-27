import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { FilterPanel } from "./FilterPanel";

const EMPTY = {
  search: "",
  species: "",
  status: "",
  dateFrom: "",
  dateTo: "",
};

export function InspectionsFilters({ filters, setFilters, onClear }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field) => (event) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const activeCount = Object.entries(filters).filter(
    ([, value]) => value !== "" && value != null,
  ).length;

  const clearFilters = () => {
    setFilters(EMPTY);
    onClear?.();
  };

  return (
    <FilterPanel
      title="Inspections"
      activeCount={activeCount}
      onClear={clearFilters}
      showAdvanced={showAdvanced}
      onToggleAdvanced={() => setShowAdvanced((v) => !v)}
      advanced={
        <>
          <TextField
            type="date"
            label="Inspection From"
            InputLabelProps={{ shrink: true }}
            value={filters.dateFrom}
            onChange={handleChange("dateFrom")}
          />

          <TextField
            type="date"
            label="Inspection To"
            InputLabelProps={{ shrink: true }}
            value={filters.dateTo}
            onChange={handleChange("dateTo")}
          />
        </>
      }
    >
      <TextField
        label="Search"
        value={filters.search}
        onChange={handleChange("search")}
        placeholder="Tag number"
      />

      <FormControl>
        <InputLabel>Species</InputLabel>
        <Select
          value={filters.species}
          label="Species"
          onChange={handleChange("species")}
        >
          <MenuItem value="">All Species</MenuItem>
          <MenuItem value="Cattle">Cattle</MenuItem>
          <MenuItem value="Sheep">Sheep</MenuItem>
          <MenuItem value="Goat">Goat</MenuItem>
          <MenuItem value="Pig">Pig</MenuItem>
          <MenuItem value="Poultry">Poultry</MenuItem>
          <MenuItem value="Horse">Horse</MenuItem>
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
          <MenuItem value="denied">Changes Requested</MenuItem>
        </Select>
      </FormControl>
    </FilterPanel>
  );
}
