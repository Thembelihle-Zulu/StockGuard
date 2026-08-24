import { LivestockModal } from "./LivestockModal";
import { useState } from "react";

const API_ORIGIN = "http://127.0.0.1:5000";

export function Livestock({ item }) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const livestock = item;

  return (
    <div className="claim-card">
      <img
        className="claim-card-image"
        src={`${API_ORIGIN}${livestock.image}`}
        alt={livestock.tag_number}
      />

      <div className="claim-card-details">
        <p className="claim-card-animal">Species: {livestock.species}</p>
        <p className="claim-card-type">Breed: {livestock.breed}</p>
        <p className="claim-card-cause">Age: {livestock.age}</p>
      </div>

      <div className="claim-card-meta">
        <span
          className={`claim-status-badge claim-status-${(livestock.status || "alive").toLowerCase()}`}
        >
          {livestock.status || "Alive"}
        </span>
        <p className="claim-card-date">
          Estimated Value: R {livestock.estimated_value}
        </p>
      </div>

      <div className="button-view">
        <button className="claim-view-btn" onClick={handleClickOpen}>
          View Details
        </button>
      </div>
      {open && (
        <LivestockModal setOpen={setOpen} open={open} livestock={livestock} />
      )}
    </div>
  );
}
