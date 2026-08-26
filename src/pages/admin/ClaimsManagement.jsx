import Grid from "@mui/material/Grid";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PaidIcon from "@mui/icons-material/Paid";
import { KpiCard } from "../../component/admin/KPICard";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";
import { ClaimsFilters } from "../../component/admin/ClaimsFilter";
import { ClaimsTable } from "../../component/admin/ClaimsTable";
import { ClaimModal } from "../../component/ClaimModal";
import "../../styles/admin-management.css";
const CLAIMS_URL = "claims/admin/all";
const ANIMALS_URL = "onboarding/animal/admin/all";
const FARMS_URL = "onboarding/farm_profile/admin/all";

const EMPTY_FILTERS = {
  search: "",
  farm: "",
  claimType: "",
  status: "",
  dateFrom: "",
  dateTo: "",
  minAmount: "",
  maxAmount: "",
};

export function ClaimsManagement() {
  const [claims, setClaims] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [farmProfiles, setFarmProfiles] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    apiFetch(CLAIMS_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setClaims(Array.isArray(data) ? data : []))
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

  // Plain lookup objects, rebuilt on every render. animals/farmProfiles
  // are small admin-side lists, so recomputing these each time React
  // re-renders this component costs nothing noticeable — no need for
  // useMemo here.
  const animalById = {};
  animals.forEach((a) => {
    animalById[a.id] = a;
  });

  const farmById = {};
  farmProfiles.forEach((f) => {
    farmById[f.id] = f;
  });

  // Two-hop join: claim -> animal (via livestock_id) -> farm (via the
  // animal's farm_profile_id). Claim itself has no farm reference at
  // all, so this is required before farm_name/farm_id can be used for
  // display or filtering. If animals/farmProfiles haven't loaded yet,
  // farm_name simply comes back undefined for that row until they do.
  const joinedClaims = claims.map((claim) => {
    const animal = animalById[claim.livestock_id];
    const farm = animal ? farmById[animal.farm_profile_id] : undefined;
    return {
      ...claim,
      farm_id: farm?.id,
      farm_name: farm?.farm_name,
    };
  });

  const filteredClaims = joinedClaims.filter((claim) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matches =
        claim.cause?.toLowerCase().includes(q) ||
        claim.livestock_id?.toLowerCase().includes(q);
      if (!matches) return false;
    }

    if (filters.farm && claim.farm_id !== filters.farm) {
      return false;
    }

    if (filters.claimType && claim.claim_type !== filters.claimType) {
      return false;
    }

    if (filters.status && claim.status !== filters.status) {
      return false;
    }

    if (filters.dateFrom) {
      if (
        !claim.date_of_incident ||
        claim.date_of_incident < filters.dateFrom
      ) {
        return false;
      }
    }

    if (filters.dateTo) {
      if (!claim.date_of_incident || claim.date_of_incident > filters.dateTo) {
        return false;
      }
    }

    if (filters.minAmount) {
      if (
        claim.claim_amount == null ||
        claim.claim_amount < Number(filters.minAmount)
      ) {
        return false;
      }
    }

    if (filters.maxAmount) {
      if (
        claim.claim_amount == null ||
        claim.claim_amount > Number(filters.maxAmount)
      ) {
        return false;
      }
    }

    return true;
  });

  const pendingCount = claims.filter(
    (c) => (c.status || "pending").toLowerCase() === "pending",
  ).length;
  const approvedCount = claims.filter(
    (c) => c.status?.toLowerCase() === "approved",
  ).length;
  const deniedCount = claims.filter(
    (c) => c.status?.toLowerCase() === "denied",
  ).length;
  const handleStatusChange = (claimId, status) => {
    apiFetch(`claims/admin/${claimId}`, {
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
        setClaims((prev) =>
          prev.map((claim) => (claim.id === updated.id ? updated : claim)),
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
            value={claims.length}
            label="Total Claims"
            subText="All time"
            trend="—"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <KpiCard
            icon={<PaidIcon />}
            value={pendingCount}
            label="Pending Claims"
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
            label="Approved Claims"
            subText="Paid or approved"
            trend="—"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <KpiCard
            icon={<CancelIcon />}
            value={deniedCount}
            label="Denied Claims"
            subText="Not approved"
            trend="—"
            trendDirection="down"
          />
        </Grid>
      </Grid>

      <div className="filters-section">
        <ClaimsFilters
          filters={filters}
          setFilters={setFilters}
          farms={farmProfiles}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />
      </div>

      <div className="table-section">
        <ClaimsTable
          rows={filteredClaims}
          onView={(claim) => setSelectedClaim(claim)}
          onStatusChange={handleStatusChange}
        />
      </div>

      {selectedClaim && (
        <ClaimModal
          open={!!selectedClaim}
          setOpen={(isOpen) => !isOpen && setSelectedClaim(null)}
          claim={selectedClaim}
        />
      )}
    </div>
  );
}
