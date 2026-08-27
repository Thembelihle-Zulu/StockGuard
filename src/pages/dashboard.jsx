import { useEffect, useState } from "react";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import { apiFetch } from "../utils/api";
import { getGreeting, TODAY } from "../utils/greeting";
import { Sidebar } from "../component/Sidebar";
import { NotificationBell } from "../component/NotificationBell";
import { ClaimsList } from "./ClaimsList";
import { LivestockList } from "./LivestockList";
import { InspectionsList } from "./InspectionsList";
import { PoliciesList } from "./PoliciesList";
import { PaymentsList } from "./PaymentsList";
import { FarmProfilePage } from "./FarmProfilePage";
import { FarmReports } from "./FarmReports";
import { FarmDashboard } from "./FarmDashboard";
import { LivestockManagement } from "./admin/LivestockManagement";
import { ClaimsManagement } from "./admin/ClaimsManagement";
import { InspectionsManagement } from "./admin/InspectionsManagement";
import { PoliciesManagement } from "./admin/PoliciesManagement";

import "../styles/dashboard.css";
import "../styles/sidebar.css";

export function Dashboard() {
  const role = localStorage.getItem("role");
  const [livestockCount, setLivestockCount] = useState(0);
  const [claimsCount, setClaimsCount] = useState(0);
  const [farmProfile, setFarmProfile] = useState(null);

  const [activePanel, setActivePanel] = useState("dashboard");

  useEffect(() => {
    if (role === "ADMIN") return;
    apiFetch("onboarding/farm_profile/me")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then(setFarmProfile)
      .catch(console.error);
  }, [role]);

  const toggleDashboard = () => setActivePanel("dashboard");
  const toggleClaims = () => setActivePanel("claims");
  const toggleLivestock = () => setActivePanel("livestock");
  const toggleInspections = () => setActivePanel("inspections");
  const togglePolicies = () => setActivePanel("policies");
  const togglePayments = () => setActivePanel("payments");
  const toggleProfile = () => setActivePanel("profile");
  const toggleReports = () => setActivePanel("reports");

  let panelContent;
  switch (activePanel) {
    case "claims":
      panelContent = (
        <section className="claim-list">
          <ClaimsList onCountChange={setClaimsCount} />
        </section>
      );
      break;
    case "livestock":
      panelContent = (
        <section className="claim-list">
          <LivestockList onCountChange={setLivestockCount} />
        </section>
      );
      break;
    case "inspections":
      panelContent = (
        <section className="claim-list">
          <InspectionsList />
        </section>
      );
      break;
    case "policies":
      panelContent = (
        <section className="claim-list">
          <PoliciesList />
        </section>
      );
      break;
    case "payments":
      panelContent = (
        <section className="claim-list">
          <PaymentsList />
        </section>
      );
      break;
    case "profile":
      panelContent = (
        <section className="claim-list">
          <FarmProfilePage />
        </section>
      );
      break;
    case "reports":
      panelContent = (
        <section className="claim-list">
          <FarmReports />
        </section>
      );
      break;
    default:
      panelContent = (
        <FarmDashboard
          onToggleClaims={toggleClaims}
          onTogglePolicies={togglePolicies}
          onToggleLivestock={toggleLivestock}
          onToggleInspections={toggleInspections}
          onToggleReports={toggleReports}
        />
      );
  }

  return (
    <section className="farmer-shell">
      <header className="topnav" role="banner">
        <div className="topnav-welcome">
          <h3>
            {getGreeting()},{" "}
            {role === "ADMIN" ? "Admin" : farmProfile?.farm_name || "there"}
          </h3>
          <p>{TODAY}</p>
        </div>
        <div className="topnav-actions">
          {role !== "ADMIN" && <NotificationBell />}
          <span className="admin-role-pill topnav-role-pill">
            <AgricultureIcon fontSize="inherit" />
            {role === "ADMIN" ? "Administrator" : "Farmer"}
          </span>
          <div
            className="avatar"
            title={role === "ADMIN" ? undefined : "View profile"}
            onClick={role === "ADMIN" ? undefined : toggleProfile}
            style={{ cursor: role === "ADMIN" ? "default" : "pointer" }}
          >
            {(farmProfile?.farm_name || "F")[0].toUpperCase()}
          </div>
        </div>
      </header>

      <Sidebar
        livestockCount={livestockCount}
        claimsCount={claimsCount}
        onToggleClaims={toggleClaims}
        onToggleLivestock={toggleLivestock}
        onToggleDashboard={toggleDashboard}
        onToggleInspections={toggleInspections}
        activePanel={activePanel}
        onTogglePolicies={togglePolicies}
        onTogglePayments={togglePayments}
        onToggleProfile={toggleProfile}
        onToggleReports={toggleReports}
      />

      {role === "ADMIN" ? (
        <>
          {activePanel === "claims" && (
            <section className="kpi-list">
              <ClaimsManagement />
            </section>
          )}
          {activePanel === "livestock" && (
            <section className="kpi-list">
              <LivestockManagement setLivestockCount={setLivestockCount} />
            </section>
          )}
          {activePanel === "policies" && (
            <section className="kpi-list">
              <PoliciesManagement />
            </section>
          )}
          {activePanel === "inspections" && (
            <section className="kpi-list">
              <InspectionsManagement />
            </section>
          )}
        </>
      ) : (
        <>{panelContent}</>
      )}
    </section>
  );
}
