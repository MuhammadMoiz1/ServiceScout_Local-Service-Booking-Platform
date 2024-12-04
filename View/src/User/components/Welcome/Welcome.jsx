import React from 'react';
import image from '../../../assets/userWelcome.jpg';
import { Typography,Button } from '@mui/material';
import './Welcome.css'

const Welcome = () => {
  return (
    <div className='main'>
      <div className='left'>
      <Typography variant="h3" gutterBottom sx={{marginBottom:'20px'}} >
      Making Home Services Effortless!
      </Typography>
      <Typography variant="body1" gutterBottom sx={{marginBottom:'30px'}}>
      From small repairs to big transformations, find top-rated service providers to meet your needs. 
      No more guesswork—just qualified professionals who deliver exceptional results. 
      Whatever the job, we’re here to help you every step of the way.
      </Typography>
      <Button
      className='cta'
      variant='outlined'
      onClick={() => (window.location.href = "/user/newRequest")}
      >
      Request a Service Now!
      </Button>
      
      </div>
      <div className='right'>
      <img src={image} alt="Service Providers" />
      </div>
    </div>
  )
}

export default Welcome;
