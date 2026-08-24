import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { DetailModal, DetailRow } from "./DetailModal";

const API_ORIGIN = "http://127.0.0.1:5000";

function EvidenceLink({ label, url }) {
  if (!url) return null;
  return (
    <Button
      component="a"
      href={`${API_ORIGIN}${url}`}
      target="_blank"
      rel="noopener noreferrer"
      startIcon={<DescriptionOutlinedIcon />}
      sx={{
        justifyContent: "flex-start",
        textTransform: "none",
        color: "oklch(0.32 0.1 154.55)",
        border: "1px solid oklch(0.85 0.02 154.55)",
        borderRadius: 2,
        px: 2,
        py: 1,
        fontWeight: 500,
      }}
    >
      {label}
    </Button>
  );
}

export function ClaimModal({ open, setOpen, claim }) {
  return (
    <DetailModal
      open={open}
      setOpen={setOpen}
      title={claim.claim_type || "Claim"}
      status={claim.status}
      imageUrl={
        claim.incident_image ? `${API_ORIGIN}${claim.incident_image}` : null
      }
      imageAlt={`Incident photo for claim on livestock ${claim.livestock_id}`}
    >
      <Stack
        spacing={0.5}
        divider={<Divider sx={{ borderColor: "oklch(0.92 0.01 154.55)" }} />}
      >
        <DetailRow label="Animal" value={claim.livestock_id} />
        <DetailRow
          label="Date of Incident"
          value={
            claim.date_of_incident
              ? new Date(claim.date_of_incident).toLocaleDateString()
              : "—"
          }
        />
        {claim.claim_amount != null && (
          <DetailRow label="Claim Amount" value={`R${claim.claim_amount}`} />
        )}
      </Stack>

      <Box sx={{ mt: 2.5 }}>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mb: 1,
            color: "oklch(0.5 0.02 154.55)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          Cause
        </Typography>
        <Typography sx={{ color: "oklch(0.25 0.02 154.55)" }}>
          {claim.cause || "No description provided."}
        </Typography>
      </Box>

      {(claim.veterinary_invoice || claim.veterinary_death_report) && (
        <Box sx={{ mt: 2.5 }}>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mb: 1,
              color: "oklch(0.5 0.02 154.55)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
            }}
          >
            Evidence
          </Typography>
          <Stack spacing={1}>
            <EvidenceLink
              label="Veterinary Invoice"
              url={claim.veterinary_invoice}
            />
            <EvidenceLink
              label="Veterinary Death Report"
              url={claim.veterinary_death_report}
            />
          </Stack>
        </Box>
      )}
    </DetailModal>
  );
}
