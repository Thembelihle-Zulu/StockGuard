import { useState } from "react";
import { RegisterAnimal } from "./RegisterAnimal";
import { AnimalInspection } from "./AnimalInspection";

export function RegisterAnimalFlow({ animalType, handleClose, onSuccess }) {
  const [step, setStep] = useState("animal");
  const [animalId, setAnimalId] = useState(null);

  if (step === "animal") {
    return (
      <RegisterAnimal
        animalType={animalType}
        isModal
        handleClose={handleClose}
        onSaved={(animal) => {
          setAnimalId(animal.id);
          setStep("inspection");
          onSuccess?.();
        }}
      />
    );
  }

  return (
    <AnimalInspection
      animalId={animalId}
      isModal
      handleClose={handleClose}
      onSaved={() => {}}
    />
  );
}
