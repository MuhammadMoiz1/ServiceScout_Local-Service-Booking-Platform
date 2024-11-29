import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './MainPage.css'
import Welcome from '../../components/Welcome/Welcome';

const MainPage = () => {
  return (
    <div className='main-div'>
      <Navbar/>
      <Welcome/>
    </div>
  )
}

export default MainPage;
