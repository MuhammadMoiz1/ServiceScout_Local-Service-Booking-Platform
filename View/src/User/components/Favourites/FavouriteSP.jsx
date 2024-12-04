import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './FavouriteSP.css';
import ServiceProvider from '../ServiceProvider/ServiceProvider';
import api from '../../../apiRequests';

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
      const fetchData=()=>{
        try{
          const res=api.get("/ServiceVendors/user-vendors");
          console.log(res.data)
          setData(res.data);
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
        slidesToScroll: 1,
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
      <Slider {...settings}>
      {/* Your slider content here */}
      {data?.map((d)=>(
          
           <div><ServiceProvider data={d}/></div> 
        )
         )}
      
    </Slider>
    </div>
  )
}

export default FavouriteSP;
