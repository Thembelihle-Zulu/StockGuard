import { useNavigate } from "react-router";
import { Box, Grid, Typography } from "@mui/material";
import SpaIcon from "@mui/icons-material/Spa";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "../styles/home.css";

const SMALL_SCALE_BENEFITS = [
  "Simple 5-minute onboarding",
  "Easy livestock registration",
  "Guided claims process",
  "Affordable premiums",
  "Mobile-friendly interface",
];

const COMMERCIAL_BENEFITS = [
  "Bulk herd import",
  "Detailed records",
  "Structured docs",
  "Account manager",
  "API access",
];

export function WhoWeServe() {
  const navigate = useNavigate();

  return (
    <Box component="section" sx={{ py: 1.5 }}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12 }}>
          <Box
            className="bento-card bento-card--white"
            sx={{
              p: { xs: 3, md: 4 },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { sm: "center" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <p className="eyebrow">Who We Serve</p>
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
                Built for Every Farmer
              </Typography>
            </Box>
            <p className="subtext" style={{ maxWidth: "22rem" }}>
              Whether you run a smallholding or a large commercial
              operation, StockGuard scales to your needs.
            </p>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Box className="bento-card bento-card--image" sx={{ minHeight: 260 }}>
            <img
              src="https://images.unsplash.com/photo-1710132486700-860047e9b96d?w=600&h=500&fit=crop&auto=format"
              alt="Farmer standing in a field"
            />
            <Box className="bento-card-image-content">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "0.5rem",
                    bgcolor: "rgba(165,214,167,.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SpaIcon sx={{ fontSize: 16, color: "white" }} />
                </Box>
                <Typography
                  sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, fontSize: "1.1rem" }}
                >
                  Small-Scale Farmers
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "0.78rem", fontStyle: "italic", opacity: 0.75 }}>
                Built for simplicity, not red tape.
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Box
            className="bento-card bento-card--tint-green"
            sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}
          >
            <ul className="bento-check-list">
              {SMALL_SCALE_BENEFITS.map((b) => (
                <li key={b}>
                  <CheckCircleIcon className="bento-check-icon" fontSize="small" />
                  {b}
                </li>
              ))}
            </ul>
            <button
              className="btn-secondary"
              onClick={() => navigate("/onboarding")}
              style={{ marginTop: "1.5rem", width: "100%" }}
            >
              Get Started
            </button>
          </Box>
        </Grid>

        <Grid size={{ xs: 6, md: 2 }}>
          <Box
            className="bento-card bento-card--dark"
            sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}
          >
            <Box className="bento-card-icon bento-card-icon--on-dark" sx={{ width: 40, height: 40 }}>
              <ApartmentIcon fontSize="small" />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, fontSize: "1rem", mb: 1.5 }}
              >
                Commercial Farmers
              </Typography>
              <ul className="bento-check-list bento-check-list--on-dark">
                {COMMERCIAL_BENEFITS.map((b) => (
                  <li key={b} style={{ fontSize: "0.78rem" }}>
                    <CheckCircleIcon className="bento-check-icon--on-dark" sx={{ fontSize: 14 }} />
                    {b}
                  </li>
                ))}
              </ul>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 6, md: 2 }}>
          <Box className="bento-card bento-card--image" sx={{ minHeight: 200 }}>
            <img
              src="https://images.unsplash.com/photo-1546552615-f8861d1aa798?w=300&h=400&fit=crop&auto=format"
              alt="Herd of cattle on green grass"
            />
            <Box className="bento-card-image-content" sx={{ p: 2 }}>
              <button
                className="btn-secondary"
                style={{
                  width: "100%",
                  fontSize: "0.75rem",
                  padding: "0.5rem",
                  color: "white",
                  borderColor: "rgba(255,255,255,.4)",
                  background: "rgba(255,255,255,.15)",
                }}
              >
                Learn More
              </button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
