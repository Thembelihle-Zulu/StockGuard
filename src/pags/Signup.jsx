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

const API_BASE = "http://127.0.0.1:5000/api";

const userSchema = object({
  firstName: string().required("first name is required"),
  lastName: string().required("last name is required"),
  email: string().email("must be a valid email").required("email is required"),
  cellphone: string().required("cellphone field is required"),
  password: password().required("password is required"),
});

export function Signup({ signUp, setActiveStep }) {
  // const [submitting, setSubmitting] = useState(false);
  // const [submitError, setSubmitError] = useState(null);
  // const { values, handleChange, handleBlur, handleSubmit, touched, errors } =
  //   useFormik({
  //     initialValues: {
  //       firstName: "",
  //       lastName: "",
  //       email: "",
  //       cellphone: "",
  //       password: "",
  //     },
  //     validationSchema: userSchema,
  //     onSubmit: async (data) => {
  //       setSubmitting(true);
  //       setSubmitError(null);
  //       try {
  //         const res = await fetch(`${API_BASE}/user`, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             first_name: data.firstName,
  //             last_name: data.lastName,
  //             email: data.email,
  //             cellphone: data.cellphone,
  //           }),
  //         });
  //         if (!res.ok) throw new Error("Failed to save user");
  //         const user = await res.json();
  //         console.log("User saved:", user);
  //         signUp(user);
  //         setActiveStep((prev) => prev + 1);
  //       } catch (err) {
  //         console.error(err);
  //         setSubmitError(
  //           err.message || "Something went wrong. Please try again.",
  //         );
  //       } finally {
  //         setSubmitting(false);
  //       }
  //     },
  //   });
  // const fieldSx = {
  //   "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
  //     borderColor: "oklch(0.32 0.1 154.55)",
  //   },
  //   "& .MuiInputLabel-root.Mui-focused": {
  //     color: "oklch(0.32 0.1 154.55)",
  //   },
  // };
  // return (
  //   <Box
  //     sx={{
  //       display: "flex",
  //       justifyContent: "center",
  //       py: { xs: 4, md: 6 },
  //       px: 2,
  //     }}
  //   >
  //     <Paper
  //       elevation={0}
  //       component="form"
  //       onSubmit={handleSubmit}
  //       autoComplete="off"
  //       sx={{
  //         width: "100%",
  //         maxWidth: 560,
  //         borderRadius: 4,
  //         p: { xs: 3, md: 5 },
  //         border: "1px solid oklch(0.9 0.02 154.55)",
  //         "& .MuiTextField-root": { width: "100%" },
  //       }}
  //     >
  //       <Typography
  //         component="h2"
  //         sx={{
  //           fontFamily: '"Playfair Display", Georgia, serif',
  //           fontSize: "1.75rem",
  //           fontWeight: 700,
  //           color: "oklch(0.2 0.03 154.55)",
  //           mb: 3,
  //         }}
  //       >
  //         Your Details
  //       </Typography>
  //       <Stack spacing={2.5}>
  //         <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
  //           <Box sx={{ flex: 1 }}>
  //             <TextField
  //               label="First Name"
  //               name="firstName"
  //               variant="outlined"
  //               onChange={handleChange}
  //               value={values.firstName}
  //               onBlur={handleBlur}
  //               type="text"
  //               sx={fieldSx}
  //             />
  //             {touched.firstName && errors.firstName ? (
  //               <Typography color="error" variant="caption" display="block">
  //                 {errors.firstName}
  //               </Typography>
  //             ) : null}
  //           </Box>
  //           <Box sx={{ flex: 1 }}>
  //             <TextField
  //               label="Last Name"
  //               name="lastName"
  //               variant="outlined"
  //               onChange={handleChange}
  //               value={values.lastName}
  //               onBlur={handleBlur}
  //               type="text"
  //               sx={fieldSx}
  //             />
  //             {touched.lastName && errors.lastName ? (
  //               <Typography color="error" variant="caption" display="block">
  //                 {errors.lastName}
  //               </Typography>
  //             ) : null}
  //           </Box>
  //         </Stack>
  //         <Box>
  //           <TextField
  //             label="Email"
  //             name="email"
  //             variant="outlined"
  //             onChange={handleChange}
  //             value={values.email}
  //             onBlur={handleBlur}
  //             type="email"
  //             sx={fieldSx}
  //           />
  //           {touched.email && errors.email ? (
  //             <Typography color="error" variant="caption" display="block">
  //               {errors.email}
  //             </Typography>
  //           ) : null}
  //         </Box>
  //         <Box>
  //           <TextField
  //             label="Cellphone"
  //             name="cellphone"
  //             variant="outlined"
  //             onChange={handleChange}
  //             value={values.cellphone}
  //             onBlur={handleBlur}
  //             type="tel"
  //             sx={fieldSx}
  //           />
  //           {touched.cellphone && errors.cellphone ? (
  //             <Typography color="error" variant="caption" display="block">
  //               {errors.cellphone}
  //             </Typography>
  //           ) : null}
  //         </Box>
  //         <Box>
  //           <TextField
  //             label="Password"
  //             name="password"
  //             variant="outlined"
  //             onChange={handleChange}
  //             value={values.password}
  //             onBlur={handleBlur}
  //             type="password"
  //             sx={fieldSx}
  //           />
  //           {touched.password && errors.password ? (
  //             <Typography color="error" variant="caption" display="block">
  //               {errors.password}
  //             </Typography>
  //           ) : null}
  //         </Box>
  //         {submitError && (
  //           <Typography color="error" sx={{ mt: 1 }}>
  //             {submitError}
  //           </Typography>
  //         )}
  //         <Button
  //           type="submit"
  //           variant="contained"
  //           endIcon={<SendIcon />}
  //           disabled={submitting}
  //           sx={{
  //             alignSelf: "center",
  //             width: { xs: "100%", sm: "60%" },
  //             mt: 1,
  //             bgcolor: "oklch(0.32 0.1 154.55)",
  //             color: "white",
  //             borderRadius: "2rem",
  //             py: "0.75rem",
  //             fontWeight: 600,
  //             textTransform: "none",
  //             boxShadow: "none",
  //             "&:hover": {
  //               bgcolor: "oklch(0.27 0.1 154.55)",
  //               boxShadow: "none",
  //             },
  //             "&.Mui-disabled": {
  //               bgcolor: "oklch(0.9 0.02 154.55)",
  //               color: "oklch(0.6 0.02 154.55)",
  //             },
  //           }}
  //         >
  //           {submitting ? "Saving..." : "Continue"}
  //         </Button>
  //       </Stack>
  //     </Paper>
  //   </Box>
  // );
}
