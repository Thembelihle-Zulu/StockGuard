import { Box, Grid, Stack, Typography } from "@mui/material";
import logoMark from "../assets/logo-mark.png";
import "../styles/home.css";

const FOOTER_COLUMNS = [
  { heading: "Product", links: ["Features", "Pricing", "Coverage Plans", "How It Works"] },
  { heading: "Farmers", links: ["Small-Scale Farms", "Commercial Farms", "Claims Portal", "Support"] },
  { heading: "Company", links: ["About Us", "Blog", "Careers", "Contact"] },
];

export function Footer() {
  return (
    <Box component="footer" className="home-footer">
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 3, md: 4 } }}>
        <Grid container spacing={5} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Box component="img" src={logoMark} alt="StockGuard" sx={{ height: 32, width: "auto" }} />
              <Typography sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: "white" }}>
                StockGuard
              </Typography>
            </Stack>
            <p className="subtext" style={{ color: "rgba(255,255,255,.5)", fontSize: "0.85rem" }}>
              Protecting South African livestock since 2022. FSB-registered
              insurance services for every farmer.
            </p>
          </Grid>

          {FOOTER_COLUMNS.map((col) => (
            <Grid key={col.heading} size={{ xs: 6, sm: 3, lg: 3 }}>
              <p className="home-footer-heading">{col.heading}</p>
              <ul className="home-footer-links">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </Grid>
          ))}
        </Grid>

        <div className="home-footer-bottom">
          <span>
            © 2025 StockGuard (Pty) Ltd. All rights reserved. Registered
            Financial Services Provider.
          </span>
          <div>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">FSP Licence</a>
          </div>
        </div>
      </Box>
    </Box>
  );
}
