import "../styles/livestock-list.css";
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
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

export function LivestockList({ onCountChange }) {
  const url = `onboarding/animal`;
  const [open, setOpen] = useState(false);
  const animalType = ["Cattle", "Sheep", "Goat", "Pig", "Poultry", "Horse"];
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAnimalAdded = () => setRefreshKey((k) => k + 1);
  const handleClose = () => setOpen(false);

  return (
    <section className="livestock-page">
      <div className="livestock-page-header">
        <div>
          <span className="livestock-page-eyebrow">My Farm</span>
          <h2 className="livestock-page-title">Livestock</h2>
        </div>
        <Button
          className="livestock-new-btn"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Animal
        </Button>
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
            paper: { sx: { m: 2, boxShadow: "none", bgcolor: "transparent" } },
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
