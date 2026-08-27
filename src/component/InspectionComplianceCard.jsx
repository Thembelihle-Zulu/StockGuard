import Typography from "@mui/material/Typography";
import { DashboardPanel } from "./DashboardPanel";
import { StatBlockRow } from "./StatBlockRaw";
import "../styles/farm-dashboard.css";

export function InspectionComplianceCard({
  registeredCount,
  inspectedCount,
  coveragePercent,
  notInspectedCount,
}) {
  return (
    <DashboardPanel
      title="Inspection Compliance"
      subtitle="Animals must be inspected before they qualify for claims"
    >
      <StatBlockRow
        stats={[
          { value: registeredCount, label: "Registered", tone: "neutral" },
          { value: inspectedCount, label: "Inspected", tone: "success" },
          {
            value: `${coveragePercent}%`,
            label: "Coverage",
            tone: coveragePercent === 100 ? "success" : "warning",
          },
        ]}
      />

      <div className="policy-renewal-track">
        <div
          className="policy-renewal-fill"
          style={{ width: `${coveragePercent}%` }}
        />
      </div>

      {notInspectedCount > 0 && (
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 1, color: "oklch(0.55 0.01 90)" }}
        >
          {notInspectedCount} animal{notInspectedCount === 1 ? "" : "s"} still
          require{notInspectedCount === 1 ? "s" : ""} inspection before they
          become claim eligible.
        </Typography>
      )}
    </DashboardPanel>
  );
}
