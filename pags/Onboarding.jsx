import { useState } from "react";
import { FarmProfile } from "../src/component/FarmProfile";
import { RegisterAnimal } from "../src/component/RegisterAnimal";
import { HorizontalLinearStepper } from "../src/component/HorizontalLinearStepper";
import { AnimalInspection } from "../src/component/AnimalInspection";
import { SelectCover } from "../src/component/SelectCover";

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
  const stepComponents = [
    <FarmProfile
      key={0}
      setActiveStep={setActiveStep}
      provinces={provinces}
      farmTypes={farmTypes}
    />,
    <RegisterAnimal
      key={1}
      setActiveStep={setActiveStep}
      animalType={animal_type}
    />,
    <AnimalInspection key={3} setActive={setActiveStep} />,
    <SelectCover key={4} />,
  ];

  return (
    <>
      <HorizontalLinearStepper
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />
      {stepComponents[activeStep]}
    </>
  );
}
