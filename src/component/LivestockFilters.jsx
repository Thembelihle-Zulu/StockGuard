import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { FilterPanel } from "./FilterPanel";

const EMPTY = {
  search: "",
  species: "",
  status: "",
};

export function LivestockFilters({ filters, setFilters, onClear }) {
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
    <FilterPanel title="Livestock" activeCount={activeCount} onClear={clearFilters}>
      <TextField
        label="Search"
        value={filters.search}
        onChange={handleChange("search")}
        placeholder="Tag number or breed"
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
          <MenuItem value="alive">Alive</MenuItem>
          <MenuItem value="sick">Sick</MenuItem>
          <MenuItem value="deceased">Deceased</MenuItem>
        </Select>
      </FormControl>
    </FilterPanel>
  );
}
