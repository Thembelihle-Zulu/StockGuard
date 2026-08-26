import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import PetsIcon from "@mui/icons-material/Pets";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BoltIcon from "@mui/icons-material/Bolt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { apiFetch } from "../../utils/api";
import { KpiCard } from "../../component/admin/KPICard";
import { DashboardPanel } from "../../component/DashboardPanel";
import { QuickActionsGrid } from "../../component/QuickActionsGrid";
import { ClaimsOverviewCard } from "../../component/ClaimsOverviewCard";
import { LivestockPortfolioList } from "../LivestockPortfolioList";
import "../../styles/AdminOverview.css";

const STATUS_LABEL = {
  pending: "Pending",
  approved: "Approved",
  denied: "Rejected",
};

// NOTE: there's no admin/all route for policies yet (unlike animal, farm
// profile, and claim, which all already have one) — a policy KPI/panel
// is deliberately left out here rather than guessed. Add
// GET /onboarding/policy/admin/all on the backend first, then this can
// gain a "Total Active Policies" KPI the same way the other three work.
export function AdminOverview({
  onToggleClaims,
  onToggleLivestock,
  onToggleReports,
}) {
  const [farmProfiles, setFarmProfiles] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [claims, setClaims] = useState([]);

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
  }, []);

  // Plain values recomputed each render — these lists are small
  // (admin-side, fetched once), so there's no real cost to skipping
  // useMemo here.
  const speciesCounts = {};
  animals.forEach((a) => {
    speciesCounts[a.species] = (speciesCounts[a.species] || 0) + 1;
  });
  const speciesBreakdown = Object.entries(speciesCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const claimCounts = { pending: 0, approved: 0, denied: 0 };
  claims.forEach((c) => {
    const key = (c.status || "pending").toLowerCase();
    if (claimCounts[key] !== undefined) claimCounts[key] += 1;
  });

  const recentClaims = [...claims]
    .sort((a, b) => new Date(b.date_of_incident) - new Date(a.date_of_incident))
    .slice(0, 4)
    .map((c) => {
      const key = (c.status || "pending").toLowerCase();
      return {
        id: c.id,
        description: `${c.claim_type} — ${c.cause}`,
        amount: c.claim_amount,
        status: key,
        statusLabel: STATUS_LABEL[key] || c.status,
      };
    });

  const kpis = [
    {
      icon: <PetsIcon />,
      value: animals.length,
      label: "Total Livestock",
      subText: `Across ${farmProfiles.length} farms`,
      trend: "—",
    },
    {
      icon: <AgricultureIcon />,
      value: farmProfiles.length,
      label: "Registered Farms",
      subText: "Active policy holders",
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
      icon: <BoltIcon />,
      value: claimCounts.pending,
      label: "Open Claims",
      subText: "Awaiting review",
      trend: "—",
      accent: "#8D6E63",
      accentBg: "#F4EDE8",
    },
  ];

  const quickActions = [
    {
      icon: <VisibilityIcon />,
      label: "Review Livestock",
      subLabel: "Browse and filter all animals",
      onClick: onToggleLivestock,
    },
    {
      icon: <AssignmentIcon />,
      label: "Review Claims",
      subLabel: "Approve or deny pending claims",
      onClick: onToggleClaims,
    },
    {
      icon: <DownloadIcon />,
      label: "View Reports",
      subLabel: "Platform-wide summary",
      onClick: onToggleReports,
    },
  ];

  return (
    <div className="admin-overview-page">
      <div className="admin-overview-header">
        <h1 className="admin-overview-title">Admin Overview</h1>
        <p className="admin-overview-subtitle">
          A summary across every registered farm.
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
          title="Livestock Overview"
          subtitle={`${animals.length} animals across ${speciesBreakdown.length} species`}
          className="admin-overview-row-item"
        >
          <LivestockPortfolioList species={speciesBreakdown} />
        </DashboardPanel>

        <DashboardPanel
          title="Quick Actions"
          subtitle="Jump to a review queue"
          className="admin-overview-row-item"
        >
          <QuickActionsGrid actions={quickActions} />
        </DashboardPanel>
      </div>

      <div className="admin-overview-row">
        <ClaimsOverviewCard
          stats={[
            { value: claimCounts.pending, label: "Pending", tone: "warning" },
            { value: claimCounts.approved, label: "Approved", tone: "success" },
            { value: claimCounts.denied, label: "Rejected", tone: "danger" },
          ]}
          claims={recentClaims}
          onToggleClaims={onToggleClaims}
        />
      </div>
    </div>
  );
}
