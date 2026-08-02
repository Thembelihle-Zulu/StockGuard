import { Route, Routes } from "react-router";
import { Onboarding } from "../pags/Onboarding";
import "./App.css";
import { AnimalInspection } from "./component/AnimalInspection";
import { RegisterAnimal } from "./component/RegisterAnimal";
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
          <Route path="/" element={<Onboarding />} />
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
