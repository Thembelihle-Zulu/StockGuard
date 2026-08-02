import { TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { object, string, number } from "yup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router";
import { Label } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const farmProfileSchema = object({
  status: string().required("status is required"),
  animalTagNameImage: string().required(
    "A valid animalTagNameImage is required",
  ),
  vetenaryHealthReport: string().required("vetenaryHealthReport is required"),
});

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
export function AnimalInspection({ setActive }) {
  const navigate = useNavigate();
  const { values, handleChange, handleBlur, handleSubmit, touched, errors } =
    useFormik({
      initialValues: {
        status: "pending",
        animalTagNameImage: "",
        vetenaryHealthReport: "",
      },
      validationSchema: farmProfileSchema,
      onSubmit: (data) => {
        console.log(data);
        setActiveStep((prev) => prev + 1);
        // fetch("https://6a6284d51bffb2ffab8b5373.mockapi.io/farm_profile", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(data),
        // })
        //   .then((res) => {
        //     if (!res.ok) {
        //       throw new Error("Something went wrong");
        //     }

        //     return res.json();
        //   })
        //   .then((savedProfile) => {
        //     console.log(savedProfile);
        //   })
        //   .catch((err) => {
        //     console.error(err);
        //   });
      },
    });
  return (
    <div className="form-container">
      <Box
        component="form"
        sx={{ "& .MuiTextField-root": { m: 1, width: "100%" } }}
        autoComplete="off"
        onSubmit={handleSubmit}
        className="onboarding-card"
      >
        <h2>Animal Inspection</h2>
        <div>
          To qualify for insurance, every animal must complete a pre-insurance
          inspection
        </div>
        <Typography>Upload: </Typography>
        {/* <TextField
          label="animalTagNameImage"
          name="animalTagNameImage"
          variant="filled"
          onChange={handleChange}
          value={values.animalTagNameImage}
          onBlur={handleBlur}
          type="text"
        />
        {touched.animalTagNameImage && errors.animalTagNameImage
          ? errors.animalTagNameImage
          : null} */}
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload Tag Image
          <VisuallyHiddenInput
            type="file"
            name="animalTagNameImage"
            onChange={handleChange}
            value={values.animalTagNameImage}
            onBlur={handleBlur}
          />
        </Button>

        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload Vetenary Health Report
          <VisuallyHiddenInput
            type="file"
            name="vetenaryHealthReport"
            onChange={handleChange}
            value={values.vetenaryHealthReport}
            onBlur={handleBlur}
          />
        </Button>

        {/* <TextField
          label="vetenaryHealthReport"
          name="vetenaryHealthReport"
          variant="filled"
          onChange={handleChange}
          value={values.vetenaryHealthReport}
          onBlur={handleBlur}
          type="text"
        />
        {touched.vetenaryHealthReport && errors.vetenaryHealthReport
          ? errors.vetenaryHealthReport
          : null} */}

        <TextField
          label="status"
          name="status"
          variant="filled"
          onChange={handleChange}
          value={values.status}
          onBlur={handleBlur}
          disabled
          type="text"
        />
        {touched.status && errors.status ? errors.status : null}
        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          style={{ width: "50%" }}
        >
          Continue
        </Button>
      </Box>
    </div>
  );
}
