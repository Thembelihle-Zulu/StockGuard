import "../styles/farm-dashboard.css";

export function QuickActionsGrid({ actions }) {
  return (
    <div className="quick-actions-grid">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className="quick-action-tile"
          onClick={action.onClick}
        >
          <span className="quick-action-icon">{action.icon}</span>
          <span className="quick-action-label">{action.label}</span>
          {action.subLabel && (
            <span className="quick-action-sublabel">{action.subLabel}</span>
          )}
        </button>
      ))}
    </div>
  );
}
