import { useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DetailModal, DetailRow } from "./DetailModal";
import { EvidenceLink } from "./EvidenceLink";
import { API_ORIGIN, apiFetch } from "../utils/api";
import { uploadFile } from "../utils/uploadFile";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const INSPECTION_STATUS_LABEL = {
  pending: "Pending",
  approved: "Approved",
  denied: "Changes Requested",
};

export function InspectionModal({
  open,
  setOpen,
  inspection,
  onValueSaved,
  onResubmitted,
}) {
  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";
  const statusKey = (inspection.status || "pending").toLowerCase();

  const [approvedValue, setApprovedValue] = useState(
    inspection.approved_value ?? inspection.estimated_value ?? "",
  );
  const [notes, setNotes] = useState(inspection.valuation_notes ?? "");
  const [saving, setSaving] = useState(false);
  const [denyError, setDenyError] = useState(null);
  const [uploadingEvidence, setUploadingEvidence] = useState(false);
  const [evidenceUploaded, setEvidenceUploaded] = useState(false);
  const [evidenceError, setEvidenceError] = useState(null);

  // A denied inspection can be missing exactly the thing that would fix
  // it — a valuation certificate, an auction receipt, etc. This resends
  // the inspection through the same resubmission path the full "Submit
  // Vet Report" form uses (existing fields carried over unchanged, only
  // the evidence document is new), which resets status to pending
  // server-side — no new endpoint needed.
  const handleEvidenceUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingEvidence(true);
    setEvidenceError(null);
    try {
      const url = await uploadFile(file, "inspections");
      const res = await apiFetch("onboarding/inspection", {
        method: "POST",
        body: JSON.stringify({
          livestock_id: inspection.livestock_id,
          inspectionDate: inspection.inspection_date,
          animalTagNameImage: inspection.tag_photo_url,
          vetenaryHealthReport: inspection.vet_health_report_url,
          vetRegistrationNumber: inspection.vet_registration_number,
          valuationEvidence: url,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit evidence");
      setEvidenceUploaded(true);
      onResubmitted?.();
    } catch (err) {
      console.error(err);
      setEvidenceError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploadingEvidence(false);
    }
  };

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
      setDenyError("Add a reason so the farmer knows what to fix.");
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
      statusLabel={INSPECTION_STATUS_LABEL[statusKey]}
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
            Changes Requested
          </Typography>
          <Typography variant="body2" sx={{ color: "oklch(0.4 0.1 25)" }}>
            {inspection.valuation_notes ||
              "No reason was recorded — contact support for details."}
          </Typography>
        </Box>
      )}

      {!isAdmin &&
        inspection.status === "denied" &&
        !inspection.evidence_document_url &&
        (evidenceUploaded ? (
          <Typography
            variant="body2"
            sx={{ mt: 1.5, color: "oklch(0.4 0.13 154.55)", fontWeight: 600 }}
          >
            ✓ Evidence uploaded — your inspection is back under review.
          </Typography>
        ) : (
          <Box sx={{ mt: 1.5 }}>
            <Button
              component="label"
              role={undefined}
              tabIndex={-1}
              size="small"
              startIcon={<CloudUploadIcon />}
              disabled={uploadingEvidence}
              sx={{
                bgcolor: "transparent",
                color: "oklch(0.32 0.1 154.55)",
                border: "1.5px solid oklch(0.8 0.03 154.55)",
                borderRadius: "2rem",
                px: "1.25rem",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: "oklch(0.97 0.02 154.55)" },
              }}
            >
              {uploadingEvidence ? "Uploading..." : "Upload Value Evidence"}
              <VisuallyHiddenInput
                type="file"
                onChange={handleEvidenceUpload}
              />
            </Button>
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 0.5, color: "oklch(0.55 0.01 90)" }}
            >
              Auction receipt, purchase invoice, or valuation certificate —
              submitting this sends your inspection back for review.
            </Typography>
            {evidenceError && (
              <Typography color="error" variant="caption" display="block">
                {evidenceError}
              </Typography>
            )}
          </Box>
        ))}

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
            label="Notes (required if requesting changes)"
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
              Request Changes
            </Button>
          </Stack>
        </Stack>
      )}
    </DetailModal>
  );
}
