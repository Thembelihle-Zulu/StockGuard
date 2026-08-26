import { useState } from "react";
import { Button } from "@mui/material";
import { Claim } from "../component/Claim";
import { ListItems } from "../component/ListItems";
import { ClaimStatusFilter } from "../component/ClaimStatusFilter";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { FileClaim } from "./FileClaim";
import "../styles/claims-list.css";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const CLAIMS_URL = "claims";

export function ClaimsList() {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState(null);

  const handleClaimAdded = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <section className="claims-page">
      <div className="claims-page-header">
        <h2 className="claims-page-title">My Claims</h2>
        <Button
          onClick={() => {
            setOpen(true);
          }}
          startIcon={<AddIcon />}
          className="claims-new-btn"
        >
          New Claim
        </Button>
      </div>

      <ClaimStatusFilter onFilterChange={setStatusFilter} />

      <ListItems
        Component={Claim}
        url={CLAIMS_URL}
        statusFilter={statusFilter}
        key={refreshKey}
      />

      {open && (
        <BootstrapDialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                m: 2, // shrink MUI's default 32px paper margin
                boxShadow: "none", // FileClaim's Paper already has its own border
                bgcolor: "transparent",
              },
            },
          }}
        >
          <DialogContent>
            <FileClaim
              key={refreshKey}
              handleClose={handleClose}
              onSuccess={handleClaimAdded}
            />
          </DialogContent>
        </BootstrapDialog>
      )}
    </section>
  );
}
