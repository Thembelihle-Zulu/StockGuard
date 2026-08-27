import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { apiFetch } from "../utils/api";

const SEEN_KEY = "stockguard_seen_notifications";

// No backend notification store — these are derived client-side from
// already-approved claims/inspections. "New" just means "not opened the
// bell since this became approved yet", tracked as a set of seen ids in
// localStorage, not a real read/unread flag on the server.
function loadSeenIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveSeenIds(ids) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...ids]));
  } catch {
    // localStorage unavailable (private mode, etc.) — badge just won't
    // remember what's been seen across reloads, not worth failing over.
  }
}

export function NotificationBell() {
  const isAdmin = localStorage.getItem("role") === "ADMIN";
  const [anchorEl, setAnchorEl] = useState(null);
  const [claims, setClaims] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [seenIds, setSeenIds] = useState(loadSeenIds);

  useEffect(() => {
    apiFetch(isAdmin ? "claims/admin/all" : "claims")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setClaims(Array.isArray(data) ? data : []))
      .catch(() => {});

    apiFetch(isAdmin ? "onboarding/inspection/admin/all" : "onboarding/inspection")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setInspections(Array.isArray(data) ? data : []))
      .catch(() => {});

    apiFetch(isAdmin ? "onboarding/animal/admin/all" : "onboarding/animal")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setAnimals(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [isAdmin]);

  // Farmers get notified when their submissions are decided; admins get
  // notified about new submissions waiting on them — different status,
  // same derivation approach.
  const notifications = useMemo(() => {
    const animalById = {};
    animals.forEach((a) => {
      animalById[a.id] = a;
    });

    const targetStatus = isAdmin ? "pending" : "approved";
    const claimIcon = isAdmin ? HourglassEmptyIcon : CheckCircleIcon;
    const inspectionIcon = isAdmin ? HourglassEmptyIcon : FactCheckIcon;

    const claimNotifs = claims
      .filter((c) => (c.status || "pending").toLowerCase() === targetStatus)
      .map((c) => ({
        id: `claim-${c.id}`,
        icon: claimIcon,
        message: isAdmin
          ? `New ${c.claim_type || "claim"} submitted for ${
              animalById[c.livestock_id]?.tag_number || "an animal"
            }`
          : `Your ${c.claim_type || "claim"} for ${
              animalById[c.livestock_id]?.tag_number || "an animal"
            } was approved`,
        date: c.created_date,
      }));

    const inspectionNotifs = inspections
      .filter((i) => (i.status || "pending").toLowerCase() === targetStatus)
      .map((i) => ({
        id: `inspection-${i.id}`,
        icon: inspectionIcon,
        message: isAdmin
          ? `New inspection submitted for ${
              animalById[i.livestock_id]?.tag_number || "an animal"
            }`
          : `Inspection for ${
              animalById[i.livestock_id]?.tag_number || "an animal"
            } was approved`,
        date: i.inspection_date,
      }));

    return [...claimNotifs, ...inspectionNotifs].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
  }, [claims, inspections, animals, isAdmin]);

  const unseenCount = notifications.filter((n) => !seenIds.has(n.id)).length;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    const nextSeen = new Set(seenIds);
    notifications.forEach((n) => nextSeen.add(n.id));
    setSeenIds(nextSeen);
    saveSeenIds(nextSeen);
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        className="icon-btn"
        onClick={handleOpen}
        aria-label="Notifications"
      >
        <Badge badgeContent={unseenCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: { sx: { width: 340, maxHeight: 420, borderRadius: 3, mt: 1 } },
        }}
      >
        <Typography
          sx={{
            px: 2,
            py: 1.5,
            fontWeight: 700,
            color: "oklch(0.2 0.03 154.55)",
          }}
        >
          Notifications
        </Typography>
        <Divider />
        {notifications.length === 0 ? (
          <Typography
            sx={{
              px: 2,
              py: 3,
              color: "oklch(0.55 0.01 90)",
              fontSize: "0.85rem",
              textAlign: "center",
            }}
          >
            {isAdmin
              ? "Nothing waiting on you — new claims and inspections will show up here."
              : "Nothing yet — you'll see updates here when a claim or inspection is approved."}
          </Typography>
        ) : (
          notifications.slice(0, 15).map((n) => (
            <Box
              key={n.id}
              sx={{
                display: "flex",
                gap: 1.25,
                px: 2,
                py: 1.25,
                borderBottom: "1px solid oklch(0.94 0.005 90)",
              }}
            >
              <n.icon
                fontSize="small"
                sx={{ color: "oklch(0.32 0.1 154.55)", mt: 0.25 }}
              />
              <Box>
                <Typography
                  sx={{ fontSize: "0.85rem", color: "oklch(0.2 0.03 154.55)" }}
                >
                  {n.message}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.72rem", color: "oklch(0.55 0.01 90)" }}
                >
                  {n.date ? new Date(n.date).toLocaleDateString() : ""}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Popover>
    </>
  );
}
