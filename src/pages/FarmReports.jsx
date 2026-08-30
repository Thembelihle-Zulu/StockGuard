import { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import PetsIcon from "@mui/icons-material/Pets";
import PaidIcon from "@mui/icons-material/Paid";
import DescriptionIcon from "@mui/icons-material/Description";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import { apiFetch } from "../utils/api";
import { KpiCard } from "../component/admin/KPICard";
import { DashboardPanel } from "../component/DashboardPanel";
import { StatBlockRow } from "../component/StatBlockRaw";
import { LivestockPortfolioList } from "./LivestockPortfolioList";
import "../styles/claims-list.css";
import "../styles/farm-dashboard.css";

const CLAIM_STATUS_LABEL = { pending: "Pending", approved: "Approved", denied: "Denied" };
const INSPECTION_STATUS_LABEL = {
  pending: "Pending",
  approved: "Approved",
  denied: "Changes Requested",
};

export function FarmReports() {
  const [animals, setAnimals] = useState([]);
  const [claims, setClaims] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    apiFetch("onboarding/animal")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setAnimals(Array.isArray(data) ? data : []))
      .catch(console.error);

    apiFetch("claims")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setClaims(Array.isArray(data) ? data : []))
      .catch(console.error);

    apiFetch("onboarding/inspection")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setInspections(Array.isArray(data) ? data : []))
      .catch(console.error);

    apiFetch("payments")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setPayments(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const speciesBreakdown = useMemo(() => {
    const counts = {};
    animals.forEach((a) => {
      counts[a.species] = (counts[a.species] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [animals]);

  const totalInsuredValue = useMemo(
    () => animals.reduce((sum, a) => sum + (a.estimated_value || 0), 0),
    [animals],
  );

  const claimCounts = useMemo(() => {
    const counts = { pending: 0, approved: 0, denied: 0 };
    claims.forEach((c) => {
      const key = (c.status || "pending").toLowerCase();
      if (counts[key] !== undefined) counts[key] += 1;
    });
    return counts;
  }, [claims]);

  const inspectionCounts = useMemo(() => {
    const counts = { pending: 0, approved: 0, denied: 0 };
    inspections.forEach((i) => {
      const key = (i.status || "pending").toLowerCase();
      if (counts[key] !== undefined) counts[key] += 1;
    });
    return counts;
  }, [inspections]);

  const totalPremiumsPaid = useMemo(
    () =>
      payments
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    [payments],
  );
  const totalClaimsPaidOut = useMemo(
    () =>
      claims
        .filter((c) => (c.status || "").toLowerCase() === "approved")
        .reduce((sum, c) => sum + (Number(c.claim_amount) || 0), 0),
    [claims],
  );

  const kpis = [
    {
      icon: <PetsIcon />,
      value: animals.length,
      label: "Total Livestock",
      subText: `Across ${speciesBreakdown.length} species`,
    },
    {
      icon: <PaidIcon />,
      value: `R ${totalInsuredValue.toLocaleString()}`,
      label: "Total Insured Value",
      subText: "Based on registered animals",
    },
    {
      icon: <DescriptionIcon />,
      value: `R ${totalPremiumsPaid.toLocaleString()}`,
      label: "Total Premiums Paid",
      subText: "From completed payments",
    },
    {
      icon: <RequestQuoteIcon />,
      value: `R ${totalClaimsPaidOut.toLocaleString()}`,
      label: "Total Claims Paid Out",
      subText: "Approved claims",
      accent: "#8D6E63",
      accentBg: "#F4EDE8",
    },
  ];

  return (
    <section className="claims-page">
      <div className="claims-page-header">
        <h2 className="claims-page-title">Reports</h2>
      </div>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpis.map((kpi) => (
          <Grid key={kpi.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <KpiCard {...kpi} />
          </Grid>
        ))}
      </Grid>

      <div className="farm-dashboard-row">
        <DashboardPanel
          title="Livestock by Species"
          subtitle={`${animals.length} animals across ${speciesBreakdown.length} species`}
          className="farm-dashboard-row-item"
        >
          <LivestockPortfolioList species={speciesBreakdown} />
        </DashboardPanel>

        <DashboardPanel
          title="Claims by Status"
          subtitle={`${claims.length} claims total`}
          className="farm-dashboard-row-item"
        >
          <StatBlockRow
            stats={[
              { value: claimCounts.pending, label: CLAIM_STATUS_LABEL.pending, tone: "warning" },
              { value: claimCounts.approved, label: CLAIM_STATUS_LABEL.approved, tone: "success" },
              { value: claimCounts.denied, label: CLAIM_STATUS_LABEL.denied, tone: "danger" },
            ]}
          />
        </DashboardPanel>
      </div>

      <div className="farm-dashboard-row">
        <DashboardPanel
          title="Inspections by Status"
          subtitle={`${inspections.length} inspections total`}
          className="farm-dashboard-row-item"
        >
          <StatBlockRow
            stats={[
              {
                value: inspectionCounts.pending,
                label: INSPECTION_STATUS_LABEL.pending,
                tone: "warning",
              },
              {
                value: inspectionCounts.approved,
                label: INSPECTION_STATUS_LABEL.approved,
                tone: "success",
              },
              {
                value: inspectionCounts.denied,
                label: INSPECTION_STATUS_LABEL.denied,
                tone: "danger",
              },
            ]}
          />
        </DashboardPanel>
      </div>
    </section>
  );
}
