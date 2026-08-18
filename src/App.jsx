import { NavLink, Route, Routes, useNavigate } from "react-router";
import {
  AppBar,
  Toolbar,
  Box,
  Stack,
  Button,
  GlobalStyles,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import { Onboarding } from "./pags/Onboarding";
import "./App.css";
import { AnimalInspection } from "./component/AnimalInspection";
import { RegisterAnimal } from "./component/RegisterAnimal";
import { SelectCover } from "./component/SelectCover";
import { Home } from "./pags/Home";
// import { Signup } from "./pags/Signup";
// import { Dashboard } from "./pags/dashboard";
import { Dashboard } from "./pags/dashboard";
import { FileClaim } from "./pags/FileClaim";
function App() {
  const navigate = useNavigate();
  const animal_type = ["Cattle", "Sheep", "Goat", "Pig", "Poultry", "Horse"];

  return (
    <>
      <GlobalStyles
        styles={{
          body: { margin: 0 },
          "body, button, input, textarea": {
            fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/onboarding/register-animal"
          element={<RegisterAnimal animalType={animal_type} />}
        />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="/onboarding/animal-inspection"
          element={<AnimalInspection animalType={animal_type} />}
        />
        <Route path="/onboarding/select-cover" element={<SelectCover />} />
        {/* <Route path="/signup" element={<Signup />} />
          <Route path="/signup" element={<Signup />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/file-claim" element={<FileClaim />} />
      </Routes>
    </>
  );
}

export default App;
