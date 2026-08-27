import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";
import { IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import { useState } from "react";
import { number, object, string } from "yup";
import { apiFetch } from "../utils/api";
import { uploadFile } from "../utils/uploadFile";
import "../styles/onboarding.css";
const animalSchema = object({
  tagNumber: string().required("Tag number is required"),
  species: string().required("Species is required"),
  breed: string().required("Breed is required"),
  image: string().required("Please upload an image"),
  age: number().required("Age is required"),
  estimatedValue: number().required("Estimated value is required"),
  status: string().required("Status is required"),
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

// Note: farm_profile_id is intentionally NOT sent here — the backend
// derives it from the JWT-authenticated user (see animal_bp.add_animal),
// and ignores/ would reject anything the client tries to pass instead.
export function RegisterAnimal({
  animalType,
  setActiveStep,
  isModal,
  handleClose,
  onSuccess,
  onSaved,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
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
      tagNumber: "",
      species: "",
      breed: "",
      estimatedValue: "",
      age: "",
      image: "",
      status: "Alive",
    },
    validationSchema: animalSchema,
    onSubmit: async (data) => {
      setSubmitting(true);
      setSubmitError(null);

      try {
        const res = await apiFetch("onboarding/animal", {
          method: "POST",
          body: JSON.stringify({
            tag_number: data.tagNumber,
            species: data.species,
            breed: data.breed,
            estimated_value: data.estimatedValue,
            age: data.age,
            image: data.image,
            status: data.status,
          }),
        });

        if (!res.ok) throw new Error("Failed to register animal");

        const savedAnimal = await res.json();

        // success actions live here, inside the try block, so a failed
        // save never closes the modal or advances the step silently
        if (isModal) {
          // If the caller passed onSaved, it's driving what happens next
          // (e.g. RegisterAnimalFlow advancing to the inspection step)
          // instead of the default "just close" behavior.
          if (onSaved) {
            onSaved(savedAnimal);
          } else {
            onSuccess && onSuccess();
            handleClose();
          }
        } else {
          onSaved(savedAnimal);
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

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;
    try {
      const url = await uploadFile(file, "animals");

      setFieldValue("image", url);
    } catch (error) {
      console.error(error);
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
            Register Animal
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

        <Stack spacing={2.5}>
          <Box>
            <TextField
              label="Animal Tag Number"
              name="tagNumber"
              variant="outlined"
              onChange={handleChange}
              value={values.tagNumber}
              onBlur={handleBlur}
              type="text"
              sx={fieldSx}
            />
            {touched.tagNumber && errors.tagNumber ? (
              <Typography color="error" variant="caption" display="block">
                {errors.tagNumber}
              </Typography>
            ) : null}
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
            <Box sx={{ flex: 1 }}>
              <FormControl variant="outlined" fullWidth sx={fieldSx}>
                <InputLabel id="species-label">Species</InputLabel>
                <Select
                  labelId="species-label"
                  id="species-select"
                  label="Species"
                  value={values.species}
                  name="species"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="" disabled>
                    <em>--Select Animal Type--</em>
                  </MenuItem>
                  {animalType.map((type, index) => (
                    <MenuItem key={index} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {touched.species && errors.species ? (
                <Typography color="error" variant="caption" display="block">
                  {errors.species}
                </Typography>
              ) : null}
            </Box>

            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Breed"
                name="breed"
                variant="outlined"
                onChange={handleChange}
                value={values.breed}
                onBlur={handleBlur}
                type="text"
                sx={fieldSx}
              />
              {touched.breed && errors.breed ? (
                <Typography color="error" variant="caption" display="block">
                  {errors.breed}
                </Typography>
              ) : null}
            </Box>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
            <Box sx={{ flex: 1 }}>
              <TextField
                label="Estimated Value"
                name="estimatedValue"
                variant="outlined"
                onChange={handleChange}
                value={values.estimatedValue}
                onBlur={handleBlur}
                type="number"
                sx={fieldSx}
              />
              {touched.estimatedValue && errors.estimatedValue ? (
                <Typography color="error" variant="caption" display="block">
                  {errors.estimatedValue}
                </Typography>
              ) : null}
            </Box>

            <Box sx={{ flex: 1 }}>
              <TextField
                label="Age"
                name="age"
                variant="outlined"
                onChange={handleChange}
                value={values.age}
                onBlur={handleBlur}
                type="number"
                sx={fieldSx}
              />
              {touched.age && errors.age ? (
                <Typography color="error" variant="caption" display="block">
                  {errors.age}
                </Typography>
              ) : null}
            </Box>
          </Stack>

          <TextField
            label="Status"
            name="status"
            variant="outlined"
            value={values.status}
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
              Upload image
              <VisuallyHiddenInput
                type="file"
                name="image"
                onChange={handleImageChange}
                onBlur={handleBlur}
              />
            </Button>
            {values.image && (
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 1, color: "oklch(0.4 0.13 154.55)", fontWeight: 500 }}
              >
                ✓ {values.image}
              </Typography>
            )}
            {touched.image && errors.image ? (
              <Typography color="error" variant="caption" display="block">
                {errors.image}
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
            {submitting ? "Registering..." : "Register Animal"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
