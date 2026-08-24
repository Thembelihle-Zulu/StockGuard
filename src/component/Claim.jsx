import { ClaimModal } from "./ClaimModal";
import { useState } from "react";
export function Claim({ item }) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const claim = item;
  console.log(claim);
  return (
    <div className="claim-card">
      <img
        className="claim-card-image"
        src={`http://127.0.0.1:5000${claim.incident_image}`}
        alt={`Incident photo for claim on livestock ${claim.livestock_id}`}
      />

      <div className="claim-card-details">
        <p className="claim-card-animal">Animal: {claim.livestock_id}</p>
        <p className="claim-card-type">Claim Type: {claim.claim_type}</p>
        <p className="claim-card-cause">Cause: {claim.cause}</p>
      </div>

      <div className="claim-card-meta">
        <span
          className={`claim-status-badge claim-status-${claim.status.toLowerCase()}`}
        >
          {claim.status}
        </span>
        <p className="claim-card-date">
          Date Submitted:{" "}
          {new Date(claim.date_of_incident).toLocaleDateString()}
        </p>
      </div>

      <div className="button-view">
        <button className="claim-view-btn" onClick={handleClickOpen}>
          View Details
        </button>
      </div>
      {open && <ClaimModal setOpen={setOpen} open={open} claim={claim} />}
    </div>
  );
}
