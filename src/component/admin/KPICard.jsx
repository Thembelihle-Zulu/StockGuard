import { Card, CardContent, Typography, Box } from "@mui/material";

export function KpiCard({
  icon,
  value,
  label,
  subText,
  accent = "oklch(0.32 0.1 154.55)",
  accentBg = "oklch(0.95 0.05 154.55)",
}) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        height: "100%",
        border: "1px solid oklch(0.91 0.005 90)",
        borderInlineStart: `4px solid ${accent}`,
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 1.5,
            backgroundColor: accentBg,
            color: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1.25,
            "& svg": { fontSize: "1.1rem" },
          }}
        >
          {icon}
        </Box>

        <Typography
          sx={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "oklch(0.2 0.03 154.55)",
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.82rem",
            fontWeight: 600,
            color: "oklch(0.3 0.02 154.55)",
            mt: 0.2,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{ fontSize: "0.72rem", color: "oklch(0.55 0.02 90)", mt: 0.15 }}
        >
          {subText}
        </Typography>
      </CardContent>
    </Card>
  );
}
