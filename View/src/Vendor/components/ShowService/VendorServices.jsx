import React, { useState, useEffect } from "react";
import { Card, Typography, Button } from "@mui/material";
import api from "../../../apiRequests";
import "./VendorServices.css";

const VendorServices = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendorServices = async () => {
      try {
        const response = await api.get("/ServiceProviderServiceLinks/vendor");
        setServices(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        setIsLoading(false);
      }
    };

    fetchVendorServices();
  }, []);

  return (
    <div className="vendor-services-container">
      <div className="JobHeaderContainer">
        <div className="HeaderContent">
          <h2>Your Skills</h2>
          <p>Here are the services you offer. Keep it updated!</p>
          <div className="HeaderUnderline"></div>
        </div>
      </div>
      {isLoading ? (
        <Typography>Loading services...</Typography>
      ) : (
        <div className="skills-marquee">
          <div className="skills-track">
            {services.map((service) => (
              <Button
                key={service.serviceId}
                variant="outlined"
                className="skill-button"
                color="primary"
              >
                {service.serviceName}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorServices;
