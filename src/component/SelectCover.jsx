import { useEffect, useMemo, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import SendIcon from "@mui/icons-material/Send";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { number, object, string } from "yup";
import { getPremium } from "../utils/Premuimcalculator";
import { apiFetch } from "../utils/api";
import "../styles/onboarding.css";
const coverSchema = object({
  declaredAnimalCount: number()
    .typeError("Enter a number")
    .integer("Enter a whole number")
    .min(1, "Must be at least 1 animal")
    .required("Number of animals is required"),
  coverageTier: string().required("Select a coverage tier"),
});

// farmProfileId is passed down from Onboarding.js (set after FarmProfile's
// save). Used only to look up farm_type for the premium calculation via
// GET /farm_profile/<id>, which enforces its own ownership check server-side.
export function SelectCover({ setActiveStep, setCover, farmProfileId }) {
  const [farmType, setFarmType] = useState(null);

  useEffect(() => {
    if (!farmProfileId) return;

    apiFetch(`onboarding/farm_profile/${farmProfileId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load farm profile");
        return res.json();
      })
      .then((profile) => setFarmType(profile.farm_type))
      .catch((err) => console.error(err));
  }, [farmProfileId]);

  const { values, handleChange, handleBlur, handleSubmit, touched, errors } =
    useFormik({
      initialValues: {
        declaredAnimalCount: 1,
        coverageTier: "basic",
      },
      validationSchema: coverSchema,
      onSubmit: (data) => {
        const { monthlyPremium, tierLabel } = getPremium(
          farmType,
          data.declaredAnimalCount,
          data.coverageTier,
        );

        const coverSelection = {
          status: "pending",
          declaredAnimalCount: Number(data.declaredAnimalCount),
          coverageTier: data.coverageTier,
          monthlyPremium,
          tierLabel,
        };

        // No fetch here — there's no dedicated table for a "cover
        // selection". This just carries the inputs forward; ConfirmPolicy
        // uses them to create the actual policy record.
        setCover(coverSelection);
        setActiveStep((prev) => prev + 1);
      },
    });

  const preview = useMemo(
    () => getPremium(farmType, values.declaredAnimalCount, values.coverageTier),
    [farmType, values.declaredAnimalCount, values.coverageTier],
  );

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
          Select Health Cover
        </Typography>

        <Stack spacing={2.5}>
          <Box>
            <TextField
              label="Number of animals to insure"
              name="declaredAnimalCount"
              variant="outlined"
              onChange={handleChange}
              value={values.declaredAnimalCount}
              onBlur={handleBlur}
              type="number"
              sx={fieldSx}
            />
            {touched.declaredAnimalCount && errors.declaredAnimalCount ? (
              <Typography color="error" variant="caption" display="block">
                {errors.declaredAnimalCount}
              </Typography>
            ) : null}
          </Box>

          <Box>
            <Typography
              sx={{ mb: 1, fontWeight: 600, color: "oklch(0.2 0.03 154.55)" }}
            >
              Coverage Tier
            </Typography>
            <RadioGroup
              row
              name="coverageTier"
              value={values.coverageTier}
              onChange={handleChange}
              sx={{ gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}
            >
              {[
                { value: "basic", label: "Basic" },
                { value: "full", label: "Full" },
              ].map((option) => (
                <Paper
                  key={option.value}
                  elevation={0}
                  onClick={() =>
                    handleChange({
                      target: { name: "coverageTier", value: option.value },
                    })
                  }
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    px: 1.5,
                    py: 0.5,
                    cursor: "pointer",
                    borderRadius: 3,
                    border: "1.5px solid",
                    borderColor:
                      values.coverageTier === option.value
                        ? "oklch(0.32 0.1 154.55)"
                        : "oklch(0.85 0.02 154.55)",
                    bgcolor:
                      values.coverageTier === option.value
                        ? "oklch(0.97 0.02 154.55)"
                        : "transparent",
                  }}
                >
                  <FormControlLabel
                    value={option.value}
                    control={
                      <Radio
                        sx={{
                          color: "oklch(0.8 0.03 154.55)",
                          "&.Mui-checked": { color: "oklch(0.32 0.1 154.55)" },
                        }}
                      />
                    }
                    label={option.label}
                    sx={{ m: 0, width: "100%" }}
                  />
                </Paper>
              ))}
            </RadioGroup>
            {touched.coverageTier && errors.coverageTier ? (
              <Typography color="error" variant="caption" display="block">
                {errors.coverageTier}
              </Typography>
            ) : null}
          </Box>

          <Box>
            <Typography
              sx={{ mb: 1, fontWeight: 600, color: "oklch(0.2 0.03 154.55)" }}
            >
              Includes
            </Typography>
            <List sx={{ width: "100%", p: 0 }}>
              <ListItem disableGutters>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: "oklch(0.95 0.03 154)",
                      color: "oklch(0.32 0.1 154.55)",
                    }}
                  >
                    <DoneIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Illness treatment" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: "oklch(0.95 0.03 154)",
                      color: "oklch(0.32 0.1 154.55)",
                    }}
                  >
                    <DoneIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Injury Treatment" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: "oklch(0.95 0.03 154)",
                      color: "oklch(0.32 0.1 154.55)",
                    }}
                  >
                    <DoneIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Mortality cover" />
                {values.coverageTier === "full" && (
                  <Typography
                    variant="caption"
                    sx={{ ml: 1, color: "oklch(0.4 0.13 154.55)" }}
                  >
                    (extended)
                  </Typography>
                )}
              </ListItem>
            </List>
          </Box>

          <Box
            sx={{
              borderTop: "0.5px solid oklch(0.85 0.02 154.55)",
              borderBottom: "0.5px solid oklch(0.85 0.02 154.55)",
              py: 2,
            }}
          >
            <Typography
              sx={{ color: "oklch(0.5 0.02 154.55)", fontSize: "0.9rem" }}
            >
              {farmType || "Farm"} · {preview.tierLabel}
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: "2rem",
                fontWeight: 700,
                color: "oklch(0.2 0.03 154.55)",
                mt: 0.5,
              }}
            >
              R{preview.monthlyPremium}
              <Typography
                component="span"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 400,
                  color: "oklch(0.5 0.02 154.55)",
                }}
              >
                /month
              </Typography>
            </Typography>
          </Box>

          <Box sx={{ py: 1 }}>
            <Typography
              sx={{ color: "oklch(0.5 0.02 154.55)", fontSize: "0.9rem" }}
            >
              Waiting period
            </Typography>
            <Typography
              component="h2"
              sx={{ fontSize: "1.1rem", fontWeight: 700, mt: 0.5 }}
            >
              14 Days
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
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
            }}
          >
            Continue
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
