import { useState } from "react";
import { RegisterAnimal } from "./RegisterAnimal";
import { AnimalInspection } from "./AnimalInspection";

// Chains animal registration straight into its inspection — reuses both
// existing forms exactly as onboarding already does (register the first
// animal, then inspect it), just applied to every animal, not only the
// first. The animal id is passed through automatically; the farmer never
// picks it from a list, so there's nothing to misremember.
//
// onSuccess fires as soon as the animal is saved (it already exists in
// the DB at that point, regardless of whether the inspection step gets
// completed or abandoned) so callers refresh their list right away.
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
