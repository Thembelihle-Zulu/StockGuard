import { useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DetailModal, DetailRow } from "./DetailModal";
import { EvidenceLink } from "./EvidenceLink";
import { API_ORIGIN } from "../utils/api";

export function InspectionModal({ open, setOpen, inspection, onValueSaved }) {
  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  const [approvedValue, setApprovedValue] = useState(
    inspection.approved_value ?? inspection.estimated_value ?? "",
  );
  const [notes, setNotes] = useState(inspection.valuation_notes ?? "");
  const [saving, setSaving] = useState(false);
  const [denyError, setDenyError] = useState(null);

  const handleApprove = () => {
    setDenyError(null);
    setSaving(true);
    Promise.resolve(
      onValueSaved?.({
        status: "approved",
        approved_value: approvedValue === "" ? null : Number(approvedValue),
        valuation_notes: notes || null,
      }),
    ).finally(() => setSaving(false));
  };

  const handleDeny = () => {
    if (!notes.trim()) {
      setDenyError("Add a reason so the farmer knows why this was denied.");
      return;
    }
    setDenyError(null);
    setSaving(true);
    Promise.resolve(
      onValueSaved?.({
        status: "denied",
        valuation_notes: notes,
      }),
    ).finally(() => setSaving(false));
  };

  return (
    <DetailModal
      open={open}
      setOpen={setOpen}
      title={`Inspection — ${inspection.tag_number || inspection.livestock_id}`}
      status={inspection.status}
      imageUrl={
        inspection.tag_photo_url
          ? `${API_ORIGIN}${inspection.tag_photo_url}`
          : null
      }
      imageAlt={`Tag photo for animal ${inspection.livestock_id}`}
    >
      <Stack
        spacing={0.5}
        divider={<Divider sx={{ borderColor: "oklch(0.92 0.01 154.55)" }} />}
      >
        <DetailRow
          label="Animal"
          value={inspection.tag_number || inspection.livestock_id}
        />
        <DetailRow label="Farm" value={inspection.farm_name || "—"} />
        <DetailRow
          label="Vet Reg. No."
          value={inspection.vet_registration_number || "—"}
        />
        <DetailRow
          label="Inspection Date"
          value={
            inspection.inspection_date
              ? new Date(inspection.inspection_date).toLocaleDateString()
              : "—"
          }
        />
        <DetailRow
          label="Declared Value"
          value={
            inspection.estimated_value != null
              ? `R ${Number(inspection.estimated_value).toLocaleString()}`
              : "—"
          }
        />
        <DetailRow
          label="Approved Value"
          value={
            inspection.approved_value != null
              ? `R ${Number(inspection.approved_value).toLocaleString()}`
              : "Not yet reviewed"
          }
        />
      </Stack>

      <EvidenceLink
        label="Veterinary Health Report"
        url={inspection.vet_health_report_url}
      />
      <EvidenceLink
        label="Value Evidence"
        url={inspection.evidence_document_url}
      />

      {!isAdmin && inspection.status === "denied" && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: "oklch(0.95 0.06 25)",
            border: "1px solid oklch(0.85 0.08 25)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: "block",
              fontWeight: 700,
              color: "oklch(0.45 0.15 25)",
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              mb: 0.25,
            }}
          >
            Reason for Denial
          </Typography>
          <Typography variant="body2" sx={{ color: "oklch(0.4 0.1 25)" }}>
            {inspection.valuation_notes ||
              "No reason was recorded — contact support for details."}
          </Typography>
        </Box>
      )}

      {!isAdmin && inspection.status !== "denied" && inspection.valuation_notes && (
        <Typography
          variant="body2"
          sx={{ mt: 2, color: "oklch(0.5 0.1 60)", fontStyle: "italic" }}
        >
          Inspector note: {inspection.valuation_notes}
        </Typography>
      )}

      {isAdmin && (
        <Stack spacing={1.5} sx={{ mt: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Review
          </Typography>
          <TextField
            label="Approved Value (R)"
            type="number"
            size="small"
            value={approvedValue}
            onChange={(e) => setApprovedValue(e.target.value)}
          />
          <TextField
            label="Notes (required if denying)"
            size="small"
            multiline
            minRows={2}
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              if (denyError) setDenyError(null);
            }}
          />
          {denyError && (
            <Typography variant="caption" color="error">
              {denyError}
            </Typography>
          )}
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              size="small"
              disabled={saving}
              onClick={handleApprove}
              sx={{
                textTransform: "none",
                borderRadius: "2rem",
                bgcolor: "oklch(0.32 0.1 154.55)",
                "&:hover": { bgcolor: "oklch(0.27 0.1 154.55)" },
              }}
            >
              {saving ? "Saving..." : "Approve"}
            </Button>
            <Button
              variant="outlined"
              size="small"
              disabled={saving}
              onClick={handleDeny}
              sx={{
                textTransform: "none",
                borderRadius: "2rem",
                borderColor: "oklch(0.6 0.15 25)",
                color: "oklch(0.5 0.15 25)",
                "&:hover": {
                  borderColor: "oklch(0.5 0.15 25)",
                  bgcolor: "oklch(0.97 0.03 25)",
                },
              }}
            >
              Deny
            </Button>
          </Stack>
        </Stack>
      )}
    </DetailModal>
  );
}
