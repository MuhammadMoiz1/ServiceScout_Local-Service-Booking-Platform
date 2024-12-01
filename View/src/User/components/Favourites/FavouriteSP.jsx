import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './FavouriteSP.css';
import ServiceProvider from '../ServiceProvider/ServiceProvider';

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
      <div><ServiceProvider/></div>  
      <div><ServiceProvider/></div> 
    </Slider>
    </div>
  )
}

export default FavouriteSP;
