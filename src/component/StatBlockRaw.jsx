import "../styles/farm-dashboard.css";

const TONES = {
  warning: "stat-block--warning",
  success: "stat-block--success",
  danger: "stat-block--danger",
  neutral: "stat-block--neutral",
};

export function StatBlockRow({ stats }) {
  return (
    <div className="stat-block-row">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`stat-block ${TONES[stat.tone] || TONES.neutral}`}
        >
          <span className="stat-block-value">{stat.value}</span>
          <span className="stat-block-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
