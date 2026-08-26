import { useState } from "react";

import { Sidebar } from "../../component/Sidebar";
import { Livestock } from "../../component/Livestock";

import { ClaimsList } from "../ClaimsList";
import { LivestockList } from "../LivestockList";
import { LivestockManagement } from "./LivestockManagement";
import { ClaimsManagement } from "./ClaimsManagement";
import "../../styles/dashboard.css";
import "../../styles/sidebar.css";
export function AdminDashboard() {
  const [livestockCount, setLivestockCount] = useState(0);
  const [showLivestock, toggleLivestock] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  return (
    <>
      <header class="topnav" role="banner">
        <button
          class="icon-btn topnav-hamburger"
          onclick="toggleSidebar()"
          aria-label="Toggle navigation"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div class="topnav-welcome">
          <p>Good morning,</p>
          <h3>James Nkosi &nbsp;👋</h3>
        </div>

        <div class="topnav-search" role="search">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8A9E8E"
            stroke-width="2"
            stroke-linecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search livestock, claims, policies…"
            aria-label="Search"
          />
        </div>

        <div class="topnav-actions">
          <button
            class="icon-btn"
            id="notifBtn"
            onclick="toggleNotif()"
            aria-label="Notifications"
            aria-expanded="false"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span class="notif-dot" aria-hidden="true"></span>
          </button>
          <button class="icon-btn" aria-label="Messages">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </button>
          <div
            class="avatar"
            role="button"
            tabindex="0"
            aria-label="Profile menu"
          >
            JN
          </div>
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
    </>
  );
}
