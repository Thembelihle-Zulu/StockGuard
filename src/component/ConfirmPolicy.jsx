import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CheckIcon from "@mui/icons-material/Check";

const API_BASE = "http://127.0.0.1:5000/api/onboarding";

export function ConfirmPolicy({
  setActiveStep,
  setCreatedPolicy,
  farmProfile,
  firstAnimal,
  inspection,
  cover,
}) {
  // Payment method is UI-only for now — there's no column for it on the
  // `policy` table, so it isn't sent in the POST. Add a `payment_method`
  // column (or a separate `payment` table) if you want this persisted.
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const monthlyPremium = cover?.monthlyPremium ?? 0;

  const handleActivate = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const policyPayload = {
        policy_number: `POL-${Date.now()}`,
        farm_profile_id: farmProfile?.id,
        product_id: 1, // Livestock Health Cover product id
        creation_date: new Date().toISOString(),
        status: "Active",
        monthly_premium: monthlyPremium,
        animal_count_at_pricing: cover?.declaredAnimalCount ?? 1,
      };

      const policyRes = await fetch(`${API_BASE}/policy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(policyPayload),
      });
      if (!policyRes.ok) throw new Error("Failed to create policy");
      const savedPolicy = await policyRes.json();

      console.log("Policy activated:", savedPolicy);
      setCreatedPolicy(savedPolicy);
      setActiveStep((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <Box className="onboarding-card" sx={{ textAlign: "center" }}>
        <Typography variant="overline" color="text.secondary">
          Step 5
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Confirm Policy
        </Typography>

        <Avatar
          sx={{
            bgcolor: "grey.100",
            color: "text.primary",
            width: 56,
            height: 56,
            mx: "auto",
            mb: 2,
          }}
        >
          <DescriptionOutlinedIcon />
        </Avatar>

        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Review Policy
        </Typography>

        <Box sx={{ textAlign: "left" }}>
          <ReviewRow label="Farm" value={farmProfile?.farmName || "-"} />
          <ReviewRow label="Farmer Type" value={farmProfile?.farmType || "-"} />
          <ReviewRow
            label="Animal"
            value={
              firstAnimal
                ? `${firstAnimal.species || ""} #${firstAnimal.tagNumber || ""}`
                : "-"
            }
          />
          <ReviewRow
            label="Animals Insured"
            value={cover?.declaredAnimalCount ?? "-"}
          />
          <ReviewRow
            label="Coverage Tier"
            value={cover?.coverageTier === "full" ? "Full" : "Basic"}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
            <Typography color="text.secondary">Coverage</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CheckIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography>Livestock Health Cover</Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1,
            }}
          >
            <Typography color="text.secondary">Inspection</Typography>
            <Chip
              label={
                !inspection?.status || inspection.status === "pending"
                  ? "Pending Review"
                  : inspection.status
              }
              sx={{ bgcolor: "grey.200" }}
              size="small"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: "left" }}>
          <Typography color="text.secondary">Monthly Premium</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            R{monthlyPremium}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: "left" }}>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Payment Method
          </Typography>
          <FormControl>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="mobile_money"
                control={<Radio />}
                label="Mobile Money"
              />
              <FormControlLabel
                value="card"
                control={<Radio />}
                label="Debit / Credit Card"
              />
            </RadioGroup>
          </FormControl>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          disabled={submitting}
          onClick={handleActivate}
          sx={{
            mt: 3,
            bgcolor: "grey.800",
            "&:hover": { bgcolor: "grey.900" },
            py: 1.5,
          }}
        >
          {submitting ? "Activating..." : "Activate Policy"}
        </Button>
      </Box>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography>{value}</Typography>
    </Box>
  );
}
