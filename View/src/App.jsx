import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import SignIn from "./User/pages/SignIn";
import MainPage from "./User/pages/MainPage/MainPage";
import MainPageVendor from "./Vendor/Pages/MainPage/MainPageVendor";
import ServiceHistory from "./Vendor/components/ServiceHistory/ServiceHistory";
import Login from "./User/pages/Login";
import ServiceRequestForm from "./User/pages/CreateServiceRequest/CreateSR";
import ResponserCard from "./User/components/ResponseCard/ResponserCard";
import VendorSignupForm from "./Vendor/Pages/VendorSignin";
import VendorLogin from "./Vendor/Pages/VendorLogin";
import HomePage from "./HomePage/HomePage";

const App = () => {
  return (
    <div className="app">
      <Routes>
        {/* Home Page Route */}
        <Route path="/" element={<HomePage />} />
        {/* User Routes */}
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/signup" element={<SignIn />} />
        <Route path="/user" element={<MainPage />} /> {/* User's Dashboard */}
        {/* Vendor Routes */}
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/signup" element={<VendorSignupForm />} />
        <Route path="/vendor" element={<MainPageVendor />} />{" "}
        {/* Vendor's Dashboard */}
        {/* Additional routes */}
        <Route path="/vendor/service-history" element={<ServiceHistory />} />
        <Route path="/newRequest" element={<ServiceRequestForm />} />
        <Route path="/responser" element={<ResponserCard />} />
      </Routes>
    </div>
  );
};

export default App;
