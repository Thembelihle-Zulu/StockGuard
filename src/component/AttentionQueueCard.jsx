import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { DashboardPanel } from "./DashboardPanel";
import "../styles/farm-dashboard.css";

export function AttentionQueueCard({ items }) {
  const pendingItems = items.filter((item) => item.count > 0);
  const totalPending = pendingItems.reduce((sum, item) => sum + item.count, 0);

  return (
    <DashboardPanel
      title="Needs Your Review"
      subtitle={
        totalPending > 0
          ? `${totalPending} item${totalPending === 1 ? "" : "s"} awaiting a decision`
          : "Nothing waiting on you right now"
      }
    >
      {pendingItems.length === 0 ? (
        <div className="attention-queue-empty">
          <CheckCircleIcon fontSize="small" />
          You're all caught up.
        </div>
      ) : (
        <div className="attention-queue-list">
          {pendingItems.map((item) => (
            <div key={item.label} className="attention-queue-row">
              <div>
                <span className="attention-queue-count">{item.count}</span>
                <span className="attention-queue-label">{item.label}</span>
              </div>
              <Button
                variant="outlined"
                size="small"
                onClick={item.onClick}
                sx={{
                  textTransform: "none",
                  borderRadius: "2rem",
                  borderColor: "oklch(0.32 0.1 154.55)",
                  color: "oklch(0.32 0.1 154.55)",
                }}
              >
                Review
              </Button>
            </div>
          ))}
        </div>
      )}
    </DashboardPanel>
  );
}
