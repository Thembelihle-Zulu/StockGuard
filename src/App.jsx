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
import { Onboarding } from "./pages/Onboarding";
import "./App.css";
import { AnimalInspection } from "./component/AnimalInspection";
import { RegisterAnimal } from "./component/RegisterAnimal";
import { SelectCover } from "./component/SelectCover";
import { Home } from "./pages/Home";
// import { Signup } from "./pages/Signup";
// import { Dashboard } from "./pages/dashboard";
import { Dashboard } from "./pages/dashboard";
import { FileClaim } from "./pages/FileClaim";
import { Claim } from "./component/Claim";
import { ClaimsList } from "./pages/ClaimsList";
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
        <Route path="/claims" element={<ClaimsList />} />
      </Routes>
    </>
  );
}

export default App;
