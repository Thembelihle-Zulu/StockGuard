import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { apiFetch } from "../utils/api";
import { AnimalInspection } from "./AnimalInspection";

export function SubmitInspectionFlow({ handleClose, onSuccess }) {
  const [animals, setAnimals] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState("");

  useEffect(() => {
    Promise.all([
      apiFetch("onboarding/animal").then((res) => (res.ok ? res.json() : [])),
      apiFetch("onboarding/inspection").then((res) =>
        res.ok ? res.json() : [],
      ),
    ])
      .then(([animalsData, inspectionsData]) => {
        setAnimals(Array.isArray(animalsData) ? animalsData : []);
        setInspections(Array.isArray(inspectionsData) ? inspectionsData : []);
      })
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, []);

  if (selectedAnimalId) {
    return (
      <AnimalInspection
        animalId={selectedAnimalId}
        isModal
        handleClose={handleClose}
        onSaved={() => onSuccess?.()}
      />
    );
  }

  const blockedIds = new Set(
    inspections
      .filter((i) => i.status !== "denied")
      .map((i) => i.livestock_id),
  );
  const uninspectedAnimals = animals.filter((a) => !blockedIds.has(a.id));

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
        sx={{
          width: "100%",
          maxWidth: 560,
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          border: "1px solid oklch(0.9 0.02 154.55)",
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
            Submit Vet Report
          </Typography>
          <IconButton
            onClick={handleClose}
            aria-label="Close"
            sx={{ color: "oklch(0.2 0.03 154.55)" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {!loaded ? null : animals.length === 0 ? (
          <Typography sx={{ color: "oklch(0.5 0.02 154.55)" }}>
            You haven't registered any animals yet — register one first.
          </Typography>
        ) : uninspectedAnimals.length === 0 ? (
          <Typography sx={{ color: "oklch(0.5 0.02 154.55)" }}>
            Every registered animal already has a submitted report.
          </Typography>
        ) : (
          <>
            <Typography sx={{ color: "oklch(0.5 0.02 154.55)", mb: 2.5 }}>
              Choose which animal this report is for — you'll move to the
              report form as soon as you pick one.
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="report-animal-label">Animal</InputLabel>
              <Select
                labelId="report-animal-label"
                label="Animal"
                value={selectedAnimalId}
                onChange={(e) => setSelectedAnimalId(e.target.value)}
              >
                {uninspectedAnimals.map((animal) => (
                  <MenuItem key={animal.id} value={animal.id}>
                    {animal.species} #{animal.tag_number}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
      </Paper>
    </Box>
  );
}
