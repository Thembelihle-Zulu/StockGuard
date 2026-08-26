import { Box, Stack, Typography, Button } from "@mui/material";
import "../styles/home.css";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import BoltIcon from "@mui/icons-material/Bolt";

const coverCards = [
  {
    title: "Illness Cover",
    body: "Comprehensive protection against veterinary-certified illness and disease outbreaks, covering diagnosis, treatment, and losses resulting from sickness.",
  },
  {
    title: "Injury Cover",
    body: "Comprehensive protection against veterinary-certified illness and disease outbreaks, covering diagnosis, treatment, and losses resulting from sickness.",
  },
  {
    title: "Mortality Cover",
    body: "Comprehensive protection against veterinary-certified illness and disease outbreaks, covering diagnosis, treatment, and losses resulting from sickness.",
  },
];

const timelineSteps = [
  {
    number: "01",
    icon: <AgricultureIcon sx={{ color: "white" }} />,
    title: "Register Farm",
    body: "Create your StockGuard account and register your farm details in under 5 minutes.",
  },
  {
    number: "02",
    icon: <AgricultureIcon sx={{ color: "white" }} />,
    title: "Register Livestock",
    body: "Add your animals with species, breed, age, and current market value — individually or in bulk.",
  },
  {
    number: "03",
    icon: <DescriptionOutlinedIcon sx={{ color: "white" }} />,
    title: "Choose Coverage",
    body: "Select illness, injury, or mortality cover. Mix and match plans to fit your budget and risk profile.",
  },
  {
    number: "04",
    icon: <AssignmentOutlinedIcon sx={{ color: "white" }} />,
    title: "Submit & Track Claims",
    body: "File claims from your phone. Track status in real time and receive payouts directly to your account.",
  },
];

function SectionIntro({ eyebrow, title, body }) {
  return (
    <Stack
      sx={{
        textAlign: "center",
        alignItems: "center",
        gap: 1,
        maxWidth: "40rem",
        mx: "auto",
      }}
    >
      <Typography
        sx={{
          textTransform: "uppercase",
          color: "oklch(0.4 0.13 154.55)",
          fontWeight: 600,
          fontSize: "0.85rem",
          letterSpacing: "0.05em",
          m: 0,
        }}
      >
        {eyebrow}
      </Typography>
      <Typography component="h2" sx={{ m: 0, fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography sx={{ m: 0, color: "text.secondary" }}>{body}</Typography>
    </Stack>
  );
}

export function WhyUs() {
  return (
    <>
      {/* ---------- Why Choose StockGuard ---------- */}
      <Box
        component="section"
        className="why-us"
        sx={{ minHeight: 600, pt: "5rem" }}
      >
        <SectionIntro
          eyebrow="Coverage that works"
          title="Why Choose StockGuard"
          body="Three essential layers of protection — designed around the real risks South African farmers face every season."
        />

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ mt: 5 }}
        >
          {coverCards.map((card) => (
            <Box
              key={card.title}
              className="cover-card"
              sx={{
                bgcolor: "rgb(238, 237, 234)",
                borderRadius: "1rem",
                p: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                flex: 1,
              }}
            >
              <Box
                className="icon-badge"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "0.75rem",
                  bgcolor: "oklch(0.95 0.03 154)",
                }}
              >
                <BoltIcon sx={{ color: "oklch(0.35 0.11 154.55)" }} />
              </Box>
              <Typography component="h3" sx={{ m: 0, fontWeight: 700 }}>
                {card.title}
              </Typography>
              <Typography sx={{ m: 0, color: "text.secondary" }}>
                {card.body}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* ---------- How It Works ---------- */}
      <Box
        component="section"
        className="how"
        sx={{
          textAlign: "center",
          py: "5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "3rem",
        }}
      >
        <SectionIntro
          eyebrow="Simple Process"
          title="How It Works"
          body="From registration to claim payout — a transparent, four-step process built around your needs."
        />

        <Stack
          direction="row"
          justifyContent="center"
          spacing={{ xs: 3, md: 8 }}
          sx={{
            maxWidth: "70rem",
            width: "100%",
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          {timelineSteps.map((step, i) => (
            <Box
              key={step.number}
              className="timeline-step"
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
                maxWidth: "16rem",
                // connecting line, same logic as the original ::after — omitted on the last step
                "&::after":
                  i < timelineSteps.length - 1
                    ? {
                        content: '""',
                        position: "absolute",
                        top: "1.75rem",
                        left: "calc(50% + 2.5rem)",
                        width: "calc(100% + 4rem - 5rem)",
                        height: "1px",
                        bgcolor: "oklch(0.85 0.03 154)",
                        display: { xs: "none", md: "block" },
                      }
                    : undefined,
              }}
            >
              <Box
                className="timeline-icon"
                sx={{
                  position: "relative",
                  width: "3.5rem",
                  height: "3.5rem",
                  borderRadius: "1rem",
                  bgcolor: "oklch(0.35 0.11 154.55)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {step.icon}
                <Box
                  className="step-number"
                  sx={{
                    position: "absolute",
                    top: "-0.5rem",
                    right: "-0.5rem",
                    width: "1.25rem",
                    height: "1.25rem",
                    borderRadius: "50%",
                    bgcolor: "oklch(0.9 0.05 154.55)",
                    color: "oklch(0.35 0.11 154.55)",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {step.number}
                </Box>
              </Box>
              <Typography
                component="h3"
                sx={{ m: 0, fontSize: "1.1rem", fontWeight: 700 }}
              >
                {step.title}
              </Typography>
              <Typography
                sx={{
                  m: 0,
                  color: "gray",
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                }}
              >
                {step.body}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Button
          sx={{
            bgcolor: "oklch(0.35 0.11 154.55)",
            color: "white",
            borderRadius: "2rem",
            px: "2rem",
            py: "0.9rem",
            fontWeight: 600,
            fontSize: "1rem",
            textTransform: "none",
            "&:hover": { bgcolor: "oklch(0.3 0.11 154.55)" },
          }}
          endIcon={<span>➡️</span>}
        >
          Start Your Registration
        </Button>
      </Box>
    </>
  );
}
