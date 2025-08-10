import React, { useEffect, useState } from "react";
import { Grid, Box, Typography,Button } from "@mui/material";
import ServiceOrderCard from "../components/OrderHistroyCard";
import api from "../../apiRequests";
import Navbar from "../components/Navbar/Navbar";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import VendorRatingCard from "../components/RateVendor";

const PopOut= ()=>{
  const [open, setOpen] = React.useState(false);
  const [data,setData]=useState([]);
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await api.get(`/ServiceOrders/get-pending-ratings`);
        
        setData(response.data);

        console.log(response.data)
        if(response.data){
          setOpen(true);
        }

        
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };
  
    fetchData();


  },[])

  const handleClose = () => {
    setOpen(false);
  };
  return(
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll='paper'
        aria-labelledby="scroll-dialog-title"
        
      >
        <DialogTitle id="scroll-dialog-title">Responses</DialogTitle>
        <DialogContent dividers={scroll === 'paper'} sx={{
          minWidth: 500,
          minHeight:'50vh',
        }}>
          {
          data && data.length > 0 ? (
         data.map((d) => (
         <VendorRatingCard data={d}/>
         ))
      ) : (
        <Typography variant='subtitle1'>No Response Yet</Typography>
      )
     }
          
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>

  );


}



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
    <PopOut />
    </>
  );
};

export default ServiceOrderGrid;
