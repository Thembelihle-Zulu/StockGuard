import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { DetailModal } from "../DetailModal";
import { DetailRow } from "../DetailModal";

import { EvidenceLink } from "./EvidenceLink";

const API_ORIGIN = "http://127.0.0.1:5000";

export function InspectionModal({ open, setOpen, inspection }) {
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
          label="Inspection Date"
          value={
            inspection.inspection_date
              ? new Date(inspection.inspection_date).toLocaleDateString()
              : "—"
          }
        />
      </Stack>

      <EvidenceLink
        label="Veterinary Health Report"
        url={inspection.vet_health_report_url}
      />
    </DetailModal>
  );
}
