import React, { useRef } from "react";
import Navbar from "../../components/Navbar/Navbar";
import VendorWelcome from "../../components/Welcome/Welcome";
import SearchBar from "../../components/Searchbar/Searchbar";
import Jobheader from "../../components/Jobheader/Jobheader";
import IconLabelTabs from "../../components/Jobs/Jobs";
import "./MainPage.css";
const MainPageVendor = () => {
  return (
    <>
      <div className="main-div">
        <Navbar />
        <VendorWelcome />
      </div>
      <div className="sections">
        <SearchBar />
        <Jobheader />
        <IconLabelTabs />
      </div>
    </>
  );
};

export default MainPageVendor;
