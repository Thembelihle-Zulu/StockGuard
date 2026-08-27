import { useNavigate } from "react-router";
import { Box, Grid, Typography } from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Navbar } from "./Navbar";
import { WhyUs } from "../component/WhyUs";
import { HowItWorks } from "./HowItWorks";
import { WhoWeServe } from "./WhoWeServe";
import { TrustSection } from "./TrustSection";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";
import "../styles/home.css";

const TRUST_SIGNALS = ["No hidden fees", "Cancel anytime", "24hr claim support"];

export function Home() {
  const navigate = useNavigate();

  return (
    <Box className="home">
      <Navbar />

      <Box component="main" sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 }, py: 3 }}>
        {/* ---------- Hero (bento) ---------- */}
        <Box component="section" sx={{ pb: 1.5 }}>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                className="bento-card bento-card--white"
                sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: { xs: "auto", md: 340 } }}
              >
                <Box>
                  <div className="pill">
                    <span className="pill-dot" />
                    South Africa's Livestock Insurance Platform
                  </div>
                  <h1 className="headline" style={{ marginTop: "1.5rem" }}>
                    Protect Your <span className="accent">Livestock.</span>
                    <br />
                    Protect Your <span className="accent">Income.</span>
                  </h1>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 3 }}>
                  <button className="btn-primary" onClick={() => navigate("/onboarding")}>
                    Get Started <ArrowForwardIcon fontSize="small" />
                  </button>
                  <button className="btn-secondary" onClick={() => navigate("/login")}>
                    Login
                  </button>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Box className="bento-card bento-card--image" sx={{ minHeight: 300 }}>
                <img
                  src="https://images.unsplash.com/photo-1588152850700-c82ecb8ba9b1?w=800&h=700&fit=crop&auto=format"
                  alt="Herd of sheep grazing on green pasture"
                />
                <Box sx={{ position: "absolute", top: 16, left: 16, zIndex: 1 }}>
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,.95)",
                      borderRadius: "0.75rem",
                      px: 1.75,
                      py: 1.25,
                      boxShadow: "0 4px 12px rgba(0,0,0,.15)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#2e7d32" }} />
                      <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "oklch(0.2 0.03 154.55)" }}>
                        Claim #2847 Approved
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: "0.72rem", color: "oklch(0.5 0.02 154.55)", mt: 0.25 }}>
                      Payout: R 8,500 · 2 min ago
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Box className="bento-card bento-card--tint-green">
                <p className="subtext" style={{ marginBottom: "1.25rem" }}>
                  Affordable livestock insurance for South African farmers —
                  covering illness, injury, and mortality with transparent
                  pricing and fast claim payouts.
                </p>
                <ul className="bento-check-list">
                  {TRUST_SIGNALS.map((item) => (
                    <li key={item}>
                      <CheckCircleIcon className="bento-check-icon" fontSize="small" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Box>
            </Grid>

            <Grid size={{ xs: 6, md: 4 }}>
              <Box
                className="bento-card bento-card--primary"
                sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}
              >
                <Box className="bento-card-icon bento-card-icon--on-dark">
                  <ShieldIcon />
                </Box>
                <Box sx={{ mt: 3 }}>
                  <p className="bento-stat-value" style={{ color: "white" }}>1,200+</p>
                  <p className="bento-stat-label" style={{ color: "oklch(0.75 0.08 154.55)" }}>
                    Animals currently protected
                  </p>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Box
                className="bento-card bento-card--dark"
                sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}
              >
                <Box className="bento-card-icon bento-card-icon--on-dark">
                  <CheckCircleIcon />
                </Box>
                <Box sx={{ mt: 3 }}>
                  <p className="bento-stat-value" style={{ color: "white" }}>250+</p>
                  <p className="bento-stat-label" style={{ color: "rgba(255,255,255,.6)" }}>
                    Claims processed
                  </p>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <WhyUs />
        <HowItWorks />
        <WhoWeServe />
        <TrustSection />
        <FinalCta />
      </Box>

      <Footer />
    </Box>
  );
}
