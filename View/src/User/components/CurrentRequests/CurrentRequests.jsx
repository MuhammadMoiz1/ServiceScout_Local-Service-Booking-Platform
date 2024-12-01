import React from 'react';
import {Paper,Stack,Card,CardContent,Typography,Divider,Grid2} from '@mui/material';

const card = (
    <React.Fragment>
      
        <CardContent sx={{
            cursor:'pointer'
        }}>
            
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
            Kitchen Cabinets Repairing
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
                Dec 5, 2024, 10:00 AM
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
                $150
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
                15 responses
              </Typography>
            </Grid2>
  
           </Grid2>
        </CardContent>
    </React.Fragment>
  );

const CurrentRequests = () => {
  return (
    <div>
      
      <Paper 
      elevation={3}
      square={false}
      sx={{
        width:'95%',
        margin:'auto',
        height:'60vh',
        overflowY:'auto',
        paddingBottom:'10px'
      }}
      >
     <Stack>
     <Card sx={{ minWidth: "90%",maxWidth: "90%",margin: "auto",marginTop:'10px', boxShadow: 3, borderRadius: 2 }}>{card}</Card>  
     <Card sx={{ minWidth: "90%",maxWidth: "90%", margin: "auto",marginTop:'10px', boxShadow: 3, borderRadius: 2 }}>{card}</Card>
     <Card sx={{ minWidth: "90%",maxWidth: "90%", margin: "auto",marginTop:'10px', boxShadow: 3, borderRadius: 2 }}>{card}</Card>
     <Card sx={{ minWidth: "90%",maxWidth: "90%", margin: "auto",marginTop:'10px', boxShadow: 3, borderRadius: 2 }}>{card}</Card>
     </Stack>
      </Paper>
  
    </div>
  )
}

export default CurrentRequests;



