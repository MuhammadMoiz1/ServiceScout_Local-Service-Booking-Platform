import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../../assets/logo.png';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [menu, setMenu] = useState('Home');
  const [close, setClose] = useState(false);
  const [hamClass, setHamClass] = useState('navbar-menu');

  const handleSignInClick = () => {
    console.log('Log out clicked'); // Example log for debugging
  };

  return (
    <div className="navbar">
      <img src={logo} alt="Logo" className="logo" />

      <ul className={hamClass}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={() => { setClose(false); setHamClass('navbar-menu'); }}
        >
          Home
        </NavLink>
        <NavLink
          to="/new-request"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={() => { setClose(false); setHamClass('navbar-menu'); }}
        >
          New Request
        </NavLink>
        <NavLink
          to="/service-history"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={() => { setClose(false); setHamClass('navbar-menu'); }}
        >
          Service History
        </NavLink>
        <NavLink
          style={{ display: 'none' }}
          onClick={() => setMenu('SignIn')}
          className={menu === 'SignIn ham-sign' ? 'active' : 'ham-sign'}
        >
          Log out
        </NavLink>
      </ul>
      <div className="navbar-right">
        <button onClick={handleSignInClick}>Log out</button>
      </div>
      <div className="hamburger">
        {close ? (
          <CloseIcon
            style={{ fontSize: '35px' }}
            onClick={() => { setClose(false); setHamClass('navbar-menu'); }}
          />
        ) : (
          <MenuIcon
            style={{ fontSize: '35px' }}
            onClick={() => { setClose(true); setHamClass('navbar-menu ham-active'); }}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
