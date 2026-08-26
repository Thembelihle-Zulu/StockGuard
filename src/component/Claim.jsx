import { ClaimModal } from "./ClaimModal";
import { useState } from "react";
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

      <div className="claim-card-details">
        <div className="claim-card-top">
          <h3 className="claim-card-type">{claim.claim_type}</h3>
          <span className={`claim-status-badge claim-status-${statusKey}`}>
            {STATUS_LABELS[statusKey] || claim.status}
          </span>
        </div>
        <p className="claim-card-animal">Animal: {claim.livestock_id}</p>
        <p className="claim-card-cause">{claim.cause}</p>
      </div>

      <div className="claim-card-meta">
        {claim.claim_amount != null && (
          <span className="claim-card-amount">
            R {Number(claim.claim_amount).toLocaleString()}
          </span>
        )}
        <p className="claim-card-date">
          {claim.date_of_incident
            ? new Date(claim.date_of_incident).toLocaleDateString()
            : "—"}
        </p>
        <button className="claim-view-btn" onClick={() => setOpen(true)}>
          View Details
        </button>
      </div>

      {open && <ClaimModal setOpen={setOpen} open={open} claim={claim} />}
    </div>
  );
}
