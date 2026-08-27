import { useEffect, useState } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { apiFetch } from "../../utils/api";
import { DashboardPanel } from "../../component/DashboardPanel";
import { QuickActionsGrid } from "../../component/QuickActionsGrid";
import { ClaimsOverviewCard } from "../../component/ClaimsOverviewCard";
import { AttentionQueueCard } from "../../component/AttentionQueueCard";
import { StatBlockRow } from "../../component/StatBlockRaw";
import { LivestockPortfolioList } from "../LivestockPortfolioList";
import "../../styles/AdminOverview.css";

const STATUS_LABEL = {
  pending: "Pending",
  approved: "Approved",
  denied: "Rejected",
};

// NOTE: there's no admin/all route for policies yet (unlike animal, farm
// profile, claim, and inspection, which all already have one) — a policy
// stat/panel is deliberately left out here rather than guessed. Add
// GET /onboarding/policy/admin/all on the backend first, then this can
// gain a "Total Active Policies" figure the same way the others work.
export function AdminOverview({
  onToggleClaims,
  onToggleLivestock,
  onToggleInspections,
  onToggleReports,
}) {
  const [farmProfiles, setFarmProfiles] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [claims, setClaims] = useState([]);
  const [inspections, setInspections] = useState([]);

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

  const pendingInspections = inspections.filter(
    (i) => (i.status || "pending").toLowerCase() === "pending",
  ).length;

  const attentionItems = [
    {
      label: `Pending claim${claimCounts.pending === 1 ? "" : "s"}`,
      count: claimCounts.pending,
      onClick: onToggleClaims,
    },
    {
      label: `Pending inspection${pendingInspections === 1 ? "" : "s"}`,
      count: pendingInspections,
      onClick: onToggleInspections,
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
        <div>
          <h1 className="admin-overview-title">Admin Overview</h1>
          <p className="admin-overview-subtitle">
            A summary across every registered farm.
          </p>
        </div>
        <StatBlockRow
          stats={[
            { value: animals.length, label: "Livestock", tone: "neutral" },
            { value: farmProfiles.length, label: "Farms", tone: "neutral" },
            { value: claims.length, label: "Claims to date", tone: "neutral" },
          ]}
        />
      </div>

      <AttentionQueueCard items={attentionItems} />

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
