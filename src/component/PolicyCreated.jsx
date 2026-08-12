import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router";

export function PolicyCreated({ policy, inspection }) {
  const navigate = useNavigate();

  const inspectionStatus =
    !inspection?.status || inspection.status === "pending"
      ? "Pending Review"
      : inspection.status;

  return (
    <div className="form-container">
      <Box className="onboarding-card" sx={{ textAlign: "center" }}>
        <Typography variant="overline" color="text.secondary">
          Success
        </Typography>

        <Avatar
          sx={{
            bgcolor: "grey.100",
            color: "text.primary",
            width: 64,
            height: 64,
            mx: "auto",
            my: 2,
          }}
        >
          <CheckIcon fontSize="large" />
        </Avatar>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Policy Created
        </Typography>

        <Box sx={{ textAlign: "left" }}>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Policy Number
          </Typography>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "grey.300",
              borderRadius: 1,
              py: 1.5,
              textAlign: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {policy?.policy_number || "-"}
            </Typography>
          </Box>

          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Coverage
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <CheckIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography>Livestock Health Cover</Typography>
          </Box>

          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Inspection Status
          </Typography>
          <Chip
            label={inspectionStatus}
            sx={{ bgcolor: "grey.200", mb: 2 }}
            size="small"
          />

          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Premium
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            R{policy?.monthly_premium || 0}/month
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: "left" }}>
          <Typography sx={{ fontWeight: 700, mb: 1 }}>Next Steps</Typography>
          <Typography color="text.secondary">
            Our team will review your inspection documents before coverage
            becomes active.
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate("/dashboard")}
          sx={{
            mt: 3,
            bgcolor: "grey.800",
            "&:hover": { bgcolor: "grey.900" },
            py: 1.5,
          }}
        >
          Go To Dashboard
        </Button>
      </Box>
    </div>
  );
}
