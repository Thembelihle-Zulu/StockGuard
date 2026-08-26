import { ClaimModal } from "./ClaimModal";
import { useState } from "react";
import PetsIcon from "@mui/icons-material/Pets";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import "../styles/claims-list.css";

const API_ORIGIN = "http://127.0.0.1:5000";

const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  denied: "Denied",
};

export function Claim({ item }) {
  const [open, setOpen] = useState(false);
  const claim = item;
  const statusKey = (claim.status || "pending").toLowerCase();

  return (
    <div className="claim-card">
      {claim.incident_image ? (
        <img
          className="claim-card-image"
          src={`${API_ORIGIN}${claim.incident_image}`}
          alt={`Incident photo for claim on livestock ${claim.livestock_id}`}
        />
      ) : (
        <div className="claim-card-image claim-card-image--placeholder">
          No photo
        </div>
      )}

      <div className="claim-card-body">
        <div className="claim-card-top">
          <h3 className="claim-card-type">{claim.claim_type}</h3>
          <span className={`claim-status-badge claim-status-${statusKey}`}>
            {STATUS_LABELS[statusKey] || claim.status}
          </span>
        </div>

        <div className="claim-card-meta">
          <span className="claim-card-meta-item">
            <PetsIcon fontSize="inherit" /> {claim.livestock_id}
          </span>
          <span className="claim-card-meta-item">
            <CalendarTodayIcon fontSize="inherit" />
            {claim.date_of_incident
              ? new Date(claim.date_of_incident).toLocaleDateString()
              : "—"}
          </span>
        </div>

        <p className="claim-card-cause">
          {claim.cause || "No description provided."}
        </p>

        <div className="claim-card-footer">
          <span className="claim-card-amount">
            {claim.claim_amount != null
              ? `R ${Number(claim.claim_amount).toLocaleString()}`
              : "—"}
          </span>
          <button className="claim-view-btn" onClick={() => setOpen(true)}>
            View Details
          </button>
        </div>
      </div>

      {open && <ClaimModal setOpen={setOpen} open={open} claim={claim} />}
    </div>
  );
}
