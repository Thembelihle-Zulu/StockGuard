import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const CONTACT_OPTIONS = [
  {
    icon: PhoneIcon,
    label: "Call an Agent",
    detail: "0800 123 456 · Mon–Fri, 8am–5pm",
    href: "tel:0800123456",
  },
  {
    icon: WhatsAppIcon,
    label: "WhatsApp",
    detail: "082 000 0000",
    href: "https://wa.me/27820000000",
  },
  {
    icon: EmailIcon,
    label: "Email Support",
    detail: "support@stockguard.co.za",
    href: "mailto:support@stockguard.co.za",
  },
];

export function TalkToAgentModal({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 4 } } }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Typography
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "oklch(0.2 0.03 154.55)",
            }}
          >
            Talk to an Agent
          </Typography>
          <IconButton size="small" onClick={onClose} aria-label="Close">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Typography sx={{ color: "oklch(0.5 0.02 154.55)", fontSize: "0.88rem", mt: 0.5, mb: 2.5 }}>
          Questions about a claim, your policy, or your cover? Reach a real
          person here.
        </Typography>

        <Stack spacing={1.25}>
          {CONTACT_OPTIONS.map((option) => (
            <a
              key={option.label}
              href={option.href}
              target={option.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.9rem",
                padding: "0.85rem 1rem",
                borderRadius: "0.9rem",
                border: "1px solid oklch(0.9 0.02 154.55)",
                textDecoration: "none",
              }}
            >
              <option.icon sx={{ color: "oklch(0.32 0.1 154.55)" }} />
              <span>
                <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "oklch(0.2 0.03 154.55)" }}>
                  {option.label}
                </Typography>
                <Typography sx={{ fontSize: "0.78rem", color: "oklch(0.5 0.02 154.55)" }}>
                  {option.detail}
                </Typography>
              </span>
            </a>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
