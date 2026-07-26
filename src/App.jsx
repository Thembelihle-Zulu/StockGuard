import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { FarmProfile } from "./component/FarmProfile";
import { Route, Routes } from "react-router";
import { RegisterAnimal } from "./component/RegisterAnimal";
import { AnimalInspection } from "./component/AnimalInspection";
import { SelectCover } from "./component/SelectCover";
function App() {
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
  return (
    <>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <FarmProfile provinces={provinces} farmTypes={farmTypes} />
            }
          />
          <Route
            path="/onboarding/register-animal"
            element={<RegisterAnimal animalType={animal_type} />}
          />
          <Route
            path="/onboarding/animal-inspection"
            element={<AnimalInspection animalType={animal_type} />}
          />
          <Route path="/onboarding/select-cover" element={<SelectCover />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
