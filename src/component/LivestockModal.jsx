import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { DetailModal, DetailRow } from "./DetailModal";
import { API_ORIGIN } from "../utils/api";

export function LivestockModal({ open, setOpen, livestock }) {
  return (
    <DetailModal
      open={open}
      setOpen={setOpen}
      title={`${livestock.species || "Animal"} #${livestock.tag_number || ""}`}
      status={livestock.status}
      imageUrl={livestock.image ? `${API_ORIGIN}${livestock.image}` : null}
      imageAlt={`Photo of ${livestock.species || "animal"} #${livestock.tag_number}`}
    >
      <Stack
        spacing={0.5}
        divider={<Divider sx={{ borderColor: "oklch(0.92 0.01 154.55)" }} />}
      >
        <DetailRow label="Species" value={livestock.species || "—"} />
        <DetailRow label="Breed" value={livestock.breed || "—"} />
        <DetailRow label="Age" value={livestock.age ?? "—"} />
        <DetailRow
          label="Estimated Value"
          value={
            livestock.estimated_value != null
              ? `R${livestock.estimated_value}`
              : "—"
          }
        />
        <DetailRow label="Tag Number" value={livestock.tag_number || "—"} />
      </Stack>
    </DetailModal>
  );
}
