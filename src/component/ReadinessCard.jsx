import { DashboardPanel } from "./DashboardPanel";
import "../styles/farm-dashboard.css";

export function ReadinessCard({ score, checklist }) {
  return (
    <DashboardPanel
      title="Insurance Readiness"
      subtitle="How close you are to full claim eligibility"
      className="readiness-card"
    >
      <div className="readiness-score-row">
        <span className="readiness-score-value">{score}%</span>
        <span className="readiness-score-label">Ready</span>
      </div>

      <div className="policy-renewal-track readiness-score-track">
        <div className="policy-renewal-fill" style={{ width: `${score}%` }} />
      </div>

      <ul className="readiness-checklist">
        {checklist.map((item) => (
          <li
            key={item.label}
            className={`readiness-checklist-item ${item.met ? "is-met" : "is-unmet"}`}
          >
            <span className="readiness-checklist-icon">
              {item.met ? "✓" : "✗"}
            </span>
            {item.label}
          </li>
        ))}
      </ul>
    </DashboardPanel>
  );
}
