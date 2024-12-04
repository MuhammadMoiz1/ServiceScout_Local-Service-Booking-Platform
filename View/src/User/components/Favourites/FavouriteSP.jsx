import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './FavouriteSP.css';
import ServiceProvider from '../ServiceProvider/ServiceProvider';
import api from '../../../apiRequests';
import { Button, Typography, Box } from "@mui/material";

const CustomPrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} custom-prev-arrow`}
        style={{ ...style, display: 'block' }}
        onClick={onClick}
      />
    );
  };
  
  const CustomNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} custom-next-arrow`}
        style={{ ...style, display: 'block' }}
        onClick={onClick}
      />
    );
  };
const FavouriteSP = () => {
  const [data,setData]=useState([]);
  useEffect(()=>{
      const fetchData=async ()=>{
        try{
          const res=await api.get("/ServiceVendors/user-vendors");
          // console.log(res?.data)
          setData(res?.data);
        }
        catch(err){
          console.log(err);
        }
      }
      fetchData();
  },[]);
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              dots: true,
              prevArrow: false,
              nextArrow: false,
            }
          },
          
        ]
      };
       
      return (
        <div className="slider-container">
          {data && data.length > 1 ? (
            <Slider {...settings}>
              {data.map((d) => (
                <div key={d.id}>
                  <ServiceProvider data={d} />
                </div>
              ))}
            </Slider>
          ) : data && data.length === 1 ? (
            <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
              {data.map((d) => (
                <div key={d.id}>
                  <ServiceProvider data={d} />
                </div>
              ))}
            </div>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                padding: "20px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                marginTop: "20px",
              }}
            >
              <Typography variant="h6" sx={{ marginBottom: "10px", color: "#555" }}>
                No Previous Service Providers .
              </Typography>
            </Box>
          )}
        </div>
      );
}

export default FavouriteSP;
