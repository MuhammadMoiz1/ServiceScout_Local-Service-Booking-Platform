import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import { Button, Chip } from '@mui/material';
import api from '../../../apiRequests';
import {  useNavigate } from 'react-router-dom';

export default function ServiceProvider(props) {
  const theme = useTheme();
  const Navigate=useNavigate();
  const [services,setServices]=React.useState([]);
  React.useEffect(()=>{
    const fetchServices=async ()=>{
       try{
            const res= await api.get(`/ServiceProviderServiceLinks/${props.data.id}`)
            setServices(res.data)

       }
       catch(err){
        console.log(err)
       }
    }
    fetchServices();
  },[])
  const [data,setData]=React.useState(props.data);
  const handleclick= ()=>{
    Navigate('/user/newRequest',{ state: { id: props.data.id } })
    
  }



  return (
    <Card className='main-SP-card' sx={{ 
        display: "flex",
        justifyContent: "space-between",
        marginRight:'25px',
        marginLeft:'25px',
        alignItems: "center",
        minWidth: "30vw",
        padding: "10px", 
        boxShadow: 3,
        marginTop:'20px',
        marginBottom:'20px'
        }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {data.name}
          </Typography> 
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1,ml:'5px' }}>
             <Typography
                variant="subtitle1"
                sx={{ fontWeight: "600", color: "#555" ,marginRight:'5px'}}
              >
                Rating:
              </Typography>
              <Typography variant="body1" color="text.primary">
                {data.rating} <StarIcon sx={{fontSize:'18px',color:'#FFD700'}}/>
              </Typography> 
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1,ml:'5px' }}>
             <Typography
                variant="subtitle1"
                sx={{ fontWeight: "600", color: "#555" ,marginRight:'5px'}}
              >
                Services Provided:
              </Typography>
              <Typography variant="body1" color="text.primary">
                {data.totalOrders}
              </Typography> 
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center',gap:'2',ml:'5px',maxWidth:'50vw',flexWrap: 'wrap'}}>
           {
            services&&services.map((service)=>(
              <Chip
              label={service.serviceName}
              sx={{
                margin: "0 5px",
                fontWeight: 500,
                textTransform: 'none',
                backgroundColor:'#2195f363',
                marginTop:'1px'
              }}
            />
            
            )
            )
           }
     
        </Box>
        <Button variant='contained' sx={{backgroundColor:'#f56048',marginTop:'20px',marginLeft:'20px',padding: '3px 0px',width:'170px',borderRadius:'50px'}}
        onClick={handleclick}
        >
          Request Service
        </Button>
      </Box>
      <Box
      sx={{
        width: 120,
        height: 120,
        borderRadius: "50%", 
        overflow: "hidden", 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5", 
      }}
    >
      <img
        src="/image.png" 
        alt="Rounded"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "scale-down",
        }}
      />
    </Box>
    </Card>
  );
}
