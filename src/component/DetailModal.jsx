import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

const BootstrapDialog = styled(Dialog)(() => ({
  "& .MuiDialogContent-root": {
    padding: 0,
  },
  "& .MuiPaper-root": {
    borderRadius: 20,
    overflow: "hidden",
  },
}));

const STATUS_COLORS = {
  pending: { bg: "oklch(0.95 0.05 90)", color: "oklch(0.45 0.1 90)" },
  approved: { bg: "oklch(0.95 0.05 154.55)", color: "oklch(0.32 0.1 154.55)" },
  active: { bg: "oklch(0.95 0.05 154.55)", color: "oklch(0.32 0.1 154.55)" },
  alive: { bg: "oklch(0.95 0.05 154.55)", color: "oklch(0.32 0.1 154.55)" },
  denied: { bg: "oklch(0.95 0.06 25)", color: "oklch(0.45 0.15 25)" },
  deceased: { bg: "oklch(0.95 0.06 25)", color: "oklch(0.45 0.15 25)" },
};

function StatusChip({ status, label }) {
  const key = (status || "pending").toLowerCase();
  const palette = STATUS_COLORS[key] || STATUS_COLORS.pending;

  return (
    <Chip
      label={label || status || "Pending"}
      size="small"
      sx={{
        bgcolor: palette.bg,
        color: palette.color,
        fontWeight: 600,
        textTransform: "capitalize",
      }}
    />
  );
}

// Shared dialog shell for any "view details" modal — a hero image up top,
// a title + status chip, a content area for record-specific fields
// (passed as children), and a single Close action. Extracted so Claim
// and Livestock detail modals don't each duplicate this structure.
export function DetailModal({
  open,
  setOpen,
  title,
  status,
  statusLabel,
  imageUrl,
  imageAlt,
  children,
}) {
  const handleClose = () => setOpen(false);

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="detail-modal-title"
      open={open}
      maxWidth="sm"
      fullWidth
    >
      {imageUrl && (
        <Box
          component="img"
          src={imageUrl}
          alt={imageAlt || ""}
          sx={{
            width: "100%",
            height: 220,
            objectFit: "cover",
            display: "block",
          }}
        />
      )}

      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 12,
          top: 12,
          bgcolor: "rgba(255,255,255,0.9)",
          "&:hover": { bgcolor: "white" },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <DialogTitle
        id="detail-modal-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: '"Playfair Display", Georgia, serif',
          fontWeight: 700,
          fontSize: "1.4rem",
          color: "oklch(0.2 0.03 154.55)",
          pt: 3,
        }}
      >
        {title}
        <StatusChip status={status} label={statusLabel} />
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 1 }}>{children}</DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          fullWidth
          variant="contained"
          sx={{
            bgcolor: "oklch(0.32 0.1 154.55)",
            color: "white",
            borderRadius: "2rem",
            py: 1,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": { bgcolor: "oklch(0.27 0.1 154.55)", boxShadow: "none" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

// Reusable row + section pieces, so both modals' content stays consistent
export function DetailRow({ label, value }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
      <Box
        component="span"
        sx={{ color: "oklch(0.5 0.02 154.55)", fontSize: "0.9rem" }}
      >
        {label}
      </Box>
      <Box
        component="span"
        sx={{ fontWeight: 600, color: "oklch(0.2 0.03 154.55)" }}
      >
        {value}
      </Box>
    </Box>
  );
}
