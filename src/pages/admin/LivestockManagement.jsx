import Grid from "@mui/material/Grid";
import PetsIcon from "@mui/icons-material/Pets";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import { KpiCard } from "../../component/admin/KPICard";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/uploadFile";
import { LivestockFilters } from "../../component/admin/LivestockFilters";
import { LivestockTable } from "../../component/admin/LivestockTable";
import "../../styles/admin-management.css";
const ANIMALS_URL = "onboarding/animal/admin/all";
const FARMS_URL = "onboarding/farm_profile/admin/all";

const EMPTY_FILTERS = {
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

export function LivestockManagement({ setLivestockCount }) {
  const [animals, setAnimals] = useState([]);
  const [farmProfiles, setFarmProfiles] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  useEffect(() => {
    apiFetch(ANIMALS_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setAnimals(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    apiFetch(FARMS_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setFarmProfiles(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const farmById = {};
  farmProfiles.forEach((f) => {
    farmById[f.id] = f;
  });

  // Joins each animal with its farm's name/province before anything
  // downstream (filtering, the table) sees it — LivestockTable's
  // columns read row.farm_name / row.province directly, which don't
  // exist on the raw Animal record from the backend.
  //
  // province is assumed to be the field name on FarmProfile, matching
  // every other file that's used it (the onboarding provinces list,
  // FarmProfile.jsx) — unverified against the real
  // FarmProfile.to_dict() keys, confirm this if provinces don't show.
  //
  // farm_owner is left out entirely rather than guessed — nothing
  // available here gives an owner's name distinct from the farm
  // itself; LivestockTable already renders that field as optional.
  const joinedAnimals = animals.map((animal) => {
    const farm = farmById[animal.farm_profile_id];
    return {
      ...animal,
      farm_name: farm?.farm_name,
      province: farm?.province,
    };
  });

  // Client-side filtering — the whole admin animal list is small
  // enough to fetch once and filter in memory; see the note in
  // LivestockFilters.jsx for why this beats server-side filtering at
  // this scale.
  const filteredAnimals = joinedAnimals.filter((animal) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchesSearch =
        animal.tag_number?.toLowerCase().includes(q) ||
        animal.breed?.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    if (filters.farm && animal.farm_profile_id !== filters.farm) {
      return false;
    }

    if (filters.species && animal.species !== filters.species) {
      return false;
    }

    if (filters.status && animal.status !== filters.status) {
      return false;
    }

    if (filters.breed) {
      const q = filters.breed.toLowerCase();
      if (!animal.breed?.toLowerCase().includes(q)) return false;
    }

    if (filters.province && animal.province !== filters.province) {
      return false;
    }

    if (filters.registeredFrom) {
      if (
        !animal.created_date ||
        animal.created_date < filters.registeredFrom
      ) {
        return false;
      }
    }

    if (filters.registeredTo) {
      if (!animal.created_date || animal.created_date > filters.registeredTo) {
        return false;
      }
    }

    return true;
  });

  useEffect(() => {
    setLivestockCount?.(filteredAnimals.length);
  }, [filteredAnimals.length, setLivestockCount]);

  return (
    <div className="livestock-management-page">
      <Grid container spacing={3} className="kpi-grid">
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <KpiCard
            icon={<PetsIcon />}
            value={animals.length}
            label="Total Livestock"
            subText={`Across ${farmProfiles.length} farms`}
            trend="3.4%"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <KpiCard
            icon={<AssignmentIcon />}
            value="127"
            label="Open Claims"
            subText="Awaiting review"
            trend="12%"
            accent="#8D6E63"
            accentBg="#F4EDE8"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <KpiCard
            icon={<AgricultureIcon />}
            value={farmProfiles.length}
            label="Registered Farms"
            subText="Active policy holders"
            trend="5.1%"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <KpiCard
            icon={<HealthAndSafetyIcon />}
            value="18"
            label="Pending Inspections"
            subText="Need review"
            trend="2%"
            trendDirection="down"
          />
        </Grid>
      </Grid>

      <div className="filters-section">
        <LivestockFilters
          filters={filters}
          setFilters={setFilters}
          farms={farmProfiles}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />
      </div>

      <div className="table-section">
        <LivestockTable rows={filteredAnimals} />
      </div>
    </div>
  );
}
