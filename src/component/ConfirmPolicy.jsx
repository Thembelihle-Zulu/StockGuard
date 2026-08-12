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

const API_BASE = "https://6a6284d51bffb2ffab8b5373.mockapi.io";

export function ConfirmPolicy({
  setActiveStep,
  farmProfile,
  firstAnimal,
  inspection,
}) {
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const monthlyPremium = 250;

  const handleActivate = async () => {
    setSubmitting(true);
    setError(null);

    try {
      // 1. Save farm profile
      const farmRes = await fetch(`${API_BASE}/farm_profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(farmProfile),
      });
      if (!farmRes.ok) throw new Error("Failed to save farm profile");
      const savedFarmProfile = await farmRes.json();

      // 2. Save first animal
      const animalRes = await fetch(`${API_BASE}/animal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...firstAnimal,
          farm_profile_id: savedFarmProfile.id,
        }),
      });
      if (!animalRes.ok) throw new Error("Failed to save animal");
      const savedAnimal = await animalRes.json();

      // 3. Save inspection
      const inspectionRes = await fetch(`${API_BASE}/inspection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...inspection,
          animal_id: savedAnimal.id,
        }),
      });
      if (!inspectionRes.ok) throw new Error("Failed to save inspection");
      await inspectionRes.json();

      // 4. Create the policy record
      const policyPayload = {
        policy_number: `POL-${Date.now()}`,
        farm_profile_id: savedFarmProfile.id,
        product_id: 1, // Livestock Health Cover product id
        creation_date: new Date().toISOString(),
        status: "Active",
        monthly_premium: monthlyPremium,
        payment_method: paymentMethod, // extra field, drop if not on your table
      };

      const policyRes = await fetch(`${API_BASE}/policy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(policyPayload),
      });
      if (!policyRes.ok) throw new Error("Failed to create policy");
      const savedPolicy = await policyRes.json();

      console.log("Policy activated:", savedPolicy);
      setCreatedPolicy(savedPolicy); // add this line
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
          <ReviewRow label="Farm" value={farmProfile?.farm_name || "-"} />
          <ReviewRow
            label="Farmer Type"
            value={farmProfile?.farm_type || "-"}
          />
          <ReviewRow
            label="Animal"
            value={
              firstAnimal
                ? `${firstAnimal.animal_type || ""} #${
                    firstAnimal.tag_number || ""
                  }`
                : "-"
            }
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
                !inspection?.status
                  ? "Pending Review"
                  : inspection.status === "pending"
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
