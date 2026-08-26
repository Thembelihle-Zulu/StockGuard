import { Card, CardContent, Typography, Box, Chip } from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

export function KpiCard({
  icon,
  value,
  label,
  subText,
  trend,
  trendDirection = "up",
  accent = "#2A5E38",
  accentBg = "#EAF2EB",
}) {
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: accentBg,
              color: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>

          <Chip
            icon={
              trendDirection === "up" ? (
                <TrendingUpIcon />
              ) : (
                <TrendingDownIcon />
              )
            }
            label={trend}
            size="small"
            color={trendDirection === "up" ? "success" : "error"}
            variant="outlined"
          />
        </Box>

        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>

        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          {label}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {subText}
        </Typography>
      </CardContent>
    </Card>
  );
}
