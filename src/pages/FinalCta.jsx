import { useNavigate } from "react-router";
import { Box, Grid, Typography } from "@mui/material";
import SpaIcon from "@mui/icons-material/Spa";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "../styles/home.css";

const COMPLIANCE_BADGES = [
  "FSB Registered",
  "SAIA Member",
  "256-bit Secure",
  "POPIA Compliant",
];

export function FinalCta() {
  const navigate = useNavigate();

  return (
    <Box component="section" sx={{ py: 1.5, pb: 4 }}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box className="bento-card bento-card--image" sx={{ minHeight: 340, p: { xs: 3, md: 5 } }}>
            <img
              src="https://images.unsplash.com/photo-1558603374-cf93af771676?w=900&h=500&fit=crop&auto=format"
              alt="Group of cows in a green field"
              style={{ opacity: 0.4 }}
            />
            <Box
              className="bento-card-image-content"
              sx={{ justifyContent: "space-between", p: { xs: 3, md: 5 } }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  bgcolor: "rgba(165,214,167,.2)",
                  color: "oklch(0.75 0.08 154.55)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  px: 1.5,
                  py: 0.6,
                  borderRadius: "2rem",
                  border: "1px solid rgba(165,214,167,.3)",
                  width: "fit-content",
                }}
              >
                <SpaIcon sx={{ fontSize: 14 }} />
                No lock-in required
              </Box>

              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: { xs: "1.75rem", md: "2.2rem" },
                    fontWeight: 700,
                    lineHeight: 1.2,
                    mb: 2,
                  }}
                >
                  Start Protecting Your Livestock{" "}
                  <span style={{ color: "oklch(0.75 0.08 154.55)", fontStyle: "italic" }}>
                    Today
                  </span>
                </Typography>
                <p className="subtext" style={{ color: "rgba(255,255,255,.6)", maxWidth: "26rem", marginBottom: "1.5rem" }}>
                  Join hundreds of South African farmers who trust StockGuard
                  to safeguard their livelihood. Registration takes under 5
                  minutes.
                </p>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  <button className="btn-on-dark" onClick={() => navigate("/onboarding")}>
                    Get Started — It's Free <ArrowForwardIcon fontSize="small" />
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ color: "white", borderColor: "rgba(255,255,255,.3)", background: "transparent" }}
                  >
                    Talk to an Agent
                  </button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, height: "100%" }}>
            <Box className="bento-card bento-card--white" sx={{ flex: 1 }}>
              <p className="eyebrow" style={{ marginBottom: "1.25rem" }}>
                Fully Compliant &amp; Registered
              </p>
              <Grid container spacing={1.5}>
                {COMPLIANCE_BADGES.map((badge) => (
                  <Grid key={badge} size={{ xs: 6 }}>
                    <Box
                      className="bento-card--tint-green"
                      sx={{
                        borderRadius: "0.75rem",
                        px: 1.25,
                        py: 1.25,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                      }}
                    >
                      <CheckCircleIcon className="bento-check-icon" fontSize="small" />
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "oklch(0.2 0.03 154.55)" }}>
                        {badge}
                      </span>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box className="bento-card bento-card--primary">
              <p className="eyebrow eyebrow--on-dark" style={{ marginBottom: "0.5rem" }}>
                Ready to get started?
              </p>
              <Typography
                sx={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "white",
                  mb: 2,
                  lineHeight: 1.3,
                }}
              >
                Create your free account in 5 minutes
              </Typography>
              <button
                className="btn-on-dark"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => navigate("/onboarding")}
              >
                Get Started Free
              </button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
