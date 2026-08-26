import { useState } from "react";
import { Sidebar } from "../../component/Sidebar";
import { ClaimsManagement } from "./ClaimsManagement";
import { LivestockManagement } from "./LivestockManagement";
import { InspectionsManagement } from "./InspectionsManagement";
import { AdminOverview } from "./AdminOverview";
import "../../styles/dashboard.css";

export function AdminDashboard() {
  const [livestockCount, setLivestockCount] = useState(0);
  const [activePanel, setActivePanel] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <section className="admin">
      <header className="topnav" role="banner">
        {/* ...unchanged... */}
      </header>

      <Sidebar
        open={sidebarOpen}
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
      {activePanel === null && (
        <AdminOverview
          onToggleClaims={() => setActivePanel("claims")}
          onToggleLivestock={() => setActivePanel("livestock")}
        />
      )}
    </section>
  );
}
