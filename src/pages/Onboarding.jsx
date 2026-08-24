import { useState } from "react";
import Box from "@mui/material/Box";
import { FarmProfile } from "../component/FarmProfile";
import { RegisterAnimal } from "../component/RegisterAnimal";
import { HorizontalLinearStepper } from "../component/HorizontalLinearStepper";
import { AnimalInspection } from "../component/AnimalInspection";
import { SelectCover } from "../component/SelectCover";
import { ConfirmPolicy } from "../component/ConfirmPolicy";
import { PolicyCreated } from "../component/PolicyCreated";

export function Onboarding() {
  const [activeStep, setActiveStep] = useState(0);
  const animal_type = ["Cattle", "Sheep", "Goat", "Pig", "Poultry", "Horse"];
  const provinces = [
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
  const farmTypes = ["Small-scale", "Commercial"];

  // Only IDs (+ cover, which isn't a DB model) live here. Any component
  // that needs to *display* farm/animal/inspection details fetches by ID
  // itself via the real GET routes — keeps this file decoupled from every
  // table's schema, so a backend field rename doesn't ripple through here.
  const [farmProfileId, setFarmProfileId] = useState(null);
  const [firstAnimalId, setFirstAnimalId] = useState(null);
  const [inspectionId, setInspectionId] = useState(null);
  const [cover, setCover] = useState({});
  const [policyNumber, setPolicyNumber] = useState(null);

  const stepComponents = [
    <FarmProfile
      key={0}
      setActiveStep={setActiveStep}
      provinces={provinces}
      farmTypes={farmTypes}
      onSaved={(profile) => setFarmProfileId(profile.id)}
    />,
    <RegisterAnimal
      key={1}
      setActiveStep={setActiveStep}
      animalType={animal_type}
      onSaved={(animal) => setFirstAnimalId(animal.id)}
    />,
    <AnimalInspection
      key={2}
      setActiveStep={setActiveStep}
      animalId={firstAnimalId}
      onSaved={(inspection) => setInspectionId(inspection.id)}
    />,
    <SelectCover
      key={3}
      setActiveStep={setActiveStep}
      setCover={setCover}
      farmProfileId={farmProfileId}
    />,
    <ConfirmPolicy
      key={4}
      setActiveStep={setActiveStep}
      farmProfileId={farmProfileId}
      firstAnimalId={firstAnimalId}
      inspectionId={inspectionId}
      cover={cover}
      onCreated={(policy) => setPolicyNumber(policy.policy_number)}
    />,
    <PolicyCreated key={5} policyNumber={policyNumber} />,
  ];

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <HorizontalLinearStepper
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />
      {stepComponents[activeStep]}
    </Box>
  );
}
