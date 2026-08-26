import { useState } from "react";
import { Sidebar } from "../component/Sidebar";
import { ClaimsList } from "./ClaimsList";
import { LivestockList } from "./LivestockList";
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

  const [activePanel, setActivePanel] = useState("dashboard");

  const toggleDashboard = () => setActivePanel("dashboard");
  const toggleClaims = () => setActivePanel("claims");
  const toggleLivestock = () => setActivePanel("livestock");
  const toggleInspections = () => setActivePanel("inspections");
  const togglePolicies = () => setActivePanel("policies");

  let panelContent;
  switch (activePanel) {
    case "claims":
      panelContent = (
        <section className="claim-list">
          <ClaimsList />
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
    default:
      panelContent = <FarmDashboard onToggleClaims={toggleClaims} />;
  }

  return (
    <>
      <header className="topnav" role="banner">
        {/* ...unchanged... */}
      </header>

      <Sidebar
        livestockCount={livestockCount}
        onToggleClaims={toggleClaims}
        onToggleLivestock={toggleLivestock}
        onToggleDashboard={toggleDashboard}
        onToggleInspections={toggleInspections}
        activePanel={activePanel}
        onTogglePolicies={togglePolicies}
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
    </>
  );
}
