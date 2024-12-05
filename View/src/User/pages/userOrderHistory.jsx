import React, { useEffect, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import ServiceOrderCard from "../components/OrderHistroyCard";
import api from "../../apiRequests";
import Navbar from "../components/Navbar/Navbar";

const ServiceOrderGrid = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await api.get(`/ServiceOrders/userOrders`); // Fetch all orders
      setOrders(data.data); // Assuming the API returns an array of orders
      console.log(data.data);
    };

    fetchOrders();
  }, []);



  if (!orders || orders.length === 0)
    return (
      <>
      <Navbar/>
      <Typography
        variant="h6"
        align="center"
        color="textSecondary"
        sx={{ marginTop: "20px" }}
      >
        No Orders Found
      </Typography>
      </>
    );

  return (
    <>
    <Navbar/>
    <Box sx={{ padding: "20px" }}>
      <Grid container spacing={4}>
        {orders.map((order, index) => (
          <Grid
            item
            xs={12} // Full width on extra-small screens
            sm={6} // Half width on small screens (2 cards per row)
            md={6} // Half width on medium screens
            lg={6} // Half width on large screens
            key={index}
          >
            <ServiceOrderCard id={order} />
          </Grid>
        ))}
      </Grid>
    </Box>
    </>
  );
};

export default ServiceOrderGrid;
