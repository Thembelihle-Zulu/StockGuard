import Button from "@mui/material/Button";

const API_ORIGIN = "http://127.0.0.1:5000";

export function EvidenceLink({ label, url }) {
  if (!url) return null;
  return (
    <Button
      component="a"
      href={`${API_ORIGIN}${url}`}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        justifyContent: "flex-start",
        textTransform: "none",
        color: "oklch(0.32 0.1 154.55)",
        border: "1px solid oklch(0.85 0.02 154.55)",
        borderRadius: 2,
        px: 2,
        py: 1,
        fontWeight: 500,
      }}
    >
      {label}
    </Button>
  );
}
