import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import "../../styles/admin-filters.css";

export function PoliciesFilters({ filters, setFilters, farms = [], onClear }) {
  const handleChange = (field) => (event) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const clearFilters = () => {
    setFilters({ search: "", farm: "", status: "" });
    onClear?.();
  };

  return (
    <div className="filters-panel">
      <div className="filters-grid">
        <TextField
          label="Search"
          value={filters.search}
          onChange={handleChange("search")}
          placeholder="Policy number"
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
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
            <MenuItem value="Expired">Expired</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="filters-actions">
        <Button color="error" onClick={clearFilters}>
          Clear
        </Button>
      </div>
    </div>
  );
}
