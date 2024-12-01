import React,{useRef} from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './MainPage.css'
import Welcome from '../../components/Welcome/Welcome';
import AvailableServices from '../../components/AvailableServices';
import CurrentRequests from '../../components/CurrentRequests/CurrentRequests';
import FavouriteSP from '../../components/Favourites/FavouriteSP';
import {Typography} from '@mui/material';
import TrendingSP from '../../components/Trending/TrendingSP';
import AllSP from '../../components/AllSP/AllSP';


const MainPage = () => {
  
  return (
    <div className='main-div'>
      <Navbar/>
      <Welcome/>
    <div>
      <Typography
        variant="h4"
        className='sections'
      >
        Available Service Providers
      </Typography>
        <AvailableServices/>
      </div>
      <div style={{marginTop:'40px'}}>
      <Typography
        variant="h4"
        className='sections'
        sx={{marginBottom:'10px'}}
      >
        Your current service requests
      </Typography>
      <CurrentRequests/>
      </div>
      <div style={{minHeight:'50vh',marginTop:'40px'}}>
      <Typography
        variant="h4"
        className='sections'
        sx={{marginBottom:'10px'}}
      >
        Favourite Service Providers
      </Typography>
      <FavouriteSP/>
      
      </div>
      <div style={{minHeight:'50vh'}}>
      <Typography
        variant="h4"
        className='sections'
        sx={{marginBottom:'10px'}}
      >
        Top Service Providers Near You
      </Typography>
      <TrendingSP/>
      </div>
      <div style={{minHeight:'50vh'}}>
      <Typography
        variant="h4"
        className='sections'
        sx={{marginBottom:'10px'}}
      >
        All Service Providers
      </Typography>
      <AllSP/>
      </div>
    </div>
  )
}


export default MainPage;
