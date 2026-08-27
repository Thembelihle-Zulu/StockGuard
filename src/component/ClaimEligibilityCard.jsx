import Typography from "@mui/material/Typography";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { DashboardPanel } from "./DashboardPanel";
import { StatBlockRow } from "./StatBlockRaw";
import "../styles/farm-dashboard.css";

export function ClaimEligibilityCard({ eligibleCount, ineligibleCount }) {
  return (
    <DashboardPanel
      title="Claim Eligibility"
      subtitle="Only animals with an approved inspection can be claimed"
    >
      <StatBlockRow
        stats={[
          { value: eligibleCount, label: "Eligible", tone: "success" },
          { value: ineligibleCount, label: "Ineligible", tone: "danger" },
        ]}
      />

      {eligibleCount === 0 && (
        <div className="eligibility-warning">
          <WarningAmberIcon fontSize="small" />
          No animals are currently eligible for claims.
        </div>
      )}

      <Typography
        variant="caption"
        sx={{ display: "block", mt: 1, color: "oklch(0.55 0.01 90)" }}
      >
        Only animals with an approved inspection can be used for claims.
      </Typography>
    </DashboardPanel>
  );
}
