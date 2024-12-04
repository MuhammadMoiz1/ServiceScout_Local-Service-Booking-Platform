import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  styled,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const Field = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "13px",
    "&.Mui-focused fieldset": {
      borderColor: "#2196F3",
    },
    "& .MuiInputBase-input": {
      padding: "9.5px 12px",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.9rem",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#2196F3",
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: "13px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#2196F3",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#1976D2",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#1976D2",
  },
}));
const karachiTowns = [
  { id: 1, name: "Korangi" },
  { id: 2, name: "Gulshan-e-Iqbal" },
  { id: 3, name: "Saddar" },
  { id: 4, name: "Karachi Saddar" },
  { id: 5, name: "Lyari" },
  { id: 6, name: "Korangi" },
  { id: 7, name: "Kemari" },
  { id: 8, name: "Malir" },
  { id: 9, name: "Bahria Town" },
  { id: 10, name: "Faisal Colony" },
];

function VendorSignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    cnic: "",
    password: "",
    confirmPassword: "",
    area: "",
    services: [], // Selected services
  });
  const [servicesList, setServicesList] = useState([]); // Fetched services
  const [errors, setErrors] = useState({});
  const [open, setOpen] = React.useState(false);
  const [errmessage, setErrmessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  React.useEffect(() => {
    // Fetch services on component mount
    axios
      .get("http://localhost:5150/api/VendorServices")
      .then((response) => setServicesList(response.data))
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.contact.trim() || !/^\d{10,15}$/.test(formData.contact))
      newErrors.contact = "Contact number must be 10-15 digits";
    if (!formData.cnic.trim() || !/^\d{13}$/.test(formData.cnic))
      newErrors.cnic = "CNIC must be exactly 13 digits";
    if (!formData.password.trim() || formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServicesChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      services: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      name: formData.name,
      area: formData.area,
      cnicNumber: formData.cnic,
      email: formData.email,
      password: formData.password,
      contactInfo: formData.contact,
      serviceIds: formData.services, // Send selected service IDs
    };

    try {
      const response = await axios.post(
        "http://localhost:5150/api/Auth/signup-vendor",
        data
      );
      console.log("Response:", response.data);
      navigate("/vendorlogin", {
        state: {
          successMessage: "Account created successfully! Please log in.",
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error.response || error.message);
      setErrmessage(error.response?.data || "Something went wrong!");
      setOpen(true);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 450,
        mx: "auto",
        mt: 5,
        px: 4,
        pb: 4,
        pt: 3,
        borderRadius: 3,
        backgroundColor: "white",
        minHeight: "80vh",
      }}
    >
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errmessage}
        </Alert>
      </Snackbar>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: "90px",
            marginBottom: "20px",
          }}
        />
      </div>
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ color: "#2196F3", fontWeight: 700 }}
      >
        Vendor Sign Up
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Field
          label="Full Name"
          name="name"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          required
        />
        <Field
          label="Email"
          name="email"
          type="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          required
        />
        <Field
          label="Contact Number"
          name="contact"
          type="tel"
          fullWidth
          value={formData.contact}
          onChange={handleChange}
          error={!!errors.contact}
          helperText={errors.contact}
          required
        />
        <Field
          label="CNIC Number"
          name="cnic"
          fullWidth
          value={formData.cnic}
          onChange={handleChange}
          error={!!errors.cnic}
          helperText={errors.cnic}
          required
        />
        <FormControl fullWidth>
          <InputLabel id="services-label">Select Services</InputLabel>
          <StyledSelect
            labelId="services-label"
            multiple
            value={formData.services}
            onChange={handleServicesChange}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={
                      servicesList.find((service) => service.id === value)
                        ?.serviceName || value
                    }
                  />
                ))}
              </Box>
            )}
          >
            {servicesList.map((service) => (
              <MenuItem key={service.id} value={service.id}>
                {service.serviceName}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
        <Field
          select
          label="Area"
          name="area"
          fullWidth
          value={formData.area}
          onChange={handleChange}
          error={!!errors.area}
          helperText={errors.area}
          variant="outlined"
          required
        >
          {karachiTowns.map((town) => (
            <MenuItem key={town.id} value={town.name}>
              {town.name}
            </MenuItem>
          ))}
        </Field>
        <Field
          label="Password"
          name="password"
          type="password"
          fullWidth
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          required
        />
        <Field
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          fullWidth
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          required
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            borderRadius: "12px",
            backgroundColor: "#2196F3",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Sign Up
        </Button>
      </Box>
    </Paper>
  );
}

export default VendorSignUp;
