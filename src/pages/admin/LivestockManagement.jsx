import { StatBlockRow } from "../../component/StatBlockRaw";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";
import { LivestockFilters } from "../../component/admin/LivestockFilters";
import { LivestockTable } from "../../component/admin/LivestockTable";
import { LivestockModal } from "../../component/LivestockModal";
import "../../styles/admin-management.css";

const ANIMALS_URL = "onboarding/animal/admin/all";
const FARMS_URL = "onboarding/farm_profile/admin/all";
const INSPECTIONS_URL = "onboarding/inspection/admin/all";

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
  const [inspections, setInspections] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

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

  useEffect(() => {
    apiFetch(INSPECTIONS_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setInspections(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const farmById = {};
  farmProfiles.forEach((f) => {
    farmById[f.id] = f;
  });

  // livestock_id -> most recent inspection_date. AnimalInspection.livestock_id
  // is unique today (one inspection per animal), so this is just a direct
  // lookup in practice — written to take the latest date defensively in
  // case that constraint is ever relaxed.
  const lastInspectionByAnimal = {};
  inspections.forEach((insp) => {
    const existing = lastInspectionByAnimal[insp.livestock_id];
    if (!existing || new Date(insp.inspection_date) > new Date(existing)) {
      lastInspectionByAnimal[insp.livestock_id] = insp.inspection_date;
    }
  });

  // Joins each animal with its farm's name/province and its most recent
  // inspection date before anything downstream (filtering, the table)
  // sees it — LivestockTable's columns read row.farm_name / row.province /
  // row.last_inspection_date directly, none of which exist on the raw
  // Animal record from the backend.
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
      last_inspection_date: lastInspectionByAnimal[animal.id],
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

  const aliveCount = animals.filter(
    (a) => (a.status || "Alive") === "Alive",
  ).length;
  const sickCount = animals.filter((a) => a.status === "Sick").length;
  const deceasedCount = animals.filter((a) => a.status === "Deceased").length;

  useEffect(() => {
    setLivestockCount?.(filteredAnimals.length);
  }, [filteredAnimals.length, setLivestockCount]);

  return (
    <div className="livestock-management-page">
      <StatBlockRow
        stats={[
          { value: animals.length, label: "Total Livestock", tone: "neutral" },
          { value: aliveCount, label: "Alive", tone: "success" },
          { value: sickCount, label: "Sick", tone: "warning" },
          { value: deceasedCount, label: "Deceased", tone: "danger" },
        ]}
      />

      <div className="filters-section">
        <LivestockFilters
          filters={filters}
          setFilters={setFilters}
          farms={farmProfiles}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />
      </div>

      <div className="table-section">
        <LivestockTable
          rows={filteredAnimals}
          onView={(animal) => setSelectedAnimal(animal)}
        />
      </div>

      {selectedAnimal && (
        <LivestockModal
          open={!!selectedAnimal}
          setOpen={(isOpen) => !isOpen && setSelectedAnimal(null)}
          livestock={selectedAnimal}
        />
      )}
    </div>
  );
}
