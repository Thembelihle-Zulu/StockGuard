import { Box, Grid, Typography } from "@mui/material";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import BoltIcon from "@mui/icons-material/Bolt";
import ShieldIcon from "@mui/icons-material/Shield";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "../styles/home.css";

const COVER_CARDS = [
  {
    icon: MonitorHeartIcon,
    tint: "bento-card--white",
    title: "Illness Cover",
    body: "Comprehensive protection against veterinary-certified illness and disease outbreaks, covering diagnosis, treatment, and losses resulting from sickness.",
    large: true,
  },
  {
    icon: BoltIcon,
    tint: "bento-card--tint-amber",
    title: "Injury Cover",
    body: "Full cover for accidental injuries — wire cuts, broken limbs, snake bites, and environmental hazards that affect your animals.",
  },
  {
    icon: ShieldIcon,
    tint: "bento-card--tint-purple",
    title: "Mortality Cover",
    body: "When the worst happens, we step in. Mortality cover pays out fair market value for livestock lost to covered perils.",
  },
];

export function WhyUs() {
  const [illness, injury, mortality] = COVER_CARDS;

  return (
    <Box component="section" id="features" sx={{ py: 3, scrollMarginTop: "90px" }}>
      <Box className="bento-card bento-card--white" sx={{ mb: 1.5, p: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { sm: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <p className="eyebrow">Coverage That Works</p>
            <Typography
              component="h2"
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: { xs: "1.5rem", md: "1.75rem" },
                fontWeight: 700,
                color: "oklch(0.2 0.03 154.55)",
                mt: 0.5,
              }}
            >
              Why Choose StockGuard?
            </Typography>
          </Box>
          <p className="subtext" style={{ maxWidth: "20rem" }}>
            Three essential layers of protection designed around the real
            risks South African farmers face every season.
          </p>
        </Box>
      </Box>

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            className={`bento-card ${illness.tint} bento-card--interactive`}
          >
            <Box className="bento-card-icon" sx={{ mb: 3 }}>
              <illness.icon />
            </Box>
            <Typography
              component="h3"
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "oklch(0.2 0.03 154.55)",
                mb: 1.5,
              }}
            >
              {illness.title}
            </Typography>
            <p className="subtext" style={{ marginBottom: "1.5rem" }}>
              {illness.body}
            </p>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                color: "oklch(0.32 0.1 154.55)",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              Learn more <ChevronRightIcon fontSize="small" />
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container direction="column" spacing={1.5} sx={{ height: "100%" }}>
            {[injury, mortality].map((card) => (
              <Grid key={card.title} size={{ xs: 12 }} sx={{ flex: 1 }}>
                <Box className={`bento-card ${card.tint} bento-card--interactive`}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box className="bento-card-icon">
                      <card.icon />
                    </Box>
                    <Box>
                      <Typography
                        component="h3"
                        sx={{
                          fontFamily: '"Playfair Display", Georgia, serif',
                          fontSize: "1.15rem",
                          fontWeight: 700,
                          color: "oklch(0.2 0.03 154.55)",
                          mb: 0.75,
                        }}
                      >
                        {card.title}
                      </Typography>
                      <p className="subtext" style={{ fontSize: "0.88rem" }}>
                        {card.body}
                      </p>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
