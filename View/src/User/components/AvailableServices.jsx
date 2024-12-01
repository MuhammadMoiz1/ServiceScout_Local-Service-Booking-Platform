import React from 'react'
import {Chip,Box,Tabs,Tab, Typography} from '@mui/material';


const AvailableServices=() => {
    const chipData = [
      "Plumbers",
      "Electricians",
      "Carpenters",
      "Painters",
      "Cleaning Services",
      "Pest Control",
      "Appliance Repair",
      "Gardening",
      "Roofers",
      "Movers",
      "Tutors",
      "Baby Sitters",
      "Home Security Installation",
      "HVAC Technicians",
      "Gutter Cleaning"
    ];
  
    return (
      <Box
        sx={{
          width: "100%",
          margin: "auto",
          mt: 2
        }}
      >
        <Tabs
          value={false}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent:"center",
          }}
        >
          {chipData.map((label, index) => (
            <Tab
              key={index}
              disabled
              label={
                <Chip
                  label={label}
                  sx={{
                    margin: "0 5px",
                    fontWeight: 500,
                    textTransform: 'none',
                    backgroundColor:'#f55f4876',
                  }}
                />
              }
              sx={{
                padding: 0, 
                minWidth: "auto"
              }}
            />
          ))}
        </Tabs>
      </Box>
    );
  };
  export default AvailableServices;