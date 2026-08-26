import Grid from "@mui/material/Grid";
import PetsIcon from "@mui/icons-material/Pets";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";
import { KpiCard } from "../../component/admin/KPICard";
import { DashboardPanel } from "../../component/DashboardPanel";
import { StatBlockRow } from "../../component/StatBlockRaw";
import { LivestockPortfolioList } from "../LivestockPortfolioList";
import "../../styles/Adminoverview.css";

function countByStatus(rows, statuses) {
  const counts = {};
  statuses.forEach((s) => (counts[s] = 0));
  rows.forEach((row) => {
    if (counts[row.status] !== undefined) counts[row.status] += 1;
  });
  return counts;
}

export function ReportsManagement() {
  const [farmProfiles, setFarmProfiles] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [claims, setClaims] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    apiFetch("onboarding/farm_profile/admin/all")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setFarmProfiles(Array.isArray(data) ? data : []))
      .catch(console.error);

    apiFetch("onboarding/animal/admin/all")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setAnimals(Array.isArray(data) ? data : []))
      .catch(console.error);

    apiFetch("claims/admin/all")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setClaims(Array.isArray(data) ? data : []))
      .catch(console.error);

    apiFetch("onboarding/inspection/admin/all")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setInspections(Array.isArray(data) ? data : []))
      .catch(console.error);

    apiFetch("onboarding/policy/admin/all")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setPolicies(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // Same recompute-on-render approach as AdminOverview — small,
  // admin-side lists fetched once, no useMemo needed.
  const speciesCounts = {};
  animals.forEach((a) => {
    speciesCounts[a.species] = (speciesCounts[a.species] || 0) + 1;
  });
  const speciesBreakdown = Object.entries(speciesCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const claimCounts = countByStatus(
    claims.map((c) => ({ status: (c.status || "pending").toLowerCase() })),
    ["pending", "approved", "denied"],
  );
  const inspectionCounts = countByStatus(
    inspections.map((i) => ({ status: (i.status || "pending").toLowerCase() })),
    ["pending", "approved", "denied"],
  );
  const policyCounts = countByStatus(policies, ["Active", "Cancelled", "Expired"]);

  const kpis = [
    {
      icon: <AgricultureIcon />,
      value: farmProfiles.length,
      label: "Registered Farms",
      subText: "Active policy holders",
      trend: "—",
    },
    {
      icon: <PetsIcon />,
      value: animals.length,
      label: "Total Livestock",
      subText: `Across ${farmProfiles.length} farms`,
      trend: "—",
    },
    {
      icon: <AssignmentIcon />,
      value: claims.length,
      label: "Total Claims",
      subText: "All time",
      trend: "—",
    },
    {
      icon: <DescriptionIcon />,
      value: policies.length,
      label: "Total Policies",
      subText: "All time",
      trend: "—",
    },
  ];

  return (
    <div className="admin-overview-page">
      <div className="admin-overview-header">
        <h1 className="admin-overview-title">Reports</h1>
        <p className="admin-overview-subtitle">
          Aggregate figures across every registered farm.
        </p>
      </div>

      <Grid container spacing={3} className="admin-overview-kpi-grid">
        {kpis.map((kpi) => (
          <Grid key={kpi.label} size={{ xs: 12, md: 6, lg: 3 }}>
            <KpiCard {...kpi} />
          </Grid>
        ))}
      </Grid>

      <div className="admin-overview-row">
        <DashboardPanel
          title="Livestock by Species"
          subtitle={`${animals.length} animals across ${speciesBreakdown.length} species`}
          className="admin-overview-row-item"
        >
          <LivestockPortfolioList species={speciesBreakdown} />
        </DashboardPanel>

        <DashboardPanel
          title="Claims by Status"
          subtitle={`${claims.length} claims total`}
          className="admin-overview-row-item"
        >
          <StatBlockRow
            stats={[
              { value: claimCounts.pending, label: "Pending", tone: "warning" },
              { value: claimCounts.approved, label: "Approved", tone: "success" },
              { value: claimCounts.denied, label: "Rejected", tone: "danger" },
            ]}
          />
        </DashboardPanel>
      </div>

      <div className="admin-overview-row">
        <DashboardPanel
          title="Inspections by Status"
          subtitle={`${inspections.length} inspections total`}
          className="admin-overview-row-item"
        >
          <StatBlockRow
            stats={[
              {
                value: inspectionCounts.pending,
                label: "Pending",
                tone: "warning",
              },
              {
                value: inspectionCounts.approved,
                label: "Approved",
                tone: "success",
              },
              { value: inspectionCounts.denied, label: "Denied", tone: "danger" },
            ]}
          />
        </DashboardPanel>

        <DashboardPanel
          title="Policies by Status"
          subtitle={`${policies.length} policies total`}
          className="admin-overview-row-item"
        >
          <StatBlockRow
            stats={[
              { value: policyCounts.Active, label: "Active", tone: "success" },
              {
                value: policyCounts.Cancelled,
                label: "Cancelled",
                tone: "danger",
              },
              { value: policyCounts.Expired, label: "Expired", tone: "warning" },
            ]}
          />
        </DashboardPanel>
      </div>
    </div>
  );
}
