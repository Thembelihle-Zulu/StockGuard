import { NavLink, useNavigate } from "react-router";
import {
  Box,
  Stack,
  Typography,
  Chip,
  Button,
  Paper,
  AppBar,
  Toolbar,
} from "@mui/material";
import { WhyUs } from "../component/WhyUs";
import ShieldIcon from "@mui/icons-material/Shield";
import "../styles/home.css";
export function Home() {
  const navigate = useNavigate();

  return (
    <Box className="home">
      <div className="home">
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "white",
            borderBottom: "1px solid oklch(0.9 0.02 154.55)",
          }}
        >
          <Toolbar
            sx={{
              justifyContent: "space-between",
              maxWidth: 1200,
              width: "100%",
              mx: "auto",
              py: 1,
            }}
          >
            <ShieldIcon
              sx={{ color: "oklch(0.32 0.1 154.55)", fontSize: 32 }}
            />

            {/* Nav links currently all point to "/" — real routes/sections
                for these don't exist yet, wire up once built. */}
            <Stack direction="row" spacing={4} component="nav">
              {[
                { label: "Features", to: "/" },
                { label: "How it works", to: "/" },
                { label: "Who We Serve", to: "/" },
                { label: "About", to: "/" },
              ].map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  style={{ textDecoration: "none" }}
                >
                  {({ isActive }) => (
                    <Box
                      component="span"
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color: isActive
                          ? "oklch(0.32 0.1 154.55)"
                          : "oklch(0.35 0.02 154.55)",
                        "&:hover": { color: "oklch(0.32 0.1 154.55)" },
                      }}
                    >
                      {link.label}
                    </Box>
                  )}
                </NavLink>
              ))}
            </Stack>

            <Stack direction="row" spacing={1.5} className="button-group">
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  color: "oklch(0.32 0.1 154.55)",
                  border: "1.5px solid oklch(0.8 0.03 154.55)",
                  borderRadius: "2rem",
                  px: "1.5rem",
                  py: "0.5rem",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { bgcolor: "oklch(0.97 0.02 154.55)" },
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  bgcolor: "oklch(0.32 0.1 154.55)",
                  color: "white",
                  borderRadius: "2rem",
                  px: "1.5rem",
                  py: "0.5rem",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { bgcolor: "oklch(0.27 0.1 154.55)" },
                }}
              >
                Get Started
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>
      </div>
      <Box
        component="main"
        sx={{ maxWidth: 1200, mx: "auto", px: { xs: 3, md: 4 } }}
      >
        <Box
          component="section"
          className="Features"
          sx={{
            pt: "3rem",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 4, md: 6 },
            minHeight: { md: 600 },
            alignItems: "center",
          }}
        >
          {/* ---------- Text content ---------- */}
          <Stack sx={{ alignItems: "flex-start", gap: "1.5rem", pt: "2rem" }}>
            <Chip
              label="South Africa's Livestock Insurance Platform"
              icon={
                <Box
                  component="span"
                  sx={{
                    width: "0.4rem",
                    height: "0.4rem",
                    borderRadius: "50%",
                    bgcolor: "oklch(0.55 0.15 154.55)",
                    ml: "0.5rem",
                  }}
                />
              }
              sx={{
                bgcolor: "oklch(0.93 0.05 154.55)",
                color: "oklch(0.32 0.1 154.55)",
                borderRadius: "2rem",
                px: "0.5rem",
                py: "1.4rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                height: "auto",
                "& .MuiChip-label": { px: "0.5rem" },
              }}
            />

            <Typography
              component="h1"
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: "3.2rem",
                lineHeight: 1.15,
                fontWeight: 700,
                color: "oklch(0.2 0.03 154.55)",
                m: 0,
              }}
            >
              Protect Your{" "}
              <Box
                component="span"
                sx={{ fontStyle: "italic", color: "oklch(0.32 0.13 154.55)" }}
              >
                Livestock.
              </Box>
              <br />
              Protect Your{" "}
              <Box
                component="span"
                sx={{ fontStyle: "italic", color: "oklch(0.32 0.13 154.55)" }}
              >
                Income.
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: "1.1rem",
                color: "oklch(0.5 0.02 154.55)",
                lineHeight: 1.6,
                maxWidth: "32rem",
                m: 0,
              }}
            >
              Affordable livestock insurance for South African farmers —
              covering illness, injury, and mortality with transparent pricing
              and fast claim payouts.
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ pt: "0.25rem" }}
            >
              <Button
                onClick={() => navigate("/onboarding")}
                sx={{
                  bgcolor: "oklch(0.32 0.1 154.55)",
                  color: "white",
                  borderRadius: "2rem",
                  px: "1.75rem",
                  py: "0.9rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { bgcolor: "oklch(0.27 0.1 154.55)" },
                }}
                endIcon={<span>→</span>}
              >
                Get Started
              </Button>
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  bgcolor: "transparent",
                  color: "oklch(0.32 0.1 154.55)",
                  border: "1.5px solid oklch(0.8 0.03 154.55)",
                  borderRadius: "2rem",
                  px: "1.75rem",
                  py: "0.9rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "oklch(0.97 0.02 154.55)",
                    borderColor: "oklch(0.8 0.03 154.55)",
                  },
                }}
              >
                Login
              </Button>
            </Stack>
          </Stack>

          {/* ---------- Image content ---------- */}
          <Box
            className="image-content"
            sx={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1636998980792-63f27ddea4e3?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              borderRadius: "1rem",
              overflow: "hidden",
              height: "100%",
              minHeight: 420,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: "0.75rem",
              p: "1.5rem",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                alignSelf: "flex-end",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                bgcolor: "oklch(90.935% 0.00919 161.94)",
                borderRadius: "1rem",
                px: "1rem",
                py: "0.75rem",
                maxWidth: "15rem",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            >
              <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
                <li>Claims #2847 Approved</li>
              </Box>
              <Typography component="span" sx={{ m: 0 }}>
                Payout: R 8,500 · 2 min ago
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                mt: "auto",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                bgcolor: "oklch(90.935% 0.00919 161.94)",
                borderRadius: "1rem",
                px: "1rem",
                py: "0.75rem",
                maxWidth: "15rem",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            >
              <Box component="span" sx={{ fontSize: "1.25rem", flexShrink: 0 }}>
                🛡️
              </Box>
              <Typography component="span">
                <Box component="strong">1,200+</Box> Animals protected
              </Typography>
            </Paper>
          </Box>
        </Box>

        <Box component="section">
          <WhyUs />
        </Box>
      </Box>
    </Box>
  );
}
