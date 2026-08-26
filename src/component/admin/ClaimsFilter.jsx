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
export function ClaimsFilters({ filters, setFilters, farms = [], onClear }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      farm: "",
      claimType: "",
      status: "",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
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
          placeholder="Cause or animal"
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
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Denied">Denied</MenuItem>
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

            <TextField
              type="number"
              label="Min Amount (R)"
              value={filters.minAmount}
              onChange={handleChange("minAmount")}
            />

            <TextField
              type="number"
              label="Max Amount (R)"
              value={filters.maxAmount}
              onChange={handleChange("maxAmount")}
            />
          </div>
        </div>
      </Collapse>
    </div>
  );
}
