import { useState } from "react";
import { Button } from "@mui/material";
import { Claim } from "../component/Claim";
import { ListItems } from "../component/ListItems";
import { ClaimsFilters } from "../component/ClaimsFilters";
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

const EMPTY_FILTERS = {
  search: "",
  claimType: "",
  status: "",
  dateFrom: "",
  dateTo: "",
};

export function ClaimsList({ onCountChange }) {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const handleClaimAdded = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const filterFn = (claim) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!claim.cause?.toLowerCase().includes(q)) return false;
    }

    if (filters.claimType && claim.claim_type !== filters.claimType) {
      return false;
    }

    if (filters.status && (claim.status || "pending") !== filters.status) {
      return false;
    }

    if (filters.dateFrom) {
      if (!claim.date_of_incident || claim.date_of_incident < filters.dateFrom) {
        return false;
      }
    }

    if (filters.dateTo) {
      if (!claim.date_of_incident || claim.date_of_incident > filters.dateTo) {
        return false;
      }
    }

    return true;
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

      <ClaimsFilters
        filters={filters}
        setFilters={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />

      <ListItems
        Component={Claim}
        url={CLAIMS_URL}
        filterFn={filterFn}
        onCountChange={onCountChange}
        key={refreshKey}
        emptyState={
          <div className="list-empty-state">
            <p className="list-empty-state-title">No claims filed yet.</p>
            <p>
              Only animals with an approved inspection are eligible — use
              "New Claim" above once you have one.
            </p>
          </div>
        }
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
