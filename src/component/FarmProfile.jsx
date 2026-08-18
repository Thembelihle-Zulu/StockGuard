import { useState } from "react";
import { TextField, Typography, Stack, Paper } from "@mui/material";
import { useFormik } from "formik";
import { object, string, number } from "yup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";

const API_BASE = "http://127.0.0.1:5000/api/onboarding";

const farmProfileSchema = object({
  farmName: string().required("Farm name is required"),
  streetAddress: string()
    .required("A valid street address is required")
    .min(3, "Enter a vaild address"),
  province: string().required("Province selection is required"),
  city: string().required("City field is required"),
  postalCode: number().required("Postal code is required"),
  farmType: string().required("Farm type selection is required"),
});

export function FarmProfile({
  provinces,
  farmTypes,
  setActiveStep,
  setFarmProfile,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { values, handleChange, handleBlur, handleSubmit, touched, errors } =
    useFormik({
      initialValues: {
        farmName: "",
        streetAddress: "",
        province: "",
        postalCode: "",
        farmType: "",
        city: "",
      },
      validationSchema: farmProfileSchema,
      onSubmit: async (data) => {
        setSubmitting(true);
        setSubmitError(null);

        try {
          const res = await fetch(`${API_BASE}/farm_profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              farm_name: data.farmName,
              street_address: data.streetAddress,
              province: data.province,
              postal_code: data.postalCode,
              farm_type: data.farmType,
              city: data.city,
            }),
          });

          if (!res.ok) throw new Error("Failed to save farm profile");

          const savedProfile = await res.json();
          console.log("Farm profile saved:", savedProfile);

          setFarmProfile(savedProfile); 
          setActiveStep((prev) => prev + 1);
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
          Farm Profile
        </Typography>

        <Stack spacing={2.5}>
          <Box>
            <TextField
              label="Farm Name"
              name="farmName"
              variant="outlined"
              onChange={handleChange}
              value={values.farmName}
              onBlur={handleBlur}
              type="text"
              sx={fieldSx}
            />
            {touched.farmName && errors.farmName ? (
              <Typography color="error" variant="caption" display="block">
                {errors.farmName}
              </Typography>
            ) : null}
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
            <Box sx={{ flex: 1 }}>
              <FormControl variant="outlined" fullWidth sx={fieldSx}>
                <InputLabel id="farm-type-label">Farm Type</InputLabel>
                <Select
                  labelId="farm-type-label"
                  id="farm-type-select"
                  label="Farm Type"
                  value={values.farmType}
                  name="farmType"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="" disabled>
                    <em>--Select Farmer Type--</em>
                  </MenuItem>
                  {farmTypes.map((type, index) => (
                    <MenuItem key={index} value={type}>
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
                  id="province-select"
                  label="Province"
                  value={values.province}
                  name="province"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="" disabled>
                    <em>--Select Province--</em>
                  </MenuItem>
                  {provinces.map((province, index) => (
                    <MenuItem key={index} value={province}>
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
            {submitting ? "Saving..." : "Create Profile"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
