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
  const [farm_profile, setFarmProfile] = useState({});
  const [firstAnimal, setFirstAnimal] = useState({});
  const [inspection, setInspection] = useState({});
  const [cover, setCover] = useState({});
  const [createdPolicy, setCreatedPolicy] = useState(null);

  const stepComponents = [
    <FarmProfile
      key={0}
      setActiveStep={setActiveStep}
      provinces={provinces}
      farmTypes={farmTypes}
      setFarmProfile={setFarmProfile}
    />,
    <RegisterAnimal
      key={1}
      setActiveStep={setActiveStep}
      animalType={animal_type}
      setFirstAnimal={setFirstAnimal}
      farmProfile={farm_profile}
    />,
    <AnimalInspection
      key={2}
      setActiveStep={setActiveStep}
      setInspection={setInspection}
      firstAnimal={firstAnimal}
    />,
    <SelectCover
      key={3}
      setActiveStep={setActiveStep}
      setCover={setCover}
      farmProfile={farm_profile}
    />,
    <ConfirmPolicy
      key={4}
      setActiveStep={setActiveStep}
      farmProfile={farm_profile}
      firstAnimal={firstAnimal}
      inspection={inspection}
      cover={cover}
      setCreatedPolicy={setCreatedPolicy}
    />,
    <PolicyCreated key={5} policy={createdPolicy} inspection={inspection} />,
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
