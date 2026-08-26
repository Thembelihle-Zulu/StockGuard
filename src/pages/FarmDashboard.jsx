import { useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import PetsIcon from "@mui/icons-material/Pets";
import PaidIcon from "@mui/icons-material/Paid";
import DescriptionIcon from "@mui/icons-material/Description";
import BoltIcon from "@mui/icons-material/Bolt";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DownloadIcon from "@mui/icons-material/Download";
import BarChartIcon from "@mui/icons-material/BarChart";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { apiFetch } from "../utils/api";
import { KpiCard } from "../component/admin/KPICard";
import { DashboardPanel } from "../component/DashboardPanel";
import { QuickActionsGrid } from "../component/QuickActionsGrid";
import { FarmHeaderBanner } from "./FarmHeaderBanner";
import { LivestockPortfolioList } from "./LivestockPortfolioList";
import { ActivePolicyCard } from "./ActivatePolicyCard";
import { ClaimsOverviewCard } from "../component/ClaimsOverviewCard";
import "../styles/farm-dashboard.css";
import { RegisterAnimal } from "../component/RegisterAnimal";
import { FileClaim } from "./FileClaim";

const STATUS_TONE = {
  pending: "warning",
  approved: "success",
  denied: "danger",
};
const STATUS_LABEL = {
  pending: "Pending",
  approved: "Approved",
  denied: "Rejected",
};
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));
export function FarmDashboard({ onToggleClaims }) {
  const [farmProfile, setFarmProfile] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const handleClaimAdded = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleAnimalAdded = () => setRefreshKey((k) => k + 1);
  const animalType = ["Cattle", "Sheep", "Goat", "Pig", "Poultry", "Horse"];
  useEffect(() => {
    apiFetch("onboarding/farm_profile/me")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then(setFarmProfile)
      .catch(console.error);

    apiFetch("onboarding/animal")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setAnimals(Array.isArray(data) ? data : []))
      .catch(console.error);

    apiFetch("onboarding/policy/")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setPolicies(Array.isArray(data) ? data : []))
      .catch(console.error);

    apiFetch("claims")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setClaims(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const activePolicy =
    policies.find((p) => p.status?.toLowerCase() === "active") || policies[0];

  const totalInsuredValue = useMemo(
    () => animals.reduce((sum, a) => sum + (a.estimated_value || 0), 0),
    [animals],
  );

  const speciesBreakdown = useMemo(() => {
    const counts = {};
    animals.forEach((a) => {
      counts[a.species] = (counts[a.species] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [animals]);

  const claimCounts = useMemo(() => {
    const counts = { pending: 0, approved: 0, denied: 0 };
    claims.forEach((c) => {
      const key = (c.status || "pending").toLowerCase();
      if (counts[key] !== undefined) counts[key] += 1;
    });
    return counts;
  }, [claims]);

  const recentClaims = useMemo(
    () =>
      [...claims]
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
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
        }),
    [claims],
  );

  const kpis = [
    {
      icon: <PetsIcon />,
      value: animals.length,
      label: "Total Insured Animals",
      subText: `Across ${speciesBreakdown.length} species`,
      trend: "—",
    },
    {
      icon: <PaidIcon />,
      value: `R ${totalInsuredValue.toLocaleString()}`,
      label: "Total Insured Value",
      subText: "Based on registered animals",
      trend: "—",
    },
    {
      icon: <DescriptionIcon />,
      value: activePolicy?.status || "None",
      label: "Active Policy Status",
      subText: activePolicy ? activePolicy.policyNumber : "No policy on file",
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
      icon: <AddCircleIcon />,
      label: "Register Animal",
      subLabel: "Add to your herd",
      onClick: () => setOpen(true),
    },
    {
      icon: <BoltIcon />,
      label: "Submit Claim",
      subLabel: "File an incident report",
      onClick: () => setOpenClaim(true),
    },
    {
      icon: <EventAvailableIcon />,
      label: "Book Inspection",
      subLabel: "Schedule vet visit",
      onClick: () => {},
    },
    {
      icon: <DownloadIcon />,
      label: "Download Policy",
      subLabel: "Get PDF copy",
      onClick: () => {},
    },
    {
      icon: <BarChartIcon />,
      label: "View Reports",
      subLabel: "Analytics & history",
      onClick: () => {},
    },
  ];
  const [open, setOpen] = useState(false);
  const [openClaim, setOpenClaim] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setOpenClaim(false);
  };
  return (
    <div className="farm-dashboard-page">
      <FarmHeaderBanner
        farmName={farmProfile?.farm_name || "Your Farm"}
        year={new Date().getFullYear()}
        location={
          farmProfile ? `${farmProfile.city}, ${farmProfile.province}` : ""
        }
        farmType={farmProfile?.farm_type}
      />

      <Grid container spacing={3} className="farm-dashboard-kpi-grid">
        {kpis.map((kpi) => (
          <Grid key={kpi.label} size={{ xs: 12, md: 6, lg: 3 }}>
            <KpiCard {...kpi} />
          </Grid>
        ))}
      </Grid>

      <div className="farm-dashboard-row">
        <DashboardPanel
          title="Livestock Portfolio"
          subtitle={`${animals.length} animals across ${speciesBreakdown.length} species`}
          className="farm-dashboard-row-item"
        >
          <LivestockPortfolioList species={speciesBreakdown} />
        </DashboardPanel>

        <DashboardPanel
          title="Quick Actions"
          subtitle="Common tasks at your fingertips"
          className="farm-dashboard-row-item"
        >
          <QuickActionsGrid actions={quickActions} />
        </DashboardPanel>
      </div>

      <div className="farm-dashboard-row">
        <ActivePolicyCard
          policy={
            activePolicy && {
              policyNumber: activePolicy.policy_number,
              status: activePolicy.status,
              monthlyPremium: activePolicy.monthly_premium,
              animalCountAtPricing: activePolicy.animal_count_at_pricing,
              startDate: activePolicy.creation_date
                ? new Date(activePolicy.creation_date).toLocaleDateString()
                : "—",
            }
          }
        />
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
      {open && (
        <BootstrapDialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          slotProps={{
            paper: { sx: { m: 2, boxShadow: "none", bgcolor: "transparent" } },
          }}
        >
          <DialogContent>
            <RegisterAnimal
              animalType={animalType}
              isModal={true}
              handleClose={handleClose}
              onSuccess={handleAnimalAdded}
            />
          </DialogContent>
        </BootstrapDialog>
      )}
      {openClaim && (
        <BootstrapDialog
          open={openClaim}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                m: 2, // shrink MUI's default 32px paper margin
                boxShadow: "none", // FileClaim's Paper already has its own border
                bgcolor: "transparent",
              },
            },
          }}
        >
          <DialogContent>
            <FileClaim
              key={refreshKey}
              handleClose={handleClose}
              onSuccess={handleClaimAdded}
            />
          </DialogContent>
        </BootstrapDialog>
      )}
    </div>
  );
}
