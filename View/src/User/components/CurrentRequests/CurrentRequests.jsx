import React, { useEffect, useState } from 'react';
import {Paper,Stack,Card,CardContent,Typography,Divider,Grid2,Button,CardActionArea,CardMedia} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ResponserCard from '../ResponseCard/ResponserCard';
import api from '../../../apiRequests';
// import 
import axios from 'axios';

const PopOut= (props)=>{
  const [responsersIds,setResponserIds]=useState(null);
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await api.get(`ServiceVendors/responsers/${props.id}`);
        setResponserIds(response.data);
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };
  
    fetchData();


  },[])

  const handleClose = () => {
    props.setOpen(false);
  };
  return(
    <React.Fragment>
      <Dialog
        open={props.open}
        onClose={handleClose}
        scroll='paper'
        aria-labelledby="scroll-dialog-title"
        
      >
        <DialogTitle id="scroll-dialog-title">Responses</DialogTitle>
        <DialogContent dividers={scroll === 'paper'} sx={{
          minWidth:'45vw',
          minHeight:'50vh',
        }}>
          {
          responsersIds && responsersIds.length > 0 ? (
         responsersIds.map((responser) => (
         <ResponserCard key={responser.id} id={responser.id} requestId={props.id}/>
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


const Customcard = (props)=>{
  
  const [open, setOpen] = React.useState(false);
  const [datetime, setDatetime] = useState("");
  const [amount,setAmount]=useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  
  
  const [RequestData,setRequestData]=useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/ServiceRequests/${props.id}`);
        const dateString=response.data?.serviceRequest.requestedTime;
        const [datePart, timePart] = dateString.split("T");

        let [hours, minutes] = timePart.slice(0, 5).split(":"); // Extract hours and minutes
        let period = "AM";
        hours = parseInt(hours, 10); // Convert hours to a number
        if (hours >= 12) {
          period = "PM";
          if (hours > 12) hours -= 12; // Convert 13+ hours to 12-hour format
        } else if (hours === 0) {
           hours = 12; // Handle midnight
          }
          setDatetime(`${datePart} ${hours}:${minutes} ${period}`);
        setRequestData(response.data.serviceRequest); 
        setAmount(response.data.amount);
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };
  
    fetchData();
  }, []);
  

    return(
    <>
      <Card key={props.id} sx={{ minWidth: "85%",maxWidth: "85%",margin: "auto",marginTop:'20px', boxShadow: 3, borderRadius: 2 }}>
        <CardActionArea
        onClick={handleClickOpen}
        >
        <CardContent sx={{
            cursor:'pointer'
        }}
        >
            
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: "550",
              color: "#2196f3",
              mb: 2,
              textAlign: "center",
            }}
          >
            {RequestData?.description}
          </Typography>
  
          <Divider sx={{ mb: 2 }} />
  
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#555" }}
              >
                Time:
              </Typography>
              <Typography variant="body1" color="text.primary">
                {
                  datetime
                }
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
               <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#555" }}
              >
                Price:
              </Typography>
              <Typography variant="body1" color="text.primary">
                {RequestData?.price}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#555" }}
              >
                Responses:
              </Typography>
              <Typography variant="body1" color="text.primary">
                {amount}
              </Typography>
            </Grid2>
  
           </Grid2>
        </CardContent>
        </CardActionArea>
      </Card> 

      <PopOut open={open} setOpen={setOpen} id={props.id}/>


    </>
    
    
  )
};

const CurrentRequests = () => {
  const [RequestIDs,setRequestIDs]=useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/ServiceRequests/userCurrent");
        setRequestIDs(response.data); 
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };
  
    fetchData(); // Call the async function
  }, []);
  return (
    <div>
      
      <Paper 
      elevation={3}
      square={false}
      sx={{
        width:'95%',
        margin:'auto',
        marginTop:'30px',
        height:'70vh',
        overflowY:'auto',
        paddingBottom:'10px',
        backgroundColor:'#f55f4828'
      }}
      >
     <Stack>
      {
        RequestIDs&&RequestIDs.length > 0 ? (RequestIDs.map((requestId)=>(
          <Customcard id={requestId.id}/> 
        )
         )
     ):(
      
      <div style={{display:"flex",alignItems:'center',justifyContent:'center',paddingTop:'10px'}}>
      <Typography variant="h6" sx={{ marginBottom: "10px", color: "#555" }}>
        No Current Request.
      
      <Button
        onClick={() => (window.location.href = "/user/newRequest")}
        variant='outlined'
        sx={{
          border:0
        }}
      >
        Request a Service Now!
      </Button>
      </Typography>
      </div>
     )}
      </Stack>
    
      </Paper>
    
      
  
    </div>
  );
};

export default CurrentRequests;





