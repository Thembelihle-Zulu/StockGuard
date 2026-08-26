import { useNavigate } from "react-router";
import "../styles/sidebar.css";

export function Sidebar({
  onToggleClaims,
  onToggleLivestock,
  onToggleDashboard,
  onToggleInspections,
  livestockCount,
  activePanel,
  onTogglePolicies,
}) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  const navItemClass = (panelKey) =>
    `nav-item${activePanel === panelKey ? " active" : ""}`;

  return (
    <>
      <aside
        className="sidebar"
        id="sidebar"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="sidebar-logo">
          <div className="logo-mark" aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#234F32"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="logo-text">
            <strong>StockGuard</strong>
            <span>Livestock Insurance</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Main</span>
          <ul>
            <li>
              <a
                className={navItemClass("dashboard")}
                onClick={onToggleDashboard}
                aria-current={activePanel === "dashboard" ? "page" : undefined}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <a
                className={navItemClass("livestock")}
                onClick={onToggleLivestock}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                </svg>
                My Livestock
                <span className="nav-badge">{livestockCount}</span>
              </a>
            </li>
            {isAdmin && (
              <li>
                <a
                  className={navItemClass("inspections")}
                  onClick={onToggleInspections}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                  Inspections
                </a>
              </li>
            )}
            <li>
              <a
                className={navItemClass("policies")}
                onClick={onTogglePolicies}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Policies
              </a>
            </li>
            <li>
              <a className={navItemClass("claims")} onClick={onToggleClaims}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Claims
                <span className="nav-badge">3</span>
              </a>
            </li>
            <li>
              <a className="nav-item" href="#">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                Payments
              </a>
            </li>
          </ul>

          <span className="nav-section-label">Insights</span>
          <ul>
            <li>
              <a className="nav-item" href="#">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                Reports
              </a>
            </li>
            <li>
              <a className="nav-item" href="#">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                Health Records
              </a>
            </li>
          </ul>

          <span className="nav-section-label">Account</span>
          <ul>
            <li>
              <a className="nav-item" href="#">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profile
              </a>
            </li>
            <li>
              <a className="nav-item" href="#">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
                  <path d="M17.66 6.34a8 8 0 010 11.32M6.34 6.34a8 8 0 000 11.32" />
                </svg>
                Settings
              </a>
            </li>
          </ul>
        </nav>

        <div className="sidebar-bottom">
          <a className="nav-item" href="#">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Help &amp; Support
          </a>
          <a
            className="nav-item"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/login");
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </a>
        </div>
      </aside>
      <div className="sidebar-overlay" id="sidebarOverlay"></div>
    </>
  );
}
