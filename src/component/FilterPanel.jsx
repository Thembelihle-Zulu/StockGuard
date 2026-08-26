import { Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import "../styles/admin-filters.css";

export function FilterPanel({
  title,
  activeCount = 0,
  onClear,
  children,
  advanced,
  showAdvanced,
  onToggleAdvanced,
}) {
  return (
    <div className="filters-panel">
      <div className="filters-panel-header">
        <div className="filters-panel-heading">
          <span className="filters-eyebrow">Filters</span>
          <h3 className="filters-title">{title}</h3>
        </div>
        {activeCount > 0 && (
          <div className="filters-header-actions">
            <span className="filters-badge">{activeCount} active</span>
            <button className="filters-clear-link" onClick={onClear}>
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="filters-grid">{children}</div>

      {advanced && (
        <>
          <button
            className="filters-advanced-toggle"
            onClick={onToggleAdvanced}
            type="button"
          >
            {showAdvanced ? "Fewer filters" : "More filters"}
            <ExpandMoreIcon
              fontSize="small"
              className={`filters-chevron ${showAdvanced ? "filters-chevron--open" : ""}`}
            />
          </button>
          <Collapse in={showAdvanced}>
            <div className="filters-advanced">
              <div className="filters-advanced-grid">{advanced}</div>
            </div>
          </Collapse>
        </>
      )}
    </div>
  );
}
