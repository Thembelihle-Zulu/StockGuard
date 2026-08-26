import { GlobalStyles } from "@mui/material";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import "./App.css";
import "./styles/index.css";
import { Home } from "./pages/Home";
import { Onboarding } from "./pages/Onboarding";
import { Dashboard } from "./pages/dashboard";
import { Login } from "./pages/Login";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
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
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
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
function AdminOnlyRoute({ children }) {
  const role = localStorage.getItem("role");
  return role === "ADMIN" ? children : <Navigate replace to="/no-auth" />;
}
