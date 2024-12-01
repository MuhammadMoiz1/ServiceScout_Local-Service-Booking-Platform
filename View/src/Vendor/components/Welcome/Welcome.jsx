import React from "react";
import image from "../../../assets/vendorWelcome_two-bg.png";
import { Typography, Button } from "@mui/material";
import "./Welcome.css";

const VendorWelcome = () => {
  return (
    <div className="OuterContainer">
      <div className="InnerContainer">
        <div className="leftVendor">
          <Typography variant="h3" gutterBottom sx={{ marginBottom: "20px" }}>
            Grow your service business effortlessly!
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ marginBottom: "30px" }}
          >
            Connect with clients who need your expertise, from quick fixes to
            major projects. Showcase your skills, gain trust, and expand your
            reach. Let us help you succeed every step of the way.
          </Typography>
        </div>
        <div className="rightVendor">
          <img src={image} alt="Service Providers" />
        </div>
      </div>
    </div>
  );
};

export default VendorWelcome;
