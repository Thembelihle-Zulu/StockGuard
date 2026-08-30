import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { apiFetch } from "../utils/api";

function maskAccountNumber(accountNumber) {
  const digits = String(accountNumber || "").replace(/\s/g, "");
  const last4 = digits.slice(-4);
  return `•••• •••• ${last4}`;
}

export function BankDetailsCard({ bankName, bankAccountNumber, onSaved }) {
  const [open, setOpen] = useState(false);
  const [nameInput, setNameInput] = useState(bankName || "");
  const [numberInput, setNumberInput] = useState(bankAccountNumber || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const hasDetails = Boolean(bankName && bankAccountNumber);

  const handleOpen = () => {
    setNameInput(bankName || "");
    setNumberInput(bankAccountNumber || "");
    setError(null);
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await apiFetch("onboarding/farm_profile/me", {
        method: "PUT",
        body: JSON.stringify({
          bank_name: nameInput || null,
          bank_account_number: numberInput || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save banking details");
      onSaved?.({ bank_name: nameInput, bank_account_number: numberInput });
      setOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          fontWeight: 700,
          color: "oklch(0.5 0.02 154.55)",
          textTransform: "uppercase",
          letterSpacing: "0.03em",
          mb: 0.75,
        }}
      >
        Banking Details
      </Typography>

      {hasDetails ? (
        <Box
          sx={{
            position: "relative",
            borderRadius: 3,
            p: 2.25,
            background:
              "linear-gradient(135deg, oklch(0.32 0.1 154.55), oklch(0.22 0.05 154.55))",
            color: "white",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,.06)",
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2.5,
            }}
          >
            <AccountBalanceIcon sx={{ opacity: 0.85 }} />
            <IconButton
              size="small"
              onClick={handleOpen}
              aria-label="Change banking details"
              sx={{ color: "rgba(255,255,255,.85)" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography
            sx={{
              fontFamily: '"Courier New", monospace',
              fontSize: "1.15rem",
              letterSpacing: "0.08em",
              fontWeight: 600,
            }}
          >
            {maskAccountNumber(bankAccountNumber)}
          </Typography>
          <Typography
            sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,.75)", mt: 0.75 }}
          >
            {bankName}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            border: "1px dashed oklch(0.85 0.02 154.55)",
            borderRadius: 3,
            p: 2.5,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: "0.85rem", color: "oklch(0.55 0.01 90)", mb: 1.25 }}>
            No banking details on file yet.
          </Typography>
          <Button
            size="small"
            onClick={handleOpen}
            sx={{
              textTransform: "none",
              borderRadius: "2rem",
              border: "1.5px solid oklch(0.8 0.03 154.55)",
              color: "oklch(0.32 0.1 154.55)",
              px: 2,
              "&:hover": { bgcolor: "oklch(0.97 0.02 154.55)" },
            }}
          >
            Add Banking Details
          </Button>
        </Box>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4 } } }}
      >
        <DialogContent sx={{ p: 3 }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "oklch(0.2 0.03 154.55)",
              }}
            >
              {hasDetails ? "Change Banking Details" : "Add Banking Details"}
            </Typography>
            <IconButton size="small" onClick={() => setOpen(false)} aria-label="Close">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Stack spacing={2}>
            <TextField
              label="Bank Name"
              fullWidth
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <TextField
              label="Account Number"
              fullWidth
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
            />
            {error && (
              <Typography color="error" variant="caption">
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              disabled={saving}
              onClick={handleSave}
              sx={{
                textTransform: "none",
                borderRadius: "2rem",
                bgcolor: "oklch(0.32 0.1 154.55)",
                "&:hover": { bgcolor: "oklch(0.27 0.1 154.55)" },
              }}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
