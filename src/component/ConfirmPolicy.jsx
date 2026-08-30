import { useEffect, useState } from "react";
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
import { apiFetch } from "../utils/api";
import "../styles/onboarding.css";
export function ConfirmPolicy({
  setActiveStep,
  farmProfileId,
  firstAnimalId,
  inspectionId,
  cover,
  onCreated,
}) {
  const [farm, setFarm] = useState(null);
  const [animal, setAnimal] = useState(null);
  const [inspectionStatus, setInspectionStatus] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (farmProfileId) {
      apiFetch(`onboarding/farm_profile/${farmProfileId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setFarm(data))
        .catch((err) => console.error(err));
    }
  }, [farmProfileId]);

  useEffect(() => {
    if (firstAnimalId) {
      apiFetch(`onboarding/animal/${firstAnimalId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => data && setAnimal(data))
        .catch((err) => console.error(err));
    }
  }, [firstAnimalId]);

  useEffect(() => {
    if (inspectionId) {
      apiFetch(`onboarding/inspection/${inspectionId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => data && setInspectionStatus(data.status))
        .catch((err) => console.error(err));
    }
  }, [inspectionId]);

  const monthlyPremium = cover?.monthlyPremium ?? 0;

  const handleSubmitPolicy = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const policyPayload = {
        policy_number: `POL-${Date.now()}`,
        product_id: 1,
        status: "Pending",
        monthly_premium: monthlyPremium,
        animal_count_at_pricing: cover?.declaredAnimalCount ?? 1,
        insured_value_at_pricing: cover?.estimatedHerdValue ?? null,
      };

      const policyRes = await apiFetch("onboarding/policy", {
        method: "POST",
        body: JSON.stringify(policyPayload),
      });
      if (!policyRes.ok) throw new Error("Failed to create policy");
      const savedPolicy = await policyRes.json();

      onCreated(savedPolicy);
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
          <ReviewRow label="Farm" value={farm?.farm_name || "-"} />
          <ReviewRow label="Farmer Type" value={farm?.farm_type || "-"} />
          <ReviewRow
            label="Animal"
            value={
              animal
                ? `${animal.species || ""} #${animal.tag_number || ""}`
                : "-"
            }
          />
          <ReviewRow
            label="Insured Value"
            value={
              cover?.estimatedHerdValue != null
                ? `R ${Number(cover.estimatedHerdValue).toLocaleString()}`
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
                !inspectionStatus || inspectionStatus === "pending"
                  ? "Pending Review"
                  : inspectionStatus
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
          onClick={handleSubmitPolicy}
          sx={{
            mt: 3,
            bgcolor: "grey.800",
            "&:hover": { bgcolor: "grey.900" },
            py: 1.5,
          }}
        >
          {submitting ? "Submitting..." : "Submit Policy"}
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
