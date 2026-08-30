import "../styles/farm-dashboard.css";

const BAR_COLORS = [
  "var(--forest)",
  "var(--evergreen)",
  "var(--wheat)",
  "var(--earth)",
  "var(--olive)",
  "var(--info)",
];

export function LivestockPortfolioList({ species }) {
  const total = species.reduce((sum, row) => sum + row.count, 0);

  return (
    <ul className="livestock-portfolio-list">
      {species.map((row, index) => {
        const percent = total > 0 ? (row.count / total) * 100 : 0;
        const color = BAR_COLORS[index % BAR_COLORS.length];

        return (
          <li key={row.name} className="livestock-portfolio-row">
            <span
              className="livestock-portfolio-icon"
              style={{ backgroundColor: color }}
            >
              {row.name.charAt(0).toUpperCase()}
            </span>
            <div className="livestock-portfolio-info">
              <span className="livestock-portfolio-name">{row.name}</span>
              {row.lastInspected && (
                <span className="livestock-portfolio-inspected">
                  Last inspected {row.lastInspected}
                </span>
              )}
            </div>
            <div className="livestock-portfolio-stats">
              <span className="livestock-portfolio-count">{row.count}</span>
              <span className="livestock-portfolio-bar-track">
                <span
                  className="livestock-portfolio-bar-fill"
                  style={{ width: `${percent}%`, backgroundColor: color }}
                />
              </span>
              <span className="livestock-portfolio-percent">
                {percent.toFixed(1)}%
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
