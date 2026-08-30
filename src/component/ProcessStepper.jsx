import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";

export function ProcessStepper({ steps }) {
  return (
    <div className="process-stepper">
      <Stepper
        alternativeLabel
        sx={{
          "& .MuiStepIcon-root": { color: "oklch(0.9 0.02 154.55)" },
          "& .MuiStepIcon-root.Mui-active": { color: "oklch(0.32 0.1 154.55)" },
          "& .MuiStepIcon-root.Mui-completed": { color: "oklch(0.55 0.15 154.55)" },
          "& .MuiStepLabel-label": {
            fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
            fontWeight: 600,
            fontSize: "0.85rem",
          },
          "& .MuiStepConnector-line": { borderColor: "oklch(0.9 0.02 154.55)" },
        }}
      >
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                <Typography
                  variant="caption"
                  sx={{ color: "oklch(0.55 0.01 90)" }}
                >
                  {step.desc}
                </Typography>
              }
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
