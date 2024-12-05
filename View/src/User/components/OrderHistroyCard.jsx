import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box, Divider } from "@mui/material";
import api from "../../apiRequests";

const ServiceOrderCard = (props) => {
  const [serviceOrder, setServiceOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.get(`/ServiceOrders/userOrderHistory/${props.id}`);
      setServiceOrder(data.data); // Assuming data is returned as a single order
      console.log(data);
    };

    fetchData();
  }, []);

  if (!serviceOrder) return <div>Loading...</div>;

  return (
    <Card
      sx={{
        maxWidth: 450,
        margin: "20px auto",
        borderRadius: 3,
        boxShadow: 5,
        backgroundColor: "#f9f9f9",
        overflow: "hidden",
        transition: "0.3s",
        "&:hover": { boxShadow: 8 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          padding: "16px",
          backgroundColor: "#f56048",
          color: "#fff",
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        Order Details
      </Box>

      <CardContent sx={{ padding: "20px" }}>
        {/* Order Details */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#333",
                marginBottom: "8px",
              }}
            >
              {serviceOrder.description}
            </Typography>
          </Grid>

          <Divider sx={{ width: "100%", marginY: 1.5 }} />

          <Grid item xs={6}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#555" }}
            >
              Requested On:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {new Date(serviceOrder.requestedOn).toLocaleDateString()}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#555" }}
            >
              Amount:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ${serviceOrder.amount}
            </Typography>
          </Grid>

          <Divider sx={{ width: "100%", marginY: 1.5 }} />

          <Grid item xs={12}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#555" }}
            >
              Vendor:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {serviceOrder.vendorName} ({serviceOrder.vendorContactInfo})
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ServiceOrderCard;
