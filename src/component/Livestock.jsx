import { LivestockModal } from "./LivestockModal";
import { useState } from "react";
import PetsIcon from "@mui/icons-material/Pets";
import CakeIcon from "@mui/icons-material/Cake";
import "../styles/livestock-list.css";

const API_ORIGIN = "http://127.0.0.1:5000";

const STATUS_STYLES = {
  alive: {
    label: "Healthy",
    className: "livestock-status livestock-status--alive",
  },
  sick: { label: "Sick", className: "livestock-status livestock-status--sick" },
  deceased: {
    label: "Deceased",
    className: "livestock-status livestock-status--deceased",
  },
};

function StatusBadge({ status }) {
  const key = (status || "alive").toLowerCase();
  const style = STATUS_STYLES[key] ?? {
    label: status || "Unknown",
    className: "livestock-status livestock-status--unknown",
  };
  return <span className={style.className}>{style.label}</span>;
}

export function Livestock({ item }) {
  const [open, setOpen] = useState(false);
  const livestock = item;

  return (
    <div className="livestock-card">
      <img
        className="livestock-card-image"
        src={`${API_ORIGIN}${livestock.image}`}
        alt={livestock.tag_number}
      />

      <div className="livestock-card-body">
        <div className="livestock-card-top">
          <span className="livestock-card-tag">{livestock.tag_number}</span>
          <StatusBadge status={livestock.status} />
        </div>

        <h3 className="livestock-card-species">{livestock.species}</h3>

        <div className="livestock-card-meta">
          <span className="livestock-card-meta-item">
            <PetsIcon fontSize="inherit" /> {livestock.breed}
          </span>
          <span className="livestock-card-meta-item">
            <CakeIcon fontSize="inherit" /> {livestock.age} yrs
          </span>
        </div>

        <div className="livestock-card-footer">
          <span className="livestock-card-value">
            R {Number(livestock.estimated_value).toLocaleString()}
          </span>
          <button className="livestock-view-btn" onClick={() => setOpen(true)}>
            View Details
          </button>
        </div>
      </div>

      {open && (
        <LivestockModal setOpen={setOpen} open={open} livestock={livestock} />
      )}
    </div>
  );
}
