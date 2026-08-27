import { useState } from "react";
import {
  TextField,
  Typography,
  Stack,
  Paper,
  Box,
  Button,
} from "@mui/material";
import { useFormik } from "formik";
import { object, string } from "yup";
import SendIcon from "@mui/icons-material/Send";
import "../styles/auth.css";
import { useNavigate } from "react-router";
const API_BASE = "http://127.0.0.1:5000/api";

// Password rule: at least 8 characters, containing at least one letter
// and one number. Not a spec you gave me — a reasonable common default,
// called out here specifically so it's easy to find and change.
const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).+$/;

const userSchema = object({
  fullname: string().required("Full name is required"),
  email: string().email("Must be a valid email").required("Email is required"),
  cellphone: string().required("Cellphone is required"),
  password: string()
    .min(8, "Password must be at least 8 characters")
    .matches(PASSWORD_RULE, "Password must contain a letter and a number")
    .required("Password is required"),
});

export function Signup() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();
  const { values, handleChange, handleBlur, handleSubmit, touched, errors } =
    useFormik({
      initialValues: {
        fullname: "",
        email: "",
        cellphone: "",
        password: "",
      },
      validationSchema: userSchema,
      onSubmit: async (data) => {
        setSubmitting(true);
        setSubmitError(null);

        // Route matches @users_bp.post("/signup") — not /user.
        fetch(`${API_BASE}/users/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullname: data.fullname,
            email: data.email,
            contact_number: data.cellphone,
            password: data.password,
          }),
        })
          .then((res) =>
            res?.ok ? res.json() : Promise.reject("Something went wrong"),
          )
          .then((data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            navigate("/onboarding");
          })
          .catch((error) =>
            setSubmitError(
              error.message || "Something went wrong. Please try again.",
            ),
          )
          .finally(() => {
            setSubmitting(false);
          });
      },
    });

  return (
    <Box className="signup-page">
      <Paper
        elevation={0}
        component="form"
        onSubmit={handleSubmit}
        autoComplete="off"
        className="signup-paper"
      >
        <Typography component="h2" className="signup-heading">
          Your Details
        </Typography>

        <Stack className="signup-stack">
          <Box>
            <TextField
              fullWidth
              label="Full Name"
              name="fullname"
              variant="outlined"
              onChange={handleChange}
              value={values.fullname}
              onBlur={handleBlur}
              type="text"
              className="signup-field"
            />
            {touched.fullname && errors.fullname ? (
              <Typography variant="caption" className="signup-error">
                {errors.fullname}
              </Typography>
            ) : null}
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              onChange={handleChange}
              value={values.email}
              onBlur={handleBlur}
              type="email"
              className="signup-field"
            />
            {touched.email && errors.email ? (
              <Typography variant="caption" className="signup-error">
                {errors.email}
              </Typography>
            ) : null}
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Cellphone"
              name="cellphone"
              variant="outlined"
              onChange={handleChange}
              value={values.cellphone}
              onBlur={handleBlur}
              type="tel"
              className="signup-field"
            />
            {touched.cellphone && errors.cellphone ? (
              <Typography variant="caption" className="signup-error">
                {errors.cellphone}
              </Typography>
            ) : null}
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Password"
              name="password"
              variant="outlined"
              onChange={handleChange}
              value={values.password}
              onBlur={handleBlur}
              type="password"
              className="signup-field"
            />
            {touched.password && errors.password ? (
              <Typography variant="caption" className="signup-error">
                {errors.password}
              </Typography>
            ) : null}
          </Box>

          {submitError && (
            <Typography
              variant="body2"
              className="signup-error signup-submit-error"
            >
              {submitError}
            </Typography>
          )}

          <Button
            type="submit"
            endIcon={<SendIcon />}
            disabled={submitting}
            className="signup-submit-btn"
          >
            {submitting ? "Signing up..." : "Continue"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
