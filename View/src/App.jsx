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
        <Route path="/user">
        <Route path="/user/home" element={<MainPage />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/signup" element={<SignIn />} />
        <Route path="/user/newRequest" element={<ServiceRequestForm />} />
        <Route path="/user/responser" element={<ResponserCard />} />
        </Route>
      
        {/* Vendor Routes */}
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/signup" element={<VendorSignupForm />} />
        <Route path="/vendor/home" element={<MainPageVendor />} />
        <Route path="/vendor/service-history" element={<ServiceHistory />} />
      </Routes>
    </div>
  );
};

export default App;
