import { DashboardPanel } from "../component/DashboardPanel";
import "../styles/farm-dashboard.css";

export function ActivePolicyCard({ policy }) {
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

  return (
    <DashboardPanel
      title="Active Policy"
      subtitle="Current insurance coverage details"
      action={<span className="policy-active-pill">{policy.status}</span>}
    >
      <div className="policy-top">
        <span className="policy-number">{policy.policyNumber}</span>
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
    </DashboardPanel>
  );
}
