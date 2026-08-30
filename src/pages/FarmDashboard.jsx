import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
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
import { OverviewCard } from "../component/OverviewCard";
import { ReadinessCard } from "../component/ReadinessCard";
import { InspectionComplianceCard } from "../component/InspectionComplianceCard";
import { ClaimEligibilityCard } from "../component/ClaimEligibilityCard";
import { NextActionCard } from "../component/NextActionCard";
import { computeReadiness } from "../utils/insuranceReadiness";
import "../styles/farm-dashboard.css";
import { RegisterAnimalFlow } from "../component/RegisterAnimalFlow";
import { SubmitInspectionFlow } from "../component/SubmitInspectionFlow";
import { FileClaim } from "./FileClaim";

const STATUS_LABEL = {
  pending: "Pending",
  approved: "Approved",
  denied: "Rejected",
};

const INSPECTION_STATUS_LABEL = {
  pending: "Pending",
  approved: "Approved",
  denied: "Changes Requested",
};
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));
export function FarmDashboard({
  onToggleClaims,
  onTogglePolicies,
  onToggleLivestock,
  onToggleInspections,
  onToggleReports,
}) {
  const navigate = useNavigate();
  const [farmProfile, setFarmProfile] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [claims, setClaims] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const handleClaimAdded = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleAnimalAdded = () => setRefreshKey((k) => k + 1);
  const handleInspectionAdded = () => setRefreshKey((k) => k + 1);
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

    apiFetch("onboarding/policy")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setPolicies(Array.isArray(data) ? data : []))
      .catch(console.error);

    apiFetch("onboarding/inspection")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setInspections(Array.isArray(data) ? data : []))
      .catch(console.error);

    apiFetch("claims")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setClaims(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [refreshKey]);

  const activePolicy =
    policies.find((p) => p.status?.toLowerCase() === "active") || policies[0];

  const readiness = useMemo(
    () =>
      computeReadiness({
        farmProfile,
        animals,
        inspections,
        policy: activePolicy,
      }),
    [farmProfile, animals, inspections, activePolicy],
  );

  const handleNavigate = (target) => {
    switch (target) {
      case "onboarding":
        navigate("/onboarding");
        break;
      case "livestock":
        onToggleLivestock?.();
        break;
      case "inspections":
        onToggleInspections?.();
        break;
      case "policies":
        onTogglePolicies?.();
        break;
      case "claims":
        setOpenClaim(true);
        break;
      default:
        break;
    }
  };

  const handleDownloadPolicy = () => {
    if (!activePolicy) return;

    const lines = [
      "StockGuard — Policy Summary",
      "",
      `Policy Number: ${activePolicy.policy_number}`,
      `Status: ${activePolicy.status}`,
      `Farm: ${farmProfile?.farm_name || "-"}`,
      `Monthly Premium: R ${Number(activePolicy.monthly_premium).toLocaleString()}`,
      activePolicy.insured_value_at_pricing != null
        ? `Insured Value: R ${Number(activePolicy.insured_value_at_pricing).toLocaleString()}`
        : null,
      `Animals at Pricing: ${activePolicy.animal_count_at_pricing}`,
      `Policy Start: ${
        activePolicy.creation_date
          ? new Date(activePolicy.creation_date).toLocaleDateString()
          : "-"
      }`,
    ].filter(Boolean);

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activePolicy.policy_number}-summary.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

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

  const savedThisMonth = useMemo(() => {
    const now = new Date();
    return claims
      .filter((c) => {
        if ((c.status || "").toLowerCase() !== "approved") return false;
        const created = new Date(c.created_date);
        return (
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, c) => sum + (Number(c.claim_amount) || 0), 0);
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

  const inspectionCounts = useMemo(() => {
    const counts = { pending: 0, approved: 0, denied: 0 };
    inspections.forEach((i) => {
      const key = (i.status || "pending").toLowerCase();
      if (counts[key] !== undefined) counts[key] += 1;
    });
    return counts;
  }, [inspections]);

  const recentInspections = useMemo(() => {
    const animalById = {};
    animals.forEach((a) => {
      animalById[a.id] = a;
    });

    return [...inspections]
      .sort((a, b) => new Date(b.inspection_date) - new Date(a.inspection_date))
      .slice(0, 4)
      .map((i) => {
        const key = (i.status || "pending").toLowerCase();
        const animal = animalById[i.livestock_id];
        return {
          id: i.id,
          description: animal
            ? `${animal.species} — ${animal.tag_number}`
            : i.livestock_id,
          amount: i.approved_value ?? animal?.estimated_value ?? null,
          status: key,
          statusLabel: INSPECTION_STATUS_LABEL[key] || i.status,
        };
      });
  }, [inspections, animals]);

  const kpis = [
    {
      icon: <PetsIcon />,
      value: animals.length,
      label: "Total Insured Animals",
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
      value: activePolicy?.status || "None",
      label: "Active Policy Status",
      subText: activePolicy ? activePolicy.policy_number : "No policy on file",
    },
    {
      icon: <BoltIcon />,
      value: claimCounts.pending,
      label: "Open Claims",
      subText: "Awaiting review",
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
      label: "Submit Vet Report",
      subLabel: "For an already-registered animal",
      onClick: () => setOpenInspection(true),
    },
    {
      icon: <DownloadIcon />,
      label: "Download Policy",
      subLabel: "Get summary copy",
      onClick: () => handleDownloadPolicy(),
    },
    {
      icon: <BarChartIcon />,
      label: "View Reports",
      subLabel: "Analytics & history",
      onClick: () => onToggleReports?.(),
    },
  ];
  const [open, setOpen] = useState(false);
  const [openClaim, setOpenClaim] = useState(false);
  const [openInspection, setOpenInspection] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setOpenClaim(false);
    setOpenInspection(false);
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
        imageUrl={farmProfile?.image_url}
        savedThisMonth={savedThisMonth}
      />

      <Grid container spacing={3} className="farm-dashboard-kpi-grid">
        {kpis.map((kpi) => (
          <Grid key={kpi.label} size={{ xs: 12, md: 6, lg: 3 }}>
            <KpiCard {...kpi} />
          </Grid>
        ))}
      </Grid>

      <ReadinessCard
        score={readiness.readinessScore}
        checklist={readiness.checklist}
      />

      <div className="farm-dashboard-row farm-dashboard-row--three">
        <InspectionComplianceCard
          registeredCount={readiness.registeredCount}
          inspectedCount={readiness.inspectedCount}
          coveragePercent={readiness.coveragePercent}
          notInspectedCount={readiness.notInspectedCount}
        />
        <ClaimEligibilityCard
          eligibleCount={readiness.eligibleCount}
          ineligibleCount={readiness.ineligibleCount}
        />
        <NextActionCard action={readiness.nextAction} onNavigate={handleNavigate} />
      </div>

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
        <OverviewCard
          title="Inspections Overview"
          subtitle="Your most recent inspections"
          actionLabel="All Inspections"
          onToggle={onToggleInspections}
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
            {
              value: inspectionCounts.denied,
              label: "Changes Requested",
              tone: "danger",
            },
          ]}
          items={recentInspections}
        />
        <OverviewCard
          title="Claims Overview"
          subtitle="Your most recent claims"
          actionLabel="All Claims"
          onToggle={onToggleClaims}
          stats={[
            { value: claimCounts.pending, label: "Pending", tone: "warning" },
            { value: claimCounts.approved, label: "Approved", tone: "success" },
            { value: claimCounts.denied, label: "Rejected", tone: "danger" },
          ]}
          items={recentClaims}
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
            <RegisterAnimalFlow
              animalType={animalType}
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
                m: 2,
                boxShadow: "none",
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
      {openInspection && (
        <BootstrapDialog
          open={openInspection}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          slotProps={{
            paper: { sx: { m: 2, boxShadow: "none", bgcolor: "transparent" } },
          }}
        >
          <DialogContent>
            <SubmitInspectionFlow
              handleClose={handleClose}
              onSuccess={handleInspectionAdded}
            />
          </DialogContent>
        </BootstrapDialog>
      )}
    </div>
  );
}
