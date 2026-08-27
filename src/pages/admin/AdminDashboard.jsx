import { useState } from "react";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Sidebar } from "../../component/Sidebar";
import { ClaimsManagement } from "./ClaimsManagement";
import { LivestockManagement } from "./LivestockManagement";
import { InspectionsManagement } from "./InspectionsManagement";
import { PoliciesManagement } from "./PoliciesManagement";
import { ReportsManagement } from "./ReportsManagement";
import { AdminOverview } from "./AdminOverview";
import { getGreeting, TODAY } from "../../utils/greeting";
import "../../styles/dashboard.css";

export function AdminDashboard() {
  const [livestockCount, setLivestockCount] = useState(0);
  const [activePanel, setActivePanel] = useState(null);

  return (
    <section className="admin">
      <header className="topnav admin-topnav" role="banner">
        <div className="topnav-welcome">
          <h3>{getGreeting()}, Admin</h3>
          <p>{TODAY}</p>
        </div>
        <div className="topnav-actions">
          <span className="admin-role-pill">
            <AdminPanelSettingsIcon fontSize="inherit" />
            Administrator
          </span>
          <div className="avatar">A</div>
        </div>
      </header>

      <Sidebar
        livestockCount={livestockCount}
        onToggleClaims={() =>
          setActivePanel((prev) => (prev === "claims" ? null : "claims"))
        }
        onToggleLivestock={() =>
          setActivePanel((prev) => (prev === "livestock" ? null : "livestock"))
        }
        onToggleInspections={() =>
          setActivePanel((prev) =>
            prev === "inspections" ? null : "inspections",
          )
        }
        onTogglePolicies={() =>
          setActivePanel((prev) => (prev === "policies" ? null : "policies"))
        }
        onToggleReports={() =>
          setActivePanel((prev) => (prev === "reports" ? null : "reports"))
        }
        activePanel={activePanel}
      />

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
      {activePanel === "inspections" && (
        <section className="kpi-list">
          <InspectionsManagement />
        </section>
      )}
      {activePanel === "policies" && (
        <section className="kpi-list">
          <PoliciesManagement />
        </section>
      )}
      {activePanel === "reports" && (
        <section className="kpi-list">
          <ReportsManagement />
        </section>
      )}
      {activePanel === null && (
        <AdminOverview
          onToggleClaims={() => setActivePanel("claims")}
          onToggleLivestock={() => setActivePanel("livestock")}
          onToggleInspections={() => setActivePanel("inspections")}
          onToggleReports={() => setActivePanel("reports")}
        />
      )}
    </section>
  );
}
