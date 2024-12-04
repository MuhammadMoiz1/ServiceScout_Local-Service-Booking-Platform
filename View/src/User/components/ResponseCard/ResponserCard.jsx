import React, { useState } from 'react'
import { Avatar, Paper,Typography,Button,Snackbar,Alert} from '@mui/material';
import api from '../../../apiRequests';
import './ResponserCard.css';

const ResponserCard = (props) => {
  const [vendor,setVendor]=useState('');
  const [price,setPrice]=useState(0);
  const [open, setOpen] = React.useState(false);
  const [errmessage, setErrmessage] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  React.useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await api.get(`ServiceVendors/${props.id}`);
        setVendor(response.data);
        
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };
  
    fetchData();  
    const fetchNegotiation = async () => {
      try {
        const response = await api.get(`/PendingLogs/${props.id}/${props.requestId}`);
        setPrice(response.data.amount)
        
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };
  
    fetchNegotiation(); 
    

  },[])

   const onclickDelete=async ()=>{
    try{
      const response = await api.delete(`/PendingLogs/Request/${props.requestId}/Vendor/${props.id}/`);     
      setErrmessage('Responser Successfully Removed')
      setOpen(true)
    }
    catch(err){
        console.log(`erorr in deleting: ${err}`)
    }

   }
   const onclickAccept=async ()=>{
    
      try {
        const acceptResponse = await api.put("/ServiceRequests/accept", {
          Id: props.requestId,
          IsCompleted: true,
          Price: price,
        });
        console.log("Request accepted:", acceptResponse);
  
        const serviceOrderResponse = await api.post("/ServiceOrders", {
          RequestId: props.requestId,
          VendorId: props.id,
          Status: "Accepted",
        });
        console.log("Service order created:", serviceOrderResponse);
  
        const incrementResponse = await api.patch(
          `/ServiceOrders/${props.id}/IncrementOrders`
        );
        console.log("Vendor order count updated:", incrementResponse);
        
  
        const deleteResponse = await api.delete(
          `/PendingLogs/Request/${props.requestId}/Vendor/${props.id}`
        );
        console.log("Pending log deleted:", deleteResponse);
        setErrmessage('Successfully Accepted')
        setOpen(true)
      }catch(err){
      console.log(`erorr in accepting: ${err}`)
    }
    
   }


  return (
    <>
    <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity='success'
            variant="filled"
            sx={{ width: "100%" }}
          >
            {errmessage}
          </Alert>
        </Snackbar>
    {
      vendor&&(
    <Paper className='res-upper' elevation={6}>
      <div className='res-second'>
      <Avatar src='/image.png' variant="rounded" 
      sx={{
        height:70,
        width:70,
        margin:'5px',
      }}
      />
      <div style={{margin:'5px',marginLeft:'8px'}}>
          <Typography variant='body1' sx={{fontWeight:650,fontSize:'17px'}}>
            {vendor?.name}
          </Typography>          
          <Typography sx={{fontSize:'9.5px'}}
         variant='caption'>Programmer | Problem Solver</Typography><br/>
         
      </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-around',marginTop:'10px'}}>
          <div>
            <Typography variant='body2'>Ratings</Typography>
            <Typography variant='body1' sx={{fontWeight:550,textAlign:'center'}}>
              {vendor?.rating}
              </Typography>
          </div>
          <div>
            <Typography variant='body2'>Orders</Typography>
            <Typography variant='body1' sx={{fontWeight:550,textAlign:'center'}}>
              {vendor?.totalOrders}
              </Typography>
          </div>
          <div>
            <Typography variant='body2'>Price</Typography>
            <Typography variant='body1' sx={{fontWeight:550,textAlign:'center'}}>{price}</Typography>
          </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-around',marginTop:'20px',marginBottom:'20px'}}>
        <Button variant="contained" color='success' sx={{padding: '3px 15px',borderRadius:'50px'}} onClick={onclickAccept}>Accept</Button>
        <Button variant="contained" color='error' sx={{padding: '3px 15px',borderRadius:'50px'}} onClick={onclickDelete}>Reject</Button>
      </div>
      <div></div>
      <div></div>
    </Paper>  )}
    </>
  )
}

export default ResponserCard;
