import { useFormik } from "formik";
import { object, string, number, date } from "yup";
import { API_URL } from "../global";
import { Navigate, NavLink, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Signup } from "./Signup";

const loginSchema = object({
  username: string()
    .required("username is missing 🫨")
    .min(4, "username is too short 😅"),
  password: string().required().min(8).max(12),
});

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { values, handleChange, handleBlur, handleSubmit, touched, errors } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
      },
      validationSchema: loginSchema,
      onSubmit: (data) => {
        setLoading(true);
        fetch(`${API_URL}/auth/login`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) =>
            res.ok ? res.json() : Promise.reject("Access Denied"),
          )
          //   .then((data) => {
          //     localStorage.setItem("token", data.token);
          //     localStorage.setItem("role", data.role);
          //   })
          .then(() => navigate("/movies"))
          .catch((err) => setError(err))
          .finally(() => setLoading(false));
      },
    });

  // Safety mechanism
  //   useEffect(() => {
  //     localStorage.clear();
  //   }, []);

  // No refresh & Collect data
  return (
    <form onSubmit={handleSubmit} className="basic-form">
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        // Same as Input
        value={values.username} // 2
        onChange={handleChange}
        onBlur={handleBlur}
        name="username" // 3
        placeholder="John"
        // Change
        variant="outlined"
        label="Username"
        error={touched.username && errors.username}
        helperText={
          touched.username && errors.username ? errors.username : null
        }
      />
      <TextField
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        name="password"
        placeholder="password"
        variant="outlined"
        label="Password"
        error={touched.password && errors.password}
        helperText={
          touched.password && errors.password ? errors.password : null
        }
      />
      Don't have an account?{" "}
      <NavLink path="/signup" element={<Navigate replace to="/signup" />}>
        Signup
      </NavLink>
      <Button loading={loading} variant="contained" type="submit">
        Login
      </Button>
    </form>
  );
}
