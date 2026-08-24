import { GlobalStyles } from "@mui/material";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import "./App.css";
import { Home } from "./pages/Home";
import { Onboarding } from "./pages/Onboarding";
// import { Signup } from "./pages/Signup";
// import { Dashboard } from "./pages/dashboard";
import { Dashboard } from "./pages/dashboard";
import { Login } from "./pages/Login";
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
        {/* <Route
          path="/onboarding/register-animal"
          element={<RegisterAnimal animalType={animal_type} />}
        />

        <Route
          path="/onboarding/animal-inspection"
          element={<AnimalInspection animalType={animal_type} />}
        />
        <Route path="/onboarding/select-cover" element={<SelectCover />} />
        <Route path="/signup" element={<Signup />} />
        // <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/file-claim" element={<FileClaim />} />
        <Route path="/claims" element={<ClaimsList />} /> */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate replace to="/login" />;
}
