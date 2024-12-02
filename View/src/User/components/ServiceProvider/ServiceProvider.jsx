import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import { Chip } from '@mui/material';

export default function ServiceProvider() {
  const theme = useTheme();

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
            Muhammad Moiz
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
                4.5 <StarIcon sx={{fontSize:'16px',color:'#FFD700'}}/>
              </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center',gap:'2',ml:'5px' }}>
        <Chip
                  label={'Programmer'}
                  sx={{
                    margin: "0 5px",
                    fontWeight: 500,
                    textTransform: 'none',
                    backgroundColor:'#2195f363',
                  }}
                />
        <Chip
                  label={'Ai Specialist'}
                  sx={{
                    margin: "0 5px",
                    fontWeight: 500,
                    textTransform: 'none',
                    backgroundColor:'#2195f363',
                  }}
                />        
        </Box>
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
