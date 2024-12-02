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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../../apiRequests";

const ServiceRequestForm = () => {
  const [open, setOpen] = React.useState(false);
  const [errmessage, setErrmessage] = useState("");
  const navigate = useNavigate();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const [formData, setFormData] = useState({
    userId: "",
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

    try {
      const response = await api.post("/ServiceRequests", formData);
      console.log("Service Request Created:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Error creating service request:", error);
      setErrmessage(error.message);
      setOpen(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
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
      <Paper
        elevation={3}
        sx={{ padding: "30px", maxWidth: "600px", width: "100%" }}
      >
        <Typography
          variant="h5"
          sx={{ marginBottom: "20px", textAlign: "center" }}
        >
          Create Service Request
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User ID"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Service ID"
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                variant="outlined"
              />
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requested Time"
                name="requestedTime"
                type="datetime-local"
                value={formData.requestedTime}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true, // Ensures the label doesn't overlap the value
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ServiceRequestForm;
