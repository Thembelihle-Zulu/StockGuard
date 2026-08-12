import { NavLink, Route, Routes } from "react-router";
import { Onboarding } from "../pags/Onboarding";
import "./App.css";
import { AnimalInspection } from "./component/AnimalInspection";
import { RegisterAnimal } from "./component/RegisterAnimal";
import { SelectCover } from "./component/SelectCover";
import { Home } from "../pags/Home";
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
      <div className="home">
        <header>
          <img src="img.png" alt="logo" />
          <nav>
            <NavLink to="/">Features</NavLink>
            <NavLink to="../">How it works</NavLink>
            <NavLink to="../">Who We Serve</NavLink>
            <NavLink to="../">About</NavLink>
          </nav>
          <div className="button-group">
            <button>Login</button>
            <button>Get Started</button>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
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
