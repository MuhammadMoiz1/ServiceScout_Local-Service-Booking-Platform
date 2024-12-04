import React from "react";
import { Link } from "react-router-dom"; // Import Link to navigate
import "./HomePage.css";
import logo from "../assets/logo.png";

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Logo and Website Name */}
      <div className="home-header">
        <img src={logo} alt="Website Logo" className="home-logo" />
        <h1 className="home-title">Service Scout</h1>
      </div>

      <div className="home-left-section">
        <div className="home-content">
          <h1>Welcome Users</h1>
          <p>Looking to book a service provider? Get started here!</p>
          <div className="home-buttons">
            {/* Link to User Login/Signup */}
            <Link to="/user/login">
              <button className="home-btn">Login as User</button>
            </Link>
            <Link to="/user/signup">
              <button className="home-btn">Signup as User</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="home-right-section">
        <div className="home-content">
          <h1>Welcome Service Providers</h1>
          <p>Find customers and grow your business with us!</p>
          <div className="home-buttons">
            {/* Link to Vendor Login/Signup */}
            <Link to="/vendor/login">
              <button className="home-btn">Login as Vendor</button>
            </Link>
            <Link to="/vendor/signup">
              <button className="home-btn">Signup as Vendor</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
