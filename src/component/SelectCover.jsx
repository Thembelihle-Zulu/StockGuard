import { Label } from "@mui/icons-material";
import DoneIcon from "@mui/icons-material/Done";
import SendIcon from "@mui/icons-material/Send";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { object, string } from "yup";
import Typography from "@mui/material/Typography";
const farmProfileSchema = object({
  status: string().required("status is required"),
  animalTagNameImage: string().required(
    "A valid animalTagNameImage is required",
  ),
  vetenaryHealthReport: string().required("vetenaryHealthReport is required"),
});

export function SelectCover() {
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
        <h2>Select Health Cover</h2>

        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Livestock Health Cover"
          />
        </FormGroup>

        <Typography>Includes: </Typography>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <DoneIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Illness treatment" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <DoneIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Injury Treatment" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <DoneIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Mortality cover" />
          </ListItem>
        </List>

        <div className="premium-box">
          <p>Monthly Premuim</p>
          <h2>R250</h2>
        </div>
        <div className="premium-box waiting-period">
          <p>Waiting period</p>
          <h2>14 Days</h2>
        </div>
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
