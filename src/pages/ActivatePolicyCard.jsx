import { DashboardPanel } from "../component/DashboardPanel";
import "../styles/farm-dashboard.css";
import "../styles/livestock-table.css";
import "../styles/claims-list.css";

const POLICY_STATUS_CLASS = {
  pending: "claim-status-badge claim-status-pending",
  active: "status-pill status-pill--alive",
  cancelled: "status-pill status-pill--deceased",
  expired: "status-pill status-pill--sick",
};

export function ActivePolicyCard({ policy, registeredCount, onTogglePolicies }) {
  if (!policy) {
    return (
      <DashboardPanel
        title="Active Policy"
        subtitle="Current insurance coverage details"
      >
        <p className="policy-empty">No active policy on file yet.</p>
      </DashboardPanel>
    );
  }

  const statusKey = policy.status?.toLowerCase();

  return (
    <DashboardPanel
      title="Active Policy"
      subtitle="Current insurance coverage details"
      action={
        <a className="dashboard-panel-link" onClick={onTogglePolicies}>
          View Policy ›
        </a>
      }
    >
      <div className="policy-top">
        <span className="policy-number">{policy.policyNumber}</span>
        <span className={POLICY_STATUS_CLASS[statusKey] || "status-pill status-pill--unknown"}>
          {policy.status}
        </span>
      </div>

      <dl className="policy-details">
        <div className="policy-detail-row">
          <dt>Monthly Premium</dt>
          <dd>R {policy.monthlyPremium.toLocaleString()}</dd>
        </div>
        <div className="policy-detail-row">
          <dt>Animals at Pricing</dt>
          <dd>{policy.animalCountAtPricing}</dd>
        </div>
        <div className="policy-detail-row">
          <dt>Policy Start</dt>
          <dd>{policy.startDate}</dd>
        </div>
      </dl>

      {statusKey === "pending" && (
        <div className="policy-renewal-wrap">
          <div className="policy-renewal-labels">
            <span>Animals registered toward activation</span>
            <span className="policy-renewal-days">
              {registeredCount} / {policy.animalCountAtPricing}
            </span>
          </div>
          <div className="policy-renewal-track">
            <div
              className="policy-renewal-fill"
              style={{
                width: `${
                  policy.animalCountAtPricing > 0
                    ? Math.min(
                        100,
                        (registeredCount / policy.animalCountAtPricing) * 100,
                      )
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      )}
    </DashboardPanel>
  );
}
