import "../styles/farm-dashboard.css";

export function DashboardPanel({
  title,
  subtitle,
  action,
  children,
  className = "",
}) {
  return (
    <div className={`dashboard-panel ${className}`}>
      <div className="dashboard-panel-header">
        <div>
          <h3 className="dashboard-panel-title">{title}</h3>
          {subtitle && <p className="dashboard-panel-subtitle">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="dashboard-panel-body">{children}</div>
    </div>
  );
}
