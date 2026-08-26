import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { FilterPanel } from "../FilterPanel";

const EMPTY = {
  search: "",
  farm: "",
  species: "",
  status: "",
  province: "",
  breed: "",
  registeredFrom: "",
  registeredTo: "",
  insuranceStatus: "",
};

export function LivestockFilters({ filters, setFilters, farms = [], onClear }) {
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
      title="Livestock"
      activeCount={activeCount}
      onClear={clearFilters}
      showAdvanced={showAdvanced}
      onToggleAdvanced={() => setShowAdvanced((v) => !v)}
      advanced={
        <>
          <FormControl>
            <InputLabel>Province</InputLabel>
            <Select
              value={filters.province}
              label="Province"
              onChange={handleChange("province")}
            >
              <MenuItem value="">All Provinces</MenuItem>
              <MenuItem value="Western Cape">Western Cape</MenuItem>
              <MenuItem value="Gauteng">Gauteng</MenuItem>
              <MenuItem value="KwaZulu-Natal">KwaZulu-Natal</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Breed"
            value={filters.breed}
            onChange={handleChange("breed")}
          />

          <TextField
            type="date"
            label="Registered From"
            InputLabelProps={{ shrink: true }}
            value={filters.registeredFrom}
            onChange={handleChange("registeredFrom")}
          />

          <TextField
            type="date"
            label="Registered To"
            InputLabelProps={{ shrink: true }}
            value={filters.registeredTo}
            onChange={handleChange("registeredTo")}
          />

          <FormControl>
            <InputLabel>Insurance Status</InputLabel>
            <Select
              value={filters.insuranceStatus}
              label="Insurance Status"
              onChange={handleChange("insuranceStatus")}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="insured">Fully Insured</MenuItem>
              <MenuItem value="partial">Partially Insured</MenuItem>
              <MenuItem value="uninsured">Uninsured</MenuItem>
              <MenuItem value="pending">Claim Pending</MenuItem>
            </Select>
          </FormControl>
        </>
      }
    >
      <TextField
        label="Search"
        value={filters.search}
        onChange={handleChange("search")}
        placeholder="Tag number or breed"
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
          <MenuItem value="Alive">Alive</MenuItem>
          <MenuItem value="Sick">Sick</MenuItem>
          <MenuItem value="Deceased">Deceased</MenuItem>
        </Select>
      </FormControl>
    </FilterPanel>
  );
}
