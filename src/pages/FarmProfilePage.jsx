import { useEffect, useState } from "react";
import {
  TextField,
  Typography,
  Stack,
  Paper,
  Box,
  Button,
  Avatar,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { useFormik } from "formik";
import { object, string, number } from "yup";
import SendIcon from "@mui/icons-material/Send";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { apiFetch, API_ORIGIN } from "../utils/api";
import { uploadFile } from "../utils/uploadFile";
import "../styles/claims-list.css";
import "../styles/onboarding.css";

const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];
const FARM_TYPES = ["Small-scale", "Commercial"];

const farmProfileSchema = object({
  streetAddress: string()
    .required("A valid street address is required")
    .min(3, "Enter a valid address"),
  province: string().required("Province selection is required"),
  city: string().required("City field is required"),
  postalCode: number().required("Postal code is required"),
  farmType: string().required("Farm type selection is required"),
  idNumber: string().test(
    "id-number",
    "Enter a valid 13-digit SA ID number",
    (val) => !val || /^\d{13}$/.test(val),
  ),
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

export function FarmProfilePage() {
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setFieldValue,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      farmName: "",
      streetAddress: "",
      province: "",
      postalCode: "",
      farmType: "",
      city: "",
      imageUrl: "",
      idNumber: "",
      bankName: "",
      bankAccountNumber: "",
    },
    validationSchema: farmProfileSchema,
    onSubmit: async (data) => {
      setSubmitting(true);
      setSubmitError(null);
      setSaved(false);

      try {
        const res = await apiFetch("onboarding/farm_profile/me", {
          method: "PUT",
          body: JSON.stringify({
            street_address: data.streetAddress,
            province: data.province,
            postal_code: data.postalCode,
            farm_type: data.farmType,
            city: data.city,
            image_url: data.imageUrl || null,
            id_number: data.idNumber || null,
            bank_name: data.bankName || null,
            bank_account_number: data.bankAccountNumber || null,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || "Failed to save farm profile");
        }

        setSaved(true);
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

  useEffect(() => {
    apiFetch("onboarding/farm_profile/me")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((profile) => {
        setValues({
          farmName: profile.farm_name || "",
          streetAddress: profile.street_address || "",
          province: profile.province || "",
          postalCode: profile.postal_code || "",
          farmType: profile.farm_type || "",
          city: profile.city || "",
          imageUrl: profile.image_url || "",
          idNumber: profile.id_number || "",
          bankName: profile.bank_name || "",
          bankAccountNumber: profile.bank_account_number || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, [setValues]);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadFile(file, "farm_profiles");
      setFieldValue("imageUrl", url);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
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

  if (!loaded) return null;

  return (
    <section className="claims-page">
      <div className="claims-page-header">
        <h2 className="claims-page-title">Farm Profile</h2>
      </div>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
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
          <Stack spacing={2.5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
              <Avatar
                src={values.imageUrl ? `${API_ORIGIN}${values.imageUrl}` : undefined}
                sx={{ width: 72, height: 72, bgcolor: "oklch(0.95 0.03 154)" }}
              >
                {values.farmName?.charAt(0)?.toUpperCase() || "F"}
              </Avatar>
              <Box>
                <Button
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  disabled={uploadingImage}
                  sx={{
                    bgcolor: "transparent",
                    color: "oklch(0.32 0.1 154.55)",
                    border: "1.5px solid oklch(0.8 0.03 154.55)",
                    borderRadius: "2rem",
                    px: "1.25rem",
                    py: "0.4rem",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "oklch(0.97 0.02 154.55)" },
                  }}
                >
                  {uploadingImage ? "Uploading..." : "Change Photo"}
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
            </Box>

            <Box>
              <TextField
                label="Farm Name"
                variant="outlined"
                value={values.farmName}
                disabled
                sx={{
                  "& .MuiOutlinedInput-root.Mui-disabled": {
                    bgcolor: "oklch(0.97 0.02 154.55)",
                  },
                }}
              />
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
              <Box sx={{ flex: 1 }}>
                <FormControl variant="outlined" fullWidth sx={fieldSx}>
                  <InputLabel id="farm-type-label">Farm Type</InputLabel>
                  <Select
                    labelId="farm-type-label"
                    label="Farm Type"
                    value={values.farmType}
                    name="farmType"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {FARM_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {touched.farmType && errors.farmType ? (
                  <Typography color="error" variant="caption" display="block">
                    {errors.farmType}
                  </Typography>
                ) : null}
              </Box>

              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Postal Code"
                  name="postalCode"
                  variant="outlined"
                  onChange={handleChange}
                  value={values.postalCode}
                  onBlur={handleBlur}
                  type="number"
                  sx={fieldSx}
                />
                {touched.postalCode && errors.postalCode ? (
                  <Typography color="error" variant="caption" display="block">
                    {errors.postalCode}
                  </Typography>
                ) : null}
              </Box>
            </Stack>

            <Box>
              <TextField
                fullWidth
                label="Street Address"
                name="streetAddress"
                variant="outlined"
                onChange={handleChange}
                value={values.streetAddress}
                onBlur={handleBlur}
                type="text"
                sx={fieldSx}
              />
              {touched.streetAddress && errors.streetAddress ? (
                <Typography color="error" variant="caption" display="block">
                  {errors.streetAddress}
                </Typography>
              ) : null}
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="City"
                  name="city"
                  variant="outlined"
                  onChange={handleChange}
                  value={values.city}
                  onBlur={handleBlur}
                  type="text"
                  sx={fieldSx}
                />
                {touched.city && errors.city ? (
                  <Typography color="error" variant="caption" display="block">
                    {errors.city}
                  </Typography>
                ) : null}
              </Box>

              <Box sx={{ flex: 1 }}>
                <FormControl variant="outlined" fullWidth sx={fieldSx}>
                  <InputLabel id="province-label">Province</InputLabel>
                  <Select
                    labelId="province-label"
                    label="Province"
                    value={values.province}
                    name="province"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {PROVINCES.map((province) => (
                      <MenuItem key={province} value={province}>
                        {province}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {touched.province && errors.province ? (
                  <Typography color="error" variant="caption" display="block">
                    {errors.province}
                  </Typography>
                ) : null}
              </Box>
            </Stack>

            <Box sx={{ pt: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  fontWeight: 700,
                  color: "oklch(0.5 0.02 154.55)",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  mb: 0.5,
                }}
              >
                Identity &amp; Payout Details
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: "block", color: "oklch(0.55 0.01 90)", mb: 1.5 }}
              >
                Used to verify your identity and pay out approved claims —
                checked through an external system, not this app.
              </Typography>
            </Box>

            <Box>
              <TextField
                fullWidth
                label="ID Number"
                name="idNumber"
                variant="outlined"
                placeholder="13-digit SA ID number"
                onChange={handleChange}
                value={values.idNumber}
                onBlur={handleBlur}
                type="text"
                sx={fieldSx}
              />
              {touched.idNumber && errors.idNumber ? (
                <Typography color="error" variant="caption" display="block">
                  {errors.idNumber}
                </Typography>
              ) : null}
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Bank Name"
                  name="bankName"
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                  value={values.bankName}
                  onBlur={handleBlur}
                  type="text"
                  sx={fieldSx}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Account Number"
                  name="bankAccountNumber"
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                  value={values.bankAccountNumber}
                  onBlur={handleBlur}
                  type="text"
                  sx={fieldSx}
                />
              </Box>
            </Stack>

            {saved && (
              <Typography sx={{ color: "oklch(0.4 0.13 154.55)", fontWeight: 600 }}>
                ✓ Farm profile updated.
              </Typography>
            )}
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
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </section>
  );
}
