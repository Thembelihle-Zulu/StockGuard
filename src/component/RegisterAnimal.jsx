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

const farmProfileSchema = object({
  tagNumber: string().required("Farm name is required"),
  species: string()
    .required("A valid street address is required")
    .min(3, "Enter a vaild address"),
  breed: string().required("Province selection is required"),
  image: string().required("City field is required"),
  age: number().required("Postal code is required"),
  estimatedValue: number().required("estimatedValue selection is required"),
});

export function RegisterAnimal({ animalType }) {
  const { values, handleChange, handleBlur, handleSubmit, touched, errors } =
    useFormik({
      initialValues: {
        tagNumber: "",
        species: "",
        breed: "",
        estimatedValue: "",
        age: "",
        image: "",
      },
      validationSchema: farmProfileSchema,
      onSubmit: (data) => {
        console.log(data);

        fetch("https://6a6284d51bffb2ffab8b5373.mockapi.io/farm_profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Something went wrong");
            }

            return res.json();
          })
          .then((savedProfile) => {
            console.log(savedProfile);
          })
          .catch((err) => {
            console.error(err);
          });
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
        <h2>Register First Animal</h2>
        <TextField
          label="Animal Tag Number"
          name="tagNumber"
          variant="filled"
          onChange={handleChange}
          value={values.tagNumber}
          onBlur={handleBlur}
          type="text"
        />
        {touched.tagNumber && errors.tagNumber ? errors.targetNumber : null}

        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">
            Species
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={values.species}
            name="species"
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <MenuItem value="">
              <em aria-disabled={true}>--Select Animal Type--</em>
            </MenuItem>
            {animalType.map((type, index) => (
              <MenuItem key={index} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {touched.species && errors.species ? errors.species : null}

        <TextField
          fullWidth
          label="breed"
          name="breed"
          variant="filled"
          onChange={handleChange}
          value={values.breed}
          onBlur={handleBlur}
          type="text"
        />

        {touched.breed && errors.breed ? errors.breed : null}
        <TextField
          label="estimatedValue"
          name="estimatedValue"
          variant="filled"
          onChange={handleChange}
          value={values.estimatedValue}
          onBlur={handleBlur}
          type="text"
        />
        {touched.estimatedValue && errors.estimatedValue
          ? errors.estimatedValue
          : null}

        <TextField
          label="age"
          name="age"
          variant="filled"
          onChange={handleChange}
          value={values.age}
          onBlur={handleBlur}
          type="number"
        />
        {touched.age && errors.age ? errors.age : null}
        <TextField
          label="status"
          name="status"
          variant="filled"
          onChange={handleChange}
          value={values.status}
          onBlur={handleBlur}
          type="text"
        />
        {touched.status && errors.status ? errors.status : null}

        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          style={{ width: "50%" }}
        >
          Register Animal
        </Button>
      </Box>
    </div>
  );
}
