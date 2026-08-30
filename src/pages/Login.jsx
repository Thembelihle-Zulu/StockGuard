import { useState } from "react";
import { useFormik } from "formik";
import { object, string } from "yup";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { NavLink, useNavigate } from "react-router";
import "../styles/auth.css";
const loginSchema = object({
  email: string().email("Enter a valid email").required("Email is required"),
  password: string().required("Password is required"),
});

const API_URL = "http://127.0.0.1:5000/api";

export function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const { values, handleChange, handleBlur, handleSubmit, touched, errors } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: loginSchema,
      onSubmit: async (data) => {
        setLoading(true);
        setError("");

        try {
          const res = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          });

          const body = await res.json().catch(() => ({}));

          if (!res.ok) {
            throw new Error(body.error || "Invalid email or password");
          }

          localStorage.setItem("token", body.token);
          localStorage.setItem("role", body.role);
          body.role == "USER" ? navigate("/dashboard") : navigate("/admin");
        } catch (err) {
          console.error(err);
          setError(err.message || "Something went wrong. Please try again.");
        } finally {
          setLoading(false);
        }
      },
    });

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && (
        <Alert severity="error" className="login-alert">
          {error}
        </Alert>
      )}

      <TextField
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        name="email"
        placeholder="you@example.com"
        variant="outlined"
        label="Email"
        type="email"
        className="login-field"
        error={touched.email && Boolean(errors.email)}
        helperText={touched.email && errors.email ? errors.email : null}
      />

      <TextField
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        name="password"
        placeholder="Password"
        variant="outlined"
        label="Password"
        className="login-field"
        error={touched.password && Boolean(errors.password)}
        helperText={
          touched.password && errors.password ? errors.password : null
        }
      />

      <p className="login-signup-prompt">
        Don't have an account?{" "}
        <NavLink to="/signup" className="login-signup-link">
          Sign up
        </NavLink>
      </p>

      <Button
        variant="contained"
        type="submit"
        disabled={loading}
        className="login-submit-btn"
        startIcon={
          loading ? <CircularProgress size={16} color="inherit" /> : null
        }
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
