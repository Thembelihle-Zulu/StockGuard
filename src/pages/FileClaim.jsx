import { useEffect, useState } from "react";
import { TextField, Typography, Stack, Paper } from "@mui/material";
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

const API_BASE = "http://127.0.0.1:5000/api";

const claimTypes = ["Treatment Claim", "Mortality Claim"];

// Matches the Claim model's columns exactly (see models/claim.py):
// livestock_id, claim_type, cause, date_of_incident, claim_amount,
// incident_image, veterinary_invoice, veterinary_death_report.
// status and created_date are intentionally NOT collected here — the
// backend now sets both itself (see claims_bp.py) rather than trusting
// the client, so there's nothing for this form to send for either.
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
  // veterinaryInvoice / veterinaryDeathReport are validated conditionally
  // below, based on claimType — a Treatment Claim needs an invoice, a
  // Mortality Claim needs a death report, not both.
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

// farmProfileId scopes the animal picker to this farm's own livestock
// (via GET /api/onboarding/animal?farm_profile_id=...) rather than every
// animal in the system. Pass farmProfile?.id from wherever this route
// renders — it isn't wired up yet, since FileClaim previously took no
// props at all.
export function FileClaim() {
  const farmProfileId = "74aa71c8-5def-4ce7-960b-741d7c26a03c";
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [animalsError, setAnimalsError] = useState(null);

  useEffect(() => {
    if (!farmProfileId) {
      setAnimalsError(
        "No farm profile is set — the animal list can't be loaded.",
      );
      return;
    }

    fetch(
      `${API_BASE}/onboarding/animal?farm_profile_id=${encodeURIComponent(farmProfileId)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    )
      .then((res) => (res?.ok ? res.json() : Promise.reject("error")))
      .then((data) => setAnimals(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.log(err);
        setAnimalsError("Couldn't load your animals. Please try again.");
      });
  }, [farmProfileId]);

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
        const res = await fetch(`${API_BASE}/claims`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

        if (!res.ok) throw new Error("Failed to submit claim");

        const savedClaim = await res.json();
        console.log("Claim submitted:", savedClaim);
        // TODO: once a claim-status/track page exists, this is the spot
        // to navigate there or surface the saved claim to the user.
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

  const handleFileChange = (fieldName) => (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Storing the file name here since the field is validated as a
      // string. If you need the actual File object for upload, keep it
      // in separate state rather than in formik's values.
      setFieldValue(fieldName, file.name);
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
        <Typography
          component="h2"
          sx={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "oklch(0.2 0.03 154.55)",
            mb: 3,
          }}
        >
          File a Claim
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
                  {animals.map((animal) => (
                    <MenuItem key={animal.id} value={animal.id}>
                      {animal.species} #{animal.tag_number}
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
                  sx={uploadButtonSx}
                >
                  Upload Incident Photo
                  <VisuallyHiddenInput
                    type="file"
                    name="incidentImage"
                    onChange={handleFileChange("incidentImage")}
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
                    ✓ {values.incidentImage}
                  </Typography>
                )}
                {touched.incidentImage && errors.incidentImage ? (
                  <Typography color="error" variant="caption" display="block">
                    {errors.incidentImage}
                  </Typography>
                ) : null}
              </Box>

              {/* Only one of these two shows, based on claim type — a
                  Treatment Claim needs a vet invoice (the animal survived
                  and was treated); a Mortality Claim needs a vet death
                  report instead. Matches Section 5.1's survived-vs-died
                  evidence split. */}
              {values.claimType === "Treatment Claim" && (
                <Box>
                  <Button
                    component="label"
                    role={undefined}
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    sx={uploadButtonSx}
                  >
                    Upload Veterinary Invoice
                    <VisuallyHiddenInput
                      type="file"
                      name="veterinaryInvoice"
                      onChange={handleFileChange("veterinaryInvoice")}
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
                      ✓ {values.veterinaryInvoice}
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
                    sx={uploadButtonSx}
                  >
                    Upload Veterinary Death Report
                    <VisuallyHiddenInput
                      type="file"
                      name="veterinaryDeathReport"
                      onChange={handleFileChange("veterinaryDeathReport")}
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
                      ✓ {values.veterinaryDeathReport}
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
            disabled={submitting}
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
