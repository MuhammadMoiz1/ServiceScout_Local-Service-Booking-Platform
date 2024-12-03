import React, { useState } from "react";
import axios from "axios";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from '../../../apiRequests';
import Navbar from "../../components/Navbar/Navbar";

const ServiceRequestForm = () => {
  const [open, setOpen] = React.useState(false);
  const [errmessage, setErrmessage] = useState("");
  const [intense, setIntense] = useState("error");
  const services = [
    { value: "cleaning", label: "Home Cleaning" },
    { value: "plumbing", label: "Plumbing Services" },
    { value: "electrical", label: "Electrical Repair" },
    { value: "painting", label: "Painting" },
    { value: "gardening", label: "Gardening" },
  ];
  const navigate = useNavigate();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const [formData, setFormData] = useState({
    serviceId: "",
    description: "",
    area: "",
    price: "",
    requestedTime: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      serviceId: 1,
    }));
    try { 
      const response = await api.post("/ServiceRequests",formData);
      console.log("Service Request Created:", response.data);
      setErrmessage("Service created successfully");
      setIntense("success");
      setOpen(true);
    } catch (error) {
      console.error("Error creating service request:", error);
      setErrmessage(error.message);
      setIntense("error");
      setOpen(true);
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "90vh",
          backgroundColor: "#f0f2f5",
          padding: "20px",
        }}
      >
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={intense}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {errmessage}
          </Alert>
        </Snackbar>
        <Paper
          elevation={12}
          sx={{
            padding: "40px",
            maxWidth: "500px",
            width: "100%",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              marginBottom: "30px",
              textAlign: "center",
              fontWeight: 600,
              color: "#2c3e50",
              letterSpacing: "-0.5px",
            }}
          >
            Service Request
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Select Service"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                >
                  {services.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Requested Time"
                  name="requestedTime"
                  type="datetime-local"
                  value={formData.requestedTime}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    borderRadius: "12px",
                    padding: "12px",
                    backgroundColor: "#3498db",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 4px 15px rgba(52, 152, 219, 0.4)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#2980b9",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(52, 152, 219, 0.5)",
                    },
                  }}
                >
                  Submit Request
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default ServiceRequestForm;
