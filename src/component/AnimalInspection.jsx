import { useEffect, useState } from "react";
import { TextField, Typography, Stack, Paper, IconButton } from "@mui/material";
import { useFormik } from "formik";
import { object, string, date } from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { apiFetch } from "../utils/api";
import { uploadFile } from "../utils/uploadFile";
import "../styles/onboarding.css";
const inspectionSchema = object({
  status: string().required("status is required"),
  inspectionDate: date().required("Select inspection date"),
  animalTagNameImage: string().required(
    "A valid animalTagNameImage is required",
  ),
  vetenaryHealthReport: string().required("vetenaryHealthReport is required"),
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

// Note: keys sent to the backend (inspectionDate, animalTagNameImage,
// vetenaryHealthReport) are intentionally camelCase — that's what
// animal_inspection_bp.add_animal_inspection actually reads via
// data.get(...). Only livestock_id is snake_case, matching the model.
export function AnimalInspection({
  setActiveStep,
  animalId,
  onSaved,
  isModal,
  handleClose,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [declaredValue, setDeclaredValue] = useState(null);

  useEffect(() => {
    if (!animalId) return;
    apiFetch(`onboarding/animal/${animalId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((animal) => setDeclaredValue(animal?.estimated_value ?? null))
      .catch(console.error);
  }, [animalId]);

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
      status: "pending",
      animalTagNameImage: "",
      vetenaryHealthReport: "",
      valuationEvidence: "",
      inspectionDate: null,
    },
    validationSchema: inspectionSchema,
    onSubmit: async (data) => {
      setSubmitting(true);
      setSubmitError(null);

      try {
        const res = await apiFetch("onboarding/inspection", {
          method: "POST",
          body: JSON.stringify({
            status: data.status,
            inspectionDate: data.inspectionDate,
            animalTagNameImage: data.animalTagNameImage,
            vetenaryHealthReport: data.vetenaryHealthReport,
            valuationEvidence: data.valuationEvidence || null,
            livestock_id: animalId,
          }),
        });

        if (!res.ok) throw new Error("Failed to save inspection");

        const savedInspection = await res.json();
        if (isModal) {
          onSaved?.(savedInspection);
          handleClose?.();
        } else {
          onSaved(savedInspection);
          setActiveStep((prev) => prev + 1);
        }
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

  // Was previously just storing file.name as a fake "URL" — never
  // actually uploaded anything, so tag_photo_url/vet_health_report_url
  // pointed nowhere. Matches the real upload pattern FileClaim.jsx and
  // RegisterAnimal.jsx already use.
  const handleFileChange = (fieldName) => async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(file, "inspections");
      setFieldValue(fieldName, url);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "Upload failed. Please try again.");
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
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "oklch(0.2 0.03 154.55)",
              mb: 1,
            }}
          >
            Animal Inspection
          </Typography>

          {isModal && (
            <IconButton
              onClick={handleClose}
              aria-label="Close"
              sx={{ color: "oklch(0.2 0.03 154.55)" }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        <Typography
          sx={{
            fontSize: "0.95rem",
            color: "oklch(0.5 0.02 154.55)",
            lineHeight: 1.5,
            mb: 3,
          }}
        >
          To qualify for insurance, every animal must complete a pre-insurance
          inspection.
        </Typography>

        {declaredValue != null && (
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              px: 1.5,
              py: 1,
              borderRadius: 2,
              bgcolor: "oklch(0.97 0.02 154.55)",
              color: "oklch(0.3 0.05 154.55)",
              fontWeight: 600,
            }}
          >
            Declared value: R {Number(declaredValue).toLocaleString()} — an
            inspector will confirm or adjust this once reviewed.
          </Typography>
        )}

        <Stack spacing={2.5}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
              <DatePicker
                label="Inspection Date"
                value={values.inspectionDate}
                onChange={(newValue) =>
                  setFieldValue("inspectionDate", newValue)
                }
                onBlur={handleBlur}
                slotProps={{
                  textField: {
                    name: "inspectionDate",
                    fullWidth: true,
                    variant: "outlined",
                    sx: fieldSx,
                  },
                }}
              />
              {touched.inspectionDate && errors.inspectionDate ? (
                <Typography color="error" variant="caption" display="block">
                  {errors.inspectionDate}
                </Typography>
              ) : null}
            </Box>
          </LocalizationProvider>

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
              Upload
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Button
                  component="label"
                  role={undefined}
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    bgcolor: "transparent",
                    color: "oklch(0.32 0.1 154.55)",
                    border: "1.5px solid oklch(0.8 0.03 154.55)",
                    borderRadius: "2rem",
                    px: "1.5rem",
                    py: "0.6rem",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "oklch(0.97 0.02 154.55)" },
                  }}
                >
                  Upload Tag Image
                  <VisuallyHiddenInput
                    type="file"
                    name="animalTagNameImage"
                    onChange={handleFileChange("animalTagNameImage")}
                    onBlur={handleBlur}
                  />
                </Button>
                {values.animalTagNameImage && (
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{
                      mt: 1,
                      color: "oklch(0.4 0.13 154.55)",
                      fontWeight: 500,
                    }}
                  >
                    ✓ {values.animalTagNameImage}
                  </Typography>
                )}
                {touched.animalTagNameImage && errors.animalTagNameImage ? (
                  <Typography color="error" variant="caption" display="block">
                    {errors.animalTagNameImage}
                  </Typography>
                ) : null}
              </Box>

              <Box>
                <Button
                  component="label"
                  role={undefined}
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    bgcolor: "transparent",
                    color: "oklch(0.32 0.1 154.55)",
                    border: "1.5px solid oklch(0.8 0.03 154.55)",
                    borderRadius: "2rem",
                    px: "1.5rem",
                    py: "0.6rem",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "oklch(0.97 0.02 154.55)" },
                  }}
                >
                  Upload Vetenary Health Report
                  <VisuallyHiddenInput
                    type="file"
                    name="vetenaryHealthReport"
                    onChange={handleFileChange("vetenaryHealthReport")}
                    onBlur={handleBlur}
                  />
                </Button>
                {values.vetenaryHealthReport && (
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{
                      mt: 1,
                      color: "oklch(0.4 0.13 154.55)",
                      fontWeight: 500,
                    }}
                  >
                    ✓ {values.vetenaryHealthReport}
                  </Typography>
                )}
                {touched.vetenaryHealthReport && errors.vetenaryHealthReport ? (
                  <Typography color="error" variant="caption" display="block">
                    {errors.vetenaryHealthReport}
                  </Typography>
                ) : null}
              </Box>

              <Box>
                <Button
                  component="label"
                  role={undefined}
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    bgcolor: "transparent",
                    color: "oklch(0.32 0.1 154.55)",
                    border: "1.5px solid oklch(0.8 0.03 154.55)",
                    borderRadius: "2rem",
                    px: "1.5rem",
                    py: "0.6rem",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "oklch(0.97 0.02 154.55)" },
                  }}
                >
                  Upload Value Evidence (Optional)
                  <VisuallyHiddenInput
                    type="file"
                    name="valuationEvidence"
                    onChange={handleFileChange("valuationEvidence")}
                    onBlur={handleBlur}
                  />
                </Button>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 0.5, color: "oklch(0.55 0.01 90)" }}
                >
                  Auction receipt, purchase invoice, or valuation
                  certificate — speeds up approval, not required.
                </Typography>
                {values.valuationEvidence && (
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{
                      mt: 1,
                      color: "oklch(0.4 0.13 154.55)",
                      fontWeight: 500,
                    }}
                  >
                    ✓ {values.valuationEvidence}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>

          <Box>
            <TextField
              label="Status"
              name="status"
              variant="outlined"
              onChange={handleChange}
              value={values.status}
              onBlur={handleBlur}
              disabled
              type="text"
              sx={{
                "& .MuiOutlinedInput-root.Mui-disabled": {
                  bgcolor: "oklch(0.97 0.02 154.55)",
                },
                "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "oklch(0.85 0.03 154.55)",
                  },
                "& .MuiInputBase-input.Mui-disabled": {
                  color: "oklch(0.32 0.1 154.55)",
                  WebkitTextFillColor: "oklch(0.32 0.1 154.55)",
                },
              }}
            />
            {touched.status && errors.status ? (
              <Typography color="error" variant="caption" display="block">
                {errors.status}
              </Typography>
            ) : null}
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
            {submitting ? "Saving..." : "Continue"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
