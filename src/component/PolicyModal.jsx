import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { DetailModal, DetailRow } from "./DetailModal";

export function PolicyModal({ open, setOpen, policy }) {
  return (
    <DetailModal
      open={open}
      setOpen={setOpen}
      title={policy.policy_number}
      status={policy.status}
    >
      <Stack
        spacing={0.5}
        divider={<Divider sx={{ borderColor: "oklch(0.92 0.01 154.55)" }} />}
      >
        <DetailRow label="Farm" value={policy.farm_name || "—"} />
        <DetailRow label="Product ID" value={policy.product_id} />
        <DetailRow
          label="Monthly Premium"
          value={
            policy.monthly_premium != null
              ? `R ${Number(policy.monthly_premium).toLocaleString()}`
              : "—"
          }
        />
        <DetailRow
          label="Animals Covered"
          value={policy.animal_count_at_pricing}
        />
        <DetailRow
          label="Created"
          value={
            policy.creation_date
              ? new Date(policy.creation_date).toLocaleDateString()
              : "—"
          }
        />
      </Stack>
    </DetailModal>
  );
}
