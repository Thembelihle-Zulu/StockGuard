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
  claimType: "",
  status: "",
  dateFrom: "",
  dateTo: "",
};

export function ClaimsFilters({ filters, setFilters, onClear }) {
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
      title="Claims"
      activeCount={activeCount}
      onClear={clearFilters}
      showAdvanced={showAdvanced}
      onToggleAdvanced={() => setShowAdvanced((v) => !v)}
      advanced={
        <>
          <TextField
            type="date"
            label="Incident From"
            InputLabelProps={{ shrink: true }}
            value={filters.dateFrom}
            onChange={handleChange("dateFrom")}
          />

          <TextField
            type="date"
            label="Incident To"
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
        placeholder="Cause"
      />

      <FormControl>
        <InputLabel>Claim Type</InputLabel>
        <Select
          value={filters.claimType}
          label="Claim Type"
          onChange={handleChange("claimType")}
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="Treatment Claim">Treatment Claim</MenuItem>
          <MenuItem value="Mortality Claim">Mortality Claim</MenuItem>
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
    </FilterPanel>
  );
}
