import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const steps = [
  "Farm Profile",
  "Register First Animal",
  "Animal Inspection",
  "Health Cover",
  "Confirm Policy",
  "Policy Created",
];

export function HorizontalLinearStepper({ setActiveStep, activeStep }) {
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = React.useCallback((step) => {
    return step === 1;
  }, []);

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const previousActiveStepRef = React.useRef(activeStep);
  const resetButtonRef = React.useRef(null);
  const nextButtonRef = React.useRef(null);

  React.useEffect(() => {
    const previousActiveStep = previousActiveStepRef.current;
    previousActiveStepRef.current = activeStep;

    if (activeStep === steps.length) {
      resetButtonRef.current.focus();
      return;
    }
    if (activeStep === 0 && previousActiveStep === steps.length) {
      nextButtonRef.current.focus();
      return;
    }
    if (isStepOptional(previousActiveStep) && !isStepOptional(activeStep)) {
      nextButtonRef.current.focus();
    }
  }, [activeStep, isStepOptional]);

  return (
    <Box
      sx={{ width: "100%", pt: { xs: 3, md: 4 }, pb: 2, px: { xs: 2, md: 4 } }}
    >
      <Stepper
        activeStep={activeStep}
        sx={{
          "& .MuiStepIcon-root": {
            color: "oklch(0.9 0.02 154.55)",
          },
          "& .MuiStepIcon-root.Mui-active": {
            color: "oklch(0.32 0.1 154.55)",
          },
          "& .MuiStepIcon-root.Mui-completed": {
            color: "oklch(0.55 0.15 154.55)",
          },
          "& .MuiStepLabel-label": {
            fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          },
          "& .MuiStepLabel-label.Mui-active": {
            fontWeight: 600,
            color: "oklch(0.2 0.03 154.55)",
          },
          "& .MuiStepConnector-line": {
            borderColor: "oklch(0.9 0.02 154.55)",
          },
          "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line, & .MuiStepConnector-root.Mui-completed .MuiStepConnector-line":
            {
              borderColor: "oklch(0.55 0.15 154.55)",
            },
        }}
      >
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button
              onClick={handleReset}
              ref={resetButtonRef}
              sx={{
                bgcolor: "oklch(0.32 0.1 154.55)",
                color: "white",
                borderRadius: "2rem",
                px: "1.5rem",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: "oklch(0.27 0.1 154.55)" },
              }}
            >
              Reset
            </Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                color: "oklch(0.32 0.1 154.55)",
                textTransform: "none",
                fontWeight: 600,
                mr: 1,
                "&.Mui-disabled": { color: "oklch(0.8 0.02 154.55)" },
              }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {isStepOptional(activeStep) && (
              <Button
                onClick={handleSkip}
                sx={{
                  color: "oklch(0.35 0.02 154.55)",
                  textTransform: "none",
                  fontWeight: 600,
                  mr: 1,
                }}
              >
                Skip
              </Button>
            )}
            <Button
              onClick={handleNext}
              ref={nextButtonRef}
              sx={{
                bgcolor: "oklch(0.32 0.1 154.55)",
                color: "white",
                borderRadius: "2rem",
                px: "1.75rem",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: "oklch(0.27 0.1 154.55)" },
              }}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
