import { DashboardPanel } from "./DashboardPanel";
import { StatBlockRow } from "./StatBlockRaw";
import "../styles/farm-dashboard.css";
import { useNavigate } from "react-router";

export function ClaimsOverviewCard({ stats, claims, onToggleClaims }) {
  return (
    <DashboardPanel
      title="Claims Overview"
      subtitle="2024 — 2026 claims history"
      action={
        <a className="dashboard-panel-link" onClick={onToggleClaims}>
          All Claims ›
        </a>
      }
    >
      <StatBlockRow stats={stats} />

      <ul className="claims-overview-list">
        {claims.map((claim) => (
          <li key={claim.id} className="claims-overview-row">
            <span
              className={`claims-overview-dot claims-overview-dot--${claim.status}`}
            />
            <div className="claims-overview-info">
              <span className="claims-overview-id">{claim.id}</span>
              <span className="claims-overview-desc">{claim.description}</span>
            </div>
            <div className="claims-overview-right">
              <span className="claims-overview-amount">
                R {claim.amount.toLocaleString()}
              </span>
              <span
                className={`claim-status-badge claim-status-${claim.status}`}
              >
                {claim.statusLabel}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </DashboardPanel>
  );
}
