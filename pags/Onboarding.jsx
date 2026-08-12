import { useState } from "react";
import { FarmProfile } from "../src/component/FarmProfile";
import { RegisterAnimal } from "../src/component/RegisterAnimal";
import { HorizontalLinearStepper } from "../src/component/HorizontalLinearStepper";
import { AnimalInspection } from "../src/component/AnimalInspection";
import { SelectCover } from "../src/component/SelectCover";
import { ConfirmPolicy } from "../src/component/ConfirmPolicy";
import { PolicyCreated } from "../src/component/PolicyCreated";

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
    />,
    <AnimalInspection
      key={3}
      setActive={setActiveStep}
      setInspection={setInspection}
    />,
    <SelectCover key={4} />,
    <ConfirmPolicy
      key={5}
      setActiveStep={setActiveStep}
      farmProfile={farm_profile}
      firstAnimal={firstAnimal}
      inspection={inspection}
      setCreatedPolicy={setCreatedPolicy}
    />,
    <PolicyCreated key={6} policy={createdPolicy} inspection={inspection} />,
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
