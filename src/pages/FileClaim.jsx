import { useEffect, useState } from "react";
import { TextField, Typography, Stack, Paper, IconButton } from "@mui/material";
import { useFormik } from "formik";
import { object, string, number, date } from "yup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";
import { apiFetch } from "../utils/api";
import { uploadFile } from "../utils/uploadFile";
import "../styles/claims-list.css";
const claimTypes = ["Treatment Claim", "Mortality Claim"];

const claimSchema = object({
  livestockId: string().required("Select the animal this claim is for"),
  claimType: string().required("Select a claim type"),
  cause: string()
    .required("Describe the cause of the claim")
    .max(255, "Keep this under 255 characters"),
  dateOfIncident: date()
    .required("Select the date of the incident")
    .max(new Date(), "Date of incident can't be in the future"),
  claimAmount: number()
    .typeError("Enter a number")
    .positive("Enter an amount greater than 0")
    .required("Claim amount is required"),
  incidentImage: string().required("Please upload a photo of the incident"),
  veterinaryInvoice: string().when("claimType", {
    is: "Treatment Claim",
    then: (schema) => schema.required("Please upload the veterinary invoice"),
    otherwise: (schema) => schema.notRequired(),
  }),
  veterinaryDeathReport: string().when("claimType", {
    is: "Mortality Claim",
    then: (schema) =>
      schema.required("Please upload the veterinary death report"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

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

const ELIGIBLE_INSPECTION_STATUS = "approved";

export function FileClaim({ handleClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [animalsError, setAnimalsError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [policiesLoaded, setPoliciesLoaded] = useState(false);
  const [farmProfile, setFarmProfile] = useState(null);
  const [farmProfileLoaded, setFarmProfileLoaded] = useState(false);

  useEffect(() => {
    apiFetch("onboarding/animal")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setAnimals(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setAnimalsError("Couldn't load your animals. Please try again.");
      });

    apiFetch("onboarding/inspection")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setInspections(Array.isArray(data) ? data : []))
      .catch(console.error);

    apiFetch("onboarding/policy")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setPolicies(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setPoliciesLoaded(true));

    apiFetch("onboarding/farm_profile/me")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then(setFarmProfile)
      .catch(console.error)
      .finally(() => setFarmProfileLoaded(true));
  }, []);

  const hasActivePolicy = policies.some((p) => p.status === "Active");
  const hasIdentityVerification = Boolean(
    farmProfile?.id_number &&
      farmProfile?.bank_name &&
      farmProfile?.bank_account_number,
  );

  const inspectionByAnimalId = {};
  inspections.forEach((inspection) => {
    inspectionByAnimalId[inspection.livestock_id] = inspection;
  });

  const animalsWithEligibility = animals.map((animal) => {
    const inspection = inspectionByAnimalId[animal.id];
    const eligible = inspection?.status === ELIGIBLE_INSPECTION_STATUS;
    const reason = !inspection
      ? "not inspected"
      : inspection.status === "pending"
        ? "inspection pending"
        : inspection.status === "denied"
          ? "inspection denied"
          : null;
    return { ...animal, eligible, reason, approvedValue: inspection?.approved_value };
  });

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      livestockId: "",
      claimType: "",
      cause: "",
      dateOfIncident: null,
      claimAmount: "",
      incidentImage: "",
      veterinaryInvoice: "",
      veterinaryDeathReport: "",
    },
    validationSchema: claimSchema,
    onSubmit: async (data) => {
      setSubmitting(true);
      setSubmitError(null);

      try {
        const res = await apiFetch("claims", {
          method: "POST",
          body: JSON.stringify({
            livestock_id: data.livestockId,
            claim_type: data.claimType,
            cause: data.cause,
            date_of_incident: data.dateOfIncident,
            claim_amount: data.claimAmount,
            incident_image: data.incidentImage,
            veterinary_invoice: data.veterinaryInvoice || null,
            veterinary_death_report: data.veterinaryDeathReport || null,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || "Failed to submit claim");
        }

        await res.json();

        onSuccess && onSuccess();
        handleClose();
      } catch (err) {
        console.error(err);
        setSubmitError(
          err.message || "Something went wrong. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const selectedAnimal = animalsWithEligibility.find(
    (animal) => animal.id === values.livestockId,
  );

  const handleFileChange = (fieldName, subfolder) => async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile(file, subfolder);
      setFieldValue(fieldName, url);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "oklch(0.32 0.1 154.55)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "oklch(0.32 0.1 154.55)",
    },
  };

  const uploadButtonSx = {
    bgcolor: "transparent",
    color: "oklch(0.32 0.1 154.55)",
    border: "1.5px solid oklch(0.8 0.03 154.55)",
    borderRadius: "2rem",
    px: "1.5rem",
    py: "0.6rem",
    textTransform: "none",
    fontWeight: 600,
    "&:hover": { bgcolor: "oklch(0.97 0.02 154.55)" },
  };

  const renderBlockingNotice = (title, message) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: { xs: 4, md: 6 },
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 560,
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          border: "1px solid oklch(0.9 0.02 154.55)",
          textAlign: "center",
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "oklch(0.2 0.03 154.55)",
            mb: 1.5,
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ color: "oklch(0.5 0.02 154.55)", mb: 3 }}>
          {message}
        </Typography>
        <Button
          variant="contained"
          onClick={handleClose}
          sx={{
            textTransform: "none",
            borderRadius: "2rem",
            bgcolor: "oklch(0.32 0.1 154.55)",
            "&:hover": { bgcolor: "oklch(0.27 0.1 154.55)" },
          }}
        >
          Got it
        </Button>
      </Paper>
    </Box>
  );

  if (policiesLoaded && !hasActivePolicy) {
    return renderBlockingNotice(
      "You need an active policy to file a claim",
      policies.length === 0
        ? "You don't have a policy yet — set one up from the Policies section."
        : "Your policy isn't active yet — pay it to activate cover from the Policies section.",
    );
  }

  if (farmProfileLoaded && !hasIdentityVerification) {
    return renderBlockingNotice(
      "Identity verification required",
      "Before we can pay out an approved claim, we need your ID number and banking details on file — add them from your Farm Profile.",
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: { xs: 4, md: 6 },
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        component="form"
        onSubmit={handleSubmit}
        autoComplete="off"
        sx={{
          width: "100%",
          maxWidth: 560,
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          border: "1px solid oklch(0.9 0.02 154.55)",
          "& .MuiTextField-root": { width: "100%" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "oklch(0.2 0.03 154.55)",
            }}
          >
            File a Claim
          </Typography>

          <IconButton
            onClick={handleClose}
            aria-label="Close"
            sx={{ color: "oklch(0.2 0.03 154.55)" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            mb: 2.5,
            p: 1.25,
            borderRadius: 2,
            bgcolor: "oklch(0.97 0.02 154.55)",
            color: "oklch(0.4 0.05 154.55)",
          }}
        >
          Only animals with an approved inspection are eligible for claims —
          grayed-out animals below aren't inspected, or are still
          pending/denied.
        </Typography>

        <Stack spacing={2.5}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
            <Box sx={{ flex: 1 }}>
              <FormControl variant="outlined" fullWidth sx={fieldSx}>
                <InputLabel id="animal-label">Animal</InputLabel>
                <Select
                  labelId="animal-label"
                  id="animal-select"
                  label="Animal"
                  value={values.livestockId}
                  name="livestockId"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!!animalsError}
                >
                  <MenuItem value="" disabled>
                    <em>--Select Animal--</em>
                  </MenuItem>
                  {animalsWithEligibility.map((animal) => (
                    <MenuItem
                      key={animal.id}
                      value={animal.id}
                      disabled={!animal.eligible}
                    >
                      {animal.species} #{animal.tag_number}
                      {!animal.eligible ? ` — ${animal.reason}` : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {animalsError ? (
                <Typography color="error" variant="caption" display="block">
                  {animalsError}
                </Typography>
              ) : touched.livestockId && errors.livestockId ? (
                <Typography color="error" variant="caption" display="block">
                  {errors.livestockId}
                </Typography>
              ) : null}
            </Box>

            <Box sx={{ flex: 1 }}>
              <FormControl variant="outlined" fullWidth sx={fieldSx}>
                <InputLabel id="claim-type-label">Claim Type</InputLabel>
                <Select
                  labelId="claim-type-label"
                  id="claim-type-select"
                  label="Claim Type"
                  value={values.claimType}
                  name="claimType"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="" disabled>
                    <em>--Select Claim Type--</em>
                  </MenuItem>
                  {claimTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {touched.claimType && errors.claimType ? (
                <Typography color="error" variant="caption" display="block">
                  {errors.claimType}
                </Typography>
              ) : null}
            </Box>
          </Stack>

          <Box>
            <TextField
              fullWidth
              label="Cause"
              name="cause"
              variant="outlined"
              placeholder="e.g. Suspected scours, snake bite, broken leg"
              onChange={handleChange}
              value={values.cause}
              onBlur={handleBlur}
              type="text"
              sx={fieldSx}
            />
            {touched.cause && errors.cause ? (
              <Typography color="error" variant="caption" display="block">
                {errors.cause}
              </Typography>
            ) : null}
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
            <Box sx={{ flex: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Incident"
                  value={values.dateOfIncident}
                  onChange={(newValue) =>
                    setFieldValue("dateOfIncident", newValue)
                  }
                  onBlur={handleBlur}
                  disableFuture
                  slotProps={{
                    textField: {
                      name: "dateOfIncident",
                      fullWidth: true,
                      variant: "outlined",
                      sx: fieldSx,
                    },
                  }}
                />
              </LocalizationProvider>
              {touched.dateOfIncident && errors.dateOfIncident ? (
                <Typography color="error" variant="caption" display="block">
                  {errors.dateOfIncident}
                </Typography>
              ) : null}
            </Box>

            <Box sx={{ flex: 1 }}>
              <TextField
                label="Claim Amount (R)"
                name="claimAmount"
                variant="outlined"
                onChange={handleChange}
                value={values.claimAmount}
                onBlur={handleBlur}
                type="number"
                sx={fieldSx}
              />
              {selectedAnimal?.approvedValue != null && (
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 0.5, color: "oklch(0.5 0.02 154.55)" }}
                >
                  Maximum claimable for this animal: R{" "}
                  {Number(selectedAnimal.approvedValue).toLocaleString()}
                </Typography>
              )}
              {touched.claimAmount && errors.claimAmount ? (
                <Typography color="error" variant="caption" display="block">
                  {errors.claimAmount}
                </Typography>
              ) : null}
            </Box>
          </Stack>

          <Box>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mb: 1,
                color: "oklch(0.5 0.02 154.55)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Evidence
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Button
                  component="label"
                  role={undefined}
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  disabled={uploading}
                  sx={uploadButtonSx}
                >
                  Upload Incident Photo
                  <VisuallyHiddenInput
                    type="file"
                    name="incidentImage"
                    onChange={handleFileChange("incidentImage", "claims")}
                    onBlur={handleBlur}
                  />
                </Button>
                {values.incidentImage && (
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{
                      mt: 1,
                      color: "oklch(0.4 0.13 154.55)",
                      fontWeight: 500,
                    }}
                  >
                    ✓ Uploaded
                  </Typography>
                )}
                {touched.incidentImage && errors.incidentImage ? (
                  <Typography color="error" variant="caption" display="block">
                    {errors.incidentImage}
                  </Typography>
                ) : null}
              </Box>

              {values.claimType === "Treatment Claim" && (
                <Box>
                  <Button
                    component="label"
                    role={undefined}
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    disabled={uploading}
                    sx={uploadButtonSx}
                  >
                    Upload Veterinary Invoice
                    <VisuallyHiddenInput
                      type="file"
                      name="veterinaryInvoice"
                      onChange={handleFileChange("veterinaryInvoice", "claims")}
                      onBlur={handleBlur}
                    />
                  </Button>
                  {values.veterinaryInvoice && (
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{
                        mt: 1,
                        color: "oklch(0.4 0.13 154.55)",
                        fontWeight: 500,
                      }}
                    >
                      ✓ Uploaded
                    </Typography>
                  )}
                  {touched.veterinaryInvoice && errors.veterinaryInvoice ? (
                    <Typography color="error" variant="caption" display="block">
                      {errors.veterinaryInvoice}
                    </Typography>
                  ) : null}
                </Box>
              )}

              {values.claimType === "Mortality Claim" && (
                <Box>
                  <Button
                    component="label"
                    role={undefined}
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    disabled={uploading}
                    sx={uploadButtonSx}
                  >
                    Upload Veterinary Death Report
                    <VisuallyHiddenInput
                      type="file"
                      name="veterinaryDeathReport"
                      onChange={handleFileChange(
                        "veterinaryDeathReport",
                        "claims",
                      )}
                      onBlur={handleBlur}
                    />
                  </Button>
                  {values.veterinaryDeathReport && (
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{
                        mt: 1,
                        color: "oklch(0.4 0.13 154.55)",
                        fontWeight: 500,
                      }}
                    >
                      ✓ Uploaded
                    </Typography>
                  )}
                  {touched.veterinaryDeathReport &&
                  errors.veterinaryDeathReport ? (
                    <Typography color="error" variant="caption" display="block">
                      {errors.veterinaryDeathReport}
                    </Typography>
                  ) : null}
                </Box>
              )}
            </Stack>
          </Box>

          {submitError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {submitError}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            disabled={submitting || uploading}
            sx={{
              alignSelf: "center",
              width: { xs: "100%", sm: "60%" },
              mt: 1,
              bgcolor: "oklch(0.32 0.1 154.55)",
              color: "white",
              borderRadius: "2rem",
              py: "0.75rem",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "oklch(0.27 0.1 154.55)",
                boxShadow: "none",
              },
              "&.Mui-disabled": {
                bgcolor: "oklch(0.9 0.02 154.55)",
                color: "oklch(0.6 0.02 154.55)",
              },
            }}
          >
            {submitting ? "Submitting..." : "Submit Claim"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
