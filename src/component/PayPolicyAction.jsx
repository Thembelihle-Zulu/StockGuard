import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { apiFetch } from "../utils/api";

// The "pay to activate a pending policy" flow — shared by PoliciesList.jsx
// and PaymentsList.jsx so a farmer can actually pay from either place,
// not just the one page that happened to have the button.
export function PayPolicyAction({ policy, canActivate, onPaid, buttonSx }) {
  const [payOpen, setPayOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Card");

  const handlePay = () => {
    setPaying(true);
    setPayError(null);
    apiFetch(`payments/${policy.policy_number}`, {
      method: "POST",
      body: JSON.stringify({ payment_method: paymentMethod }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || "Payment failed.");
        }
        return res.json();
      })
      .then(({ policy: updated }) => {
        onPaid?.(updated);
        setPayOpen(false);
      })
      .catch((err) => setPayError(err.message))
      .finally(() => setPaying(false));
  };

  return (
    <>
      <Button
        variant="contained"
        disabled={!canActivate}
        onClick={() => setPayOpen(true)}
        sx={
          buttonSx || {
            textTransform: "none",
            borderRadius: "2rem",
            bgcolor: "oklch(0.32 0.1 154.55)",
            "&:hover": { bgcolor: "oklch(0.27 0.1 154.55)" },
          }
        }
      >
        Pay & Activate — R {Number(policy.monthly_premium).toLocaleString()}
      </Button>

      <Dialog
        open={payOpen}
        onClose={() => setPayOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Pay & Activate Policy</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            R {Number(policy.monthly_premium).toLocaleString()} — first
            month's premium for {policy.policy_number}.
          </Typography>
          <FormControl>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="Card"
                control={<Radio />}
                label="Debit / Credit Card"
              />
              <FormControlLabel
                value="Mobile Money"
                control={<Radio />}
                label="Mobile Money"
              />
            </RadioGroup>
          </FormControl>
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 1.5, color: "oklch(0.55 0.01 90)" }}
          >
            No real payment is processed — this is a mock for demonstration.
          </Typography>
          {payError && (
            <Typography color="error" variant="body2" sx={{ mt: 1.5 }}>
              {payError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePay} disabled={paying}>
            {paying ? "Processing..." : "Pay Now"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
