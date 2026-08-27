import { Box, Grid, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupIcon from "@mui/icons-material/Group";
import "../styles/home.css";

const TESTIMONIALS = [
  {
    quote:
      "StockGuard saved my farm after a disease outbreak wiped out 30 cattle. The claim was processed within 48 hours.",
    name: "Sipho Dlamini",
    farm: "Dlamini Cattle Farm, Mpumalanga",
  },
  {
    quote:
      "I never thought livestock insurance was accessible for a small farmer like me. StockGuard made it simple and affordable.",
    name: "Maria van der Berg",
    farm: "Van der Berg Smallholding, Western Cape",
  },
  {
    quote:
      "The herd management tools and real-time claim tracking give me peace of mind I never had before.",
    name: "Themba Nkosi",
    farm: "Nkosi Agri-Livestock, KwaZulu-Natal",
  },
];

function Stars({ size = "small" }) {
  return (
    <div className="star-row">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} fontSize={size} />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, dark }) {
  return (
    <Box
      className={`bento-card ${dark ? "bento-card--dark" : "bento-card--white"}`}
      sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}
    >
      <Box>
        <Stars />
        <Typography
          sx={{
            fontSize: "0.92rem",
            lineHeight: 1.6,
            fontStyle: "italic",
            color: dark ? "rgba(255,255,255,.85)" : "oklch(0.2 0.03 154.55)",
          }}
        >
          "{testimonial.quote}"
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 2.5,
          pt: 2,
          borderTop: dark ? "1px solid rgba(255,255,255,.1)" : "1px solid oklch(0.9 0.02 154.55)",
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: dark ? "white" : "oklch(0.2 0.03 154.55)" }}>
          {testimonial.name}
        </Typography>
        <Typography sx={{ fontSize: "0.78rem", color: dark ? "oklch(0.75 0.08 154.55)" : "oklch(0.5 0.02 154.55)" }}>
          {testimonial.farm}
        </Typography>
      </Box>
    </Box>
  );
}

export function TrustSection() {
  return (
    <Box component="section" id="about" sx={{ py: 1.5, scrollMarginTop: "90px" }}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            className="bento-card bento-card--primary"
            sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 240 }}
          >
            <Box>
              <p className="eyebrow eyebrow--on-dark">Our Impact</p>
              <Typography
                component="h2"
                sx={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: "white",
                  mt: 1,
                }}
              >
                Trusted by South African Farmers
              </Typography>
            </Box>
            <Box>
              <p className="bento-stat-value" style={{ color: "white" }}>98%</p>
              <p className="bento-stat-label" style={{ color: "oklch(0.75 0.08 154.55)" }}>
                Customer satisfaction rate
              </p>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <TestimonialCard testimonial={TESTIMONIALS[0]} />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Box
            className="bento-card bento-card--tint-earth"
            sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}
          >
            <Box className="bento-card-icon">
              <BarChartIcon />
            </Box>
            <Box>
              <p className="bento-stat-value" style={{ color: "oklch(0.2 0.03 154.55)" }}>12</p>
              <p className="bento-stat-label" style={{ color: "oklch(0.5 0.02 154.55)" }}>
                Provinces covered across South Africa
              </p>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TestimonialCard testimonial={TESTIMONIALS[1]} dark />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TestimonialCard testimonial={TESTIMONIALS[2]} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            className="bento-card bento-card--sage"
            sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}
          >
            <Box
              className="bento-card-icon"
              sx={{ bgcolor: "rgba(27,94,32,.15)", color: "oklch(0.2 0.03 154.55)" }}
            >
              <GroupIcon />
            </Box>
            <Box>
              <p className="bento-stat-value" style={{ color: "oklch(0.2 0.03 154.55)" }}>500+</p>
              <p className="bento-stat-label" style={{ color: "oklch(0.3 0.03 154.55)" }}>
                Active farmers on the platform
              </p>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
