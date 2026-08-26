import Grid from "@mui/material/Grid";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { KpiCard } from "../../component/admin/KPICard";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";
import { InspectionsFilters } from "../../component/admin/InspectionFilters";
import { InspectionsTable } from "../../component/admin/InspectionsTable";
import { InspectionModal } from "../../component/admin/InspectionModal";
import "../../styles/admin-management.css";

const INSPECTIONS_URL = "onboarding/inspection/admin/all";
const ANIMALS_URL = "onboarding/animal/admin/all";
const FARMS_URL = "onboarding/farm_profile/admin/all";

const EMPTY_FILTERS = {
  search: "",
  farm: "",
  status: "",
  dateFrom: "",
  dateTo: "",
};

export function InspectionsManagement() {
  const [inspections, setInspections] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [farmProfiles, setFarmProfiles] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedInspection, setSelectedInspection] = useState(null);

  useEffect(() => {
    apiFetch(INSPECTIONS_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setInspections(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

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

  const animalById = {};
  animals.forEach((a) => {
    animalById[a.id] = a;
  });

  const farmById = {};
  farmProfiles.forEach((f) => {
    farmById[f.id] = f;
  });

  // Two-hop join, same pattern as ClaimsManagement: inspection ->
  // animal (via livestock_id) -> farm (via the animal's
  // farm_profile_id). Inspection itself has no tag_number or farm
  // reference at all.
  const joinedInspections = inspections.map((inspection) => {
    const animal = animalById[inspection.livestock_id];
    const farm = animal ? farmById[animal.farm_profile_id] : undefined;
    return {
      ...inspection,
      tag_number: animal?.tag_number,
      species: animal?.species,
      farm_id: farm?.id,
      farm_name: farm?.farm_name,
    };
  });

  const filteredInspections = joinedInspections.filter((inspection) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!inspection.tag_number?.toLowerCase().includes(q)) return false;
    }

    if (filters.farm && inspection.farm_id !== filters.farm) {
      return false;
    }

    if (filters.status && inspection.status !== filters.status) {
      return false;
    }

    if (filters.dateFrom) {
      if (
        !inspection.inspection_date ||
        inspection.inspection_date < filters.dateFrom
      ) {
        return false;
      }
    }

    if (filters.dateTo) {
      if (
        !inspection.inspection_date ||
        inspection.inspection_date > filters.dateTo
      ) {
        return false;
      }
    }

    return true;
  });

  const pendingCount = inspections.filter(
    (i) => (i.status || "pending").toLowerCase() === "pending",
  ).length;
  const approvedCount = inspections.filter(
    (i) => i.status?.toLowerCase() === "approved",
  ).length;
  const deniedCount = inspections.filter(
    (i) => i.status?.toLowerCase() === "denied",
  ).length;

  const handleStatusChange = (inspectionId, status) => {
    apiFetch(`onboarding/inspection/admin/${inspectionId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
      .then((res) => {
        if (!res.ok) {
          return Promise.reject("Failed to update");
        }
        return res.json();
      })
      .then((updated) => {
        setInspections((prev) =>
          prev.map((i) => (i.id === updated.id ? updated : i)),
        );
      })
      .catch(console.error);
  };

  return (
    <div className="livestock-management-page">
      <Grid container spacing={3} className="kpi-grid">
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <KpiCard
            icon={<AssignmentIcon />}
            value={inspections.length}
            label="Total Inspections"
            subText="All time"
            trend="—"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <KpiCard
            icon={<HourglassEmptyIcon />}
            value={pendingCount}
            label="Pending Review"
            subText="Awaiting review"
            trend="—"
            accent="#8D6E63"
            accentBg="#F4EDE8"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <KpiCard
            icon={<CheckCircleIcon />}
            value={approvedCount}
            label="Approved Inspections"
            subText="Cleared"
            trend="—"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <KpiCard
            icon={<CancelIcon />}
            value={deniedCount}
            label="Denied Inspections"
            subText="Not approved"
            trend="—"
            trendDirection="down"
          />
        </Grid>
      </Grid>

      <div className="filters-section">
        <InspectionsFilters
          filters={filters}
          setFilters={setFilters}
          farms={farmProfiles}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />
      </div>

      <div className="table-section">
        <InspectionsTable
          rows={filteredInspections}
          onView={(inspection) => setSelectedInspection(inspection)}
          onStatusChange={handleStatusChange}
        />
      </div>

      {selectedInspection && (
        <InspectionModal
          open={!!selectedInspection}
          setOpen={(isOpen) => !isOpen && setSelectedInspection(null)}
          inspection={selectedInspection}
        />
      )}
    </div>
  );
}
