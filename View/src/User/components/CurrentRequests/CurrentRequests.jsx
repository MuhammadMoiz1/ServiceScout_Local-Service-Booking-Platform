import React from 'react';
import {Paper,Stack,Card,CardContent,Typography,Divider,Grid2,Button,CardActionArea,Grid,CardMedia} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const Customcard = ()=>{
  
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  

    return(
    <>
      <Card sx={{ minWidth: "85%",maxWidth: "85%",margin: "auto",marginTop:'20px', boxShadow: 3, borderRadius: 2 }}>
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
          minWidth:'40vw',
          minHeight:'50vh',
        }}>
          
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
     <Customcard /> 
     <Customcard />
      </Stack>
      </Paper>

      
  
    </div>
  )
}

export default CurrentRequests;





