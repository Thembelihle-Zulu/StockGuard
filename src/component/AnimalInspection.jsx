import { TextField } from "@mui/material";
import { useFormik } from "formik";
import { object, string, number } from "yup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router";
import { Label } from "@mui/icons-material";

const farmProfileSchema = object({
  status: string().required("status is required"),
  animalTagNameImage: string().required(
    "A valid animalTagNameImage is required",
  ),
  vetenaryHealthReport: string().required("vetenaryHealthReport is required"),
});

export function AnimalInspection() {
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
        navigate("/onboarding/register-animal");
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
        <Label>Upload: </Label>
        <TextField
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
          : null}

        <TextField
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
          : null}

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
