import LocationOnIcon from "@mui/icons-material/LocationOn";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import "../styles/farm-dashboard.css";

export function FarmHeaderBanner({
  farmName,
  year,
  location,
  farmType,
  ownerName,
  profileCompletion,
}) {
  return (
    <div className="farm-banner">
      <span className="farm-banner-eyebrow">Farm Dashboard · {year}</span>
      <h1 className="farm-banner-title">{farmName}</h1>

      <div className="farm-banner-meta">
        {location && (
          <span className="farm-banner-meta-item">
            <LocationOnIcon fontSize="inherit" /> {location}
          </span>
        )}
        {farmType && (
          <span className="farm-banner-meta-item">
            <AgricultureIcon fontSize="inherit" /> {farmType}
          </span>
        )}
        {ownerName && (
          <span className="farm-banner-meta-item">
            {ownerName} · Policy Holder
          </span>
        )}
      </div>

      {profileCompletion != null && (
        <div className="farm-banner-progress">
          <div className="farm-banner-progress-labels">
            <span>Profile Completion</span>
            <span>{profileCompletion}%</span>
          </div>
          <div className="farm-banner-progress-track">
            <div
              className="farm-banner-progress-fill"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
