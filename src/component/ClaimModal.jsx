import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export function ClaimModal({ open, setOpen, claim }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Modal title
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            <h3>{claim.id}</h3>
          </Typography>
          <Typography gutterBottom>
            <div className="claim-card-details">
              <p className="claim-card-animal">Animal: {claim.livestock_id}</p>
              <p className="claim-card-type">Claim Type: {claim.claim_type}</p>
              <p className="claim-card-cause">Cause: {claim.cause}</p>

              <h6>Status: </h6>
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
          </Typography>
          <Typography gutterBottom>{claim.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
