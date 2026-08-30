import { DashboardPanel } from "./DashboardPanel";
import { StatBlockRow } from "./StatBlockRaw";
import "../styles/farm-dashboard.css";

export function OverviewCard({
  title,
  subtitle,
  actionLabel,
  onToggle,
  stats,
  items,
}) {
  return (
    <DashboardPanel
      title={title}
      subtitle={subtitle}
      action={
        <a className="dashboard-panel-link" onClick={onToggle}>
          {actionLabel} ›
        </a>
      }
    >
      <StatBlockRow stats={stats} />

      <ul className="claims-overview-list">
        {items.map((item) => (
          <li key={item.id} className="claims-overview-row">
            <span
              className={`claims-overview-dot claims-overview-dot--${item.status}`}
            />
            <div className="claims-overview-info">
              <span className="claims-overview-id">{item.id}</span>
              <span className="claims-overview-desc">{item.description}</span>
            </div>
            <div className="claims-overview-right">
              <span className="claims-overview-amount">
                {item.amount != null ? `R ${item.amount.toLocaleString()}` : "—"}
              </span>
              <span
                className={`claim-status-badge claim-status-${item.status}`}
              >
                {item.statusLabel}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </DashboardPanel>
  );
}
