import { useState } from "react";
import { useNavigate } from "react-router";
import { AppBar, Toolbar, Stack, Box, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import logoMark from "../assets/logo-mark.png";
import "../styles/home.css";

const NAV_LINKS = [
  { label: "Features", id: "features" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Who We Serve", id: "who-we-serve" },
  { label: "About", id: "about" },
];

export function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(247, 245, 240, 0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid oklch(0.9 0.02 154.55)",
        color: "inherit",
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
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            component="img"
            src={logoMark}
            alt="StockGuard"
            sx={{ height: 36, width: "auto" }}
          />
          <Box
            component="span"
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: "1.15rem",
              color: "oklch(0.2 0.03 154.55)",
            }}
          >
            StockGuard
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={4}
          component="nav"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          {NAV_LINKS.map((link) => (
            <a key={link.id} href={`#${link.id}`} className="home-nav-link">
              {link.label}
            </a>
          ))}
        </Stack>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <button className="btn-secondary" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn-primary" onClick={() => navigate("/onboarding")}>
            Get Started
          </button>
        </Stack>

        <IconButton
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>

      {mobileOpen && (
        <Stack
          spacing={2}
          sx={{
            display: { xs: "flex", md: "none" },
            px: 3,
            pb: 3,
            borderTop: "1px solid oklch(0.9 0.02 154.55)",
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="home-nav-link"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
            <Button
              fullWidth
              className="btn-secondary"
              onClick={() => navigate("/login")}
              sx={{ textTransform: "none" }}
            >
              Login
            </Button>
            <Button
              fullWidth
              className="btn-primary"
              onClick={() => navigate("/onboarding")}
              sx={{ textTransform: "none" }}
            >
              Get Started
            </Button>
          </Stack>
        </Stack>
      )}
    </AppBar>
  );
}
