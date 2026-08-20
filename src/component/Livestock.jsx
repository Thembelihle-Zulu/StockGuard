import { ClaimModal } from "./ClaimModal";
import { useState } from "react";
export function LIvestock({ livestock }) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  return (
    <div className="claim-card">
      <img
        className="claim-card-image"
        src={livestock.image}
        alt={`Incident photo for livestock on livestock ${livestock.id}`}
      />

      <div className="claim-card-details">
        <p className="claim-card-animal">Species: {livestock.species}</p>
        <p className="claim-card-type">Breed: {livestock.breed}</p>
        <p className="claim-card-cause">Age: {livestock.age}</p>
      </div>

      <div className="claim-card-meta">
        <span
          className={`claim-status-badge claim-status-${claim.status.toLowerCase()}`}
        >
          {livestock.status}
        </span>
        <p className="claim-card-date">
          Estimated Value:{" "}
          {new Date(livestock.estimated_value).toLocaleDateString()}
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
