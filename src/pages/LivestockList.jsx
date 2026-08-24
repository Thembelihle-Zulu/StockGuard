// import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { ListItems } from "../component/ListItems";
import { Livestock } from "../component/Livestock";
import { RegisterAnimal } from "../component/RegisterAnimal";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
export function LivestockList({ onCountChange }) {
  const url = `onboarding/animal`;
  const [open, setOpen] = useState(false);
  const animalType = ["Cattle", "Sheep", "Goat", "Pig", "Poultry", "Horse"];
  const [refreshKey, setRefreshKey] = useState(0);
  const handleAnimalAdded = () => {
    setRefreshKey((k) => k + 1);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <section className="claims-page">
      <div>
        <h2>My Livestock</h2>
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          <AddIcon />
        </Button>
      </div>
      <div className="claim-card">
        <div className="pills">
          <span className="claim-status-badge claim-status-pending">
            Pending
          </span>
          <span className="claim-status-badge claim-status-denied">Denied</span>
          <span className="claim-status-badge claim-status-approved">
            Approved
          </span>
        </div>
      </div>
      <ListItems
        onCountChange={onCountChange}
        key={refreshKey}
        Component={Livestock}
        url={url}
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
            <RegisterAnimal
              animalType={animalType}
              isModal={true}
              handleClose={handleClose}
              onSuccess={handleAnimalAdded}
            />
          </DialogContent>
        </BootstrapDialog>
      )}
    </section>
  );
}
