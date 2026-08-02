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

const farmProfileSchema = object({
  farmName: string().required("Farm name is required"),
  streetAddress: string()
    .required("A valid street address is required")
    .min(3, "Enter a vaild address"),
  province: string().required("Province selection is required"),
  city: string().required("City field is required"),
  postalCode: number().required("Postal code is required"),
  farmType: string().required("Farm type selection is required"),
});

export function FarmProfile({ provinces, farmTypes, active, setActiveStep }) {
  const navigate = useNavigate();
  const { values, handleChange, handleBlur, handleSubmit, touched, errors } =
    useFormik({
      initialValues: {
        farmName: "",
        streetAddress: "",
        province: "",
        postalCode: "",
        farmType: "",
        city: "",
      },
      validationSchema: farmProfileSchema,
      onSubmit: (data) => {
        console.log(data);
        // navigate("/onboarding/register-animal");
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
    <>
      <div className="form-container">
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "100%" } }}
          autoComplete="off"
          onSubmit={handleSubmit}
          className="onboarding-card"
        >
          {/* <img
          src="src/assets/icons/farm_profile.png"
          alt="profile-picture"
          className="farm-profile-pic"
        /> */}
          <h2>Farm Profile</h2>
          <TextField
            label="Farm Name"
            name="farmName"
            variant="filled"
            onChange={handleChange}
            value={values.farmName}
            onBlur={handleBlur}
            type="text"
          />
          {touched.farmName && errors.farmName ? errors.farmName : null}

          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Farm Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={values.farmType}
              name="farmType"
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <MenuItem value="">
                <em aria-disabled={true}>--Select Farmer Type--</em>
              </MenuItem>
              {farmTypes.map((type, index) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {touched.farmType && errors.farmType ? errors.farmType : null}

          <TextField
            fullWidth
            label="Street Address"
            name="streetAddress"
            variant="filled"
            onChange={handleChange}
            value={values.streetAddress}
            onBlur={handleBlur}
            type="text"
          />

          {touched.streetAddress && errors.streetAddress
            ? errors.streetAddress
            : null}
          <TextField
            label="city"
            name="city"
            variant="filled"
            onChange={handleChange}
            value={values.city}
            onBlur={handleBlur}
            type="text"
          />
          {touched.city && errors.city ? errors.city : null}

          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Province
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={values.province}
              name="province"
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <MenuItem value="">
                <em aria-disabled={true}>--Select Province--</em>
              </MenuItem>
              {provinces.map((province, index) => (
                <MenuItem key={index} value={province}>
                  {province}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {touched.province && errors.province ? errors.province : null}

          <TextField
            label="Postal Code"
            name="postalCode"
            variant="filled"
            onChange={handleChange}
            value={values.postalCode}
            onBlur={handleBlur}
            type="number"
          />
          {touched.postalCode && errors.postalCode ? errors.postalCode : null}
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            style={{ width: "50%" }}
          >
            Create Profile
          </Button>
        </Box>
      </div>
    </>
  );
}
