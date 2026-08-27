import { useNavigate } from "react-router";
import { Box, Grid, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "../styles/home.css";

const STEPS = [
  {
    step: "01",
    icon: PersonAddIcon,
    title: "Register Farm",
    body: "Create your StockGuard account and register your farm details in under 5 minutes.",
  },
  {
    step: "02",
    icon: AgricultureIcon,
    title: "Register Livestock",
    body: "Add animals with species, breed, age, and current market value — individually or in bulk.",
  },
  {
    step: "03",
    icon: AssignmentIcon,
    title: "Choose Coverage",
    body: "Select illness, injury, or mortality cover. Mix and match plans to fit your budget.",
  },
  {
    step: "04",
    icon: FindInPageIcon,
    title: "Submit & Track Claims",
    body: "File claims from your phone. Track status in real time and receive payouts to your account.",
  },
];

export function HowItWorks() {
  const navigate = useNavigate();

  return (
    <Box component="section" id="how-it-works" sx={{ py: 1.5, scrollMarginTop: "90px" }}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            className="bento-card bento-card--primary"
            sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 220 }}
          >
            <Box>
              <p className="eyebrow eyebrow--on-dark">Simple Process</p>
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
                How It Works
              </Typography>
              <p className="subtext" style={{ color: "rgba(255,255,255,.75)", marginTop: "0.75rem" }}>
                From registration to claim payout — a transparent four-step
                process.
              </p>
            </Box>
            <button
              className="btn-on-dark"
              onClick={() => navigate("/onboarding")}
              style={{ marginTop: "1.5rem", alignSelf: "flex-start" }}
            >
              Start Now <ArrowForwardIcon fontSize="small" />
            </button>
          </Box>
        </Grid>

        {STEPS.map((s) => (
          <Grid key={s.step} size={{ xs: 6, md: 2 }}>
            <Box className="bento-card bento-card--white" sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box className="bento-card-icon" sx={{ width: 44, height: 44 }}>
                  <s.icon fontSize="small" />
                </Box>
                <Typography
                  sx={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "oklch(0.32 0.1 154.55)",
                    opacity: 0.2,
                  }}
                >
                  {s.step}
                </Typography>
              </Box>
              <Typography
                component="h3"
                sx={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "oklch(0.2 0.03 154.55)",
                  mb: 0.5,
                }}
              >
                {s.title}
              </Typography>
              <p className="subtext" style={{ fontSize: "0.8rem" }}>
                {s.body}
              </p>
            </Box>
          </Grid>
        ))}

        <Grid size={{ xs: 12 }}>
          <Box className="bento-card bento-card--image" sx={{ minHeight: 190 }}>
            <img
              src="https://images.unsplash.com/photo-1717429863742-ae0de642ffde?w=1400&h=400&fit=crop&auto=format"
              alt="Herd of animals walking across a dry grass field"
            />
            <Box className="bento-card-image-content" sx={{ justifyContent: "center", px: { xs: 3, md: 5 } }}>
              <Typography
                sx={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: { xs: "1.3rem", md: "1.6rem" },
                  fontWeight: 700,
                  maxWidth: "34rem",
                  lineHeight: 1.3,
                }}
              >
                "Protecting South African farmers, one herd at a time."
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
