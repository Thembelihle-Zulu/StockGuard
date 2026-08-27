import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { DashboardPanel } from "./DashboardPanel";
import "../styles/farm-dashboard.css";

export function NextActionCard({ action, onNavigate }) {
  return (
    <DashboardPanel
      title="Next Recommended Action"
      subtitle="What to do next to stay claim-ready"
    >
      <Typography
        sx={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: "1.15rem",
          fontWeight: 700,
          color: "oklch(0.2 0.03 154.55)",
          mb: 0.75,
        }}
      >
        {action.title}
      </Typography>
      <Typography
        sx={{ color: "oklch(0.5 0.02 154.55)", fontSize: "0.88rem", mb: 2 }}
      >
        {action.description}
      </Typography>
      <Button
        variant="contained"
        onClick={() => onNavigate(action.target)}
        sx={{
          textTransform: "none",
          borderRadius: "2rem",
          bgcolor: "oklch(0.32 0.1 154.55)",
          "&:hover": { bgcolor: "oklch(0.27 0.1 154.55)" },
        }}
      >
        {action.ctaLabel}
      </Button>
    </DashboardPanel>
  );
}
