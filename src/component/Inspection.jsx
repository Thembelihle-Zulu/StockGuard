import { InspectionModal } from "./InspectionModal";
import { useState } from "react";
import { API_ORIGIN } from "../utils/api";
import "../styles/claims-list.css";

const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  // "Denied" reads as final — an inspection missing evidence or under
  // value dispute can be fixed and resubmitted, so the label should say
  // that's expected, not that it's over. The status value itself stays
  // "denied" (matches the backend/resubmission check), only the display
  // text changes.
  denied: "Changes Requested",
};

export function Inspection({ item, onResubmitted }) {
  const [open, setOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const inspection = item;
  const statusKey = (inspection.status || "pending").toLowerCase();

  return (
    <div className="claim-card">
      {inspection.tag_photo_url && !imageFailed ? (
        <img
          className="claim-card-image"
          src={`${API_ORIGIN}${inspection.tag_photo_url}`}
          alt={`Tag photo for animal ${inspection.tag_number || inspection.livestock_id}`}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="claim-card-image claim-card-image--placeholder">
          No photo
        </div>
      )}

      <div className="claim-card-details">
        <div className="claim-card-top">
          <h3 className="claim-card-type">
            {inspection.species || "Inspection"}
            {inspection.tag_number ? ` — ${inspection.tag_number}` : ""}
          </h3>
          <span className={`claim-status-badge claim-status-${statusKey}`}>
            {STATUS_LABELS[statusKey] || inspection.status}
          </span>
        </div>
        <p className="claim-card-animal">Animal: {inspection.livestock_id}</p>
      </div>

      <div className="claim-card-meta">
        <p className="claim-card-date">
          {inspection.inspection_date
            ? new Date(inspection.inspection_date).toLocaleDateString()
            : "—"}
        </p>
        <button className="claim-view-btn" onClick={() => setOpen(true)}>
          View Details
        </button>
      </div>

      {open && (
        <InspectionModal
          setOpen={setOpen}
          open={open}
          inspection={inspection}
          onResubmitted={onResubmitted}
        />
      )}
    </div>
  );
}
