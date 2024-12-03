import React, { useState } from 'react'
import { Avatar, Paper,Typography,Button} from '@mui/material';
import api from '../../../apiRequests';
import './ResponserCard.css';

const ResponserCard = (props) => {
  const [vendor,setVendor]=useState('');
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
        const response = await api.get(`ServiceVendors/${props.id}`);
        setVendor(response.data);
        
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };
  
    fetchNegotiation(); 
    

  },[])
  return (
    <>
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
            <Typography variant='body1' sx={{fontWeight:550,textAlign:'center'}}>300</Typography>
          </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-around',marginTop:'20px',marginBottom:'20px'}}>
        <Button variant="contained" color='success' sx={{padding: '3px 15px',borderRadius:'50px'}}>Accept</Button>
        <Button variant="contained" color='error' sx={{padding: '3px 15px',borderRadius:'50px'}}>Reject</Button>
      </div>
      <div></div>
      <div></div>
    </Paper>  )}
    </>
  )
}

export default ResponserCard;
