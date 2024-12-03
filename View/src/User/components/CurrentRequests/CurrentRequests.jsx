import React, { useEffect, useState } from 'react';
import {Paper,Stack,Card,CardContent,Typography,Divider,Grid2,Button,CardActionArea,CardMedia} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ResponserCard from '../ResponseCard/ResponserCard';
import api from '../../../apiRequests';
import axios from 'axios';

const Customcard = (props)=>{
  
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const [RequestData,setRequestData]=useState(null);
  useEffect(() => {
    console.log(localStorage.getItem('token'))
    const fetchData = async () => {
      try {
        const response = await api.get(`/ServiceRequests/${props.id}`);
        const dateObject = new Date(response.data?.requestedTime);
        if (!isNaN(dateObject)) {
          const options = { timeZone: "Asia/Karachi", hour12: true };
          setDate(dateObject.toLocaleDateString("en-US", options)); // Format as local date
          setTime(dateObject.toLocaleTimeString("en-US", options)); // Format as local time
        } else {
          console.error("Invalid Date format:", response.requestedTime);
        }
        setRequestData(response.data); 
        
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
                  date+" "+time
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
                15
              </Typography>
            </Grid2>
  
           </Grid2>
        </CardContent>
        </CardActionArea>
      </Card> 

      <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll='paper'
        aria-labelledby="scroll-dialog-title"
        
      >
        <DialogTitle id="scroll-dialog-title">Responses</DialogTitle>
        <DialogContent dividers={scroll === 'paper'} sx={{
          minWidth:'45vw',
          minHeight:'50vh',
        }}>
          <ResponserCard/>
          <ResponserCard/> 
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>


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
        RequestIDs&&RequestIDs.map((requestId)=>(
          <Customcard id={requestId.id}/> 
        )
         )
     }
      </Stack>
      </Paper>

      
  
    </div>
  )
}

export default CurrentRequests;





