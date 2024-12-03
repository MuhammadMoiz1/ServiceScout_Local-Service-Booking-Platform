import "./App.css";
import React from "react";
import SignIn from "./User/pages/SignIn";
import MainPage from "./User/pages/MainPage/MainPage";
import MainPageVendor from "./Vendor/Pages/MainPage/MainPageVendor";
import ServiceHistory from "./Vendor/components/ServiceHistory/ServiceHistory";
import { Route, Routes } from "react-router-dom";
import Login from "./User/pages/Login";
import ServiceRequestForm from "./User/pages/CreateServiceRequest/CreateSR";
import ResponserCard from "./User/components/ResponseCard/ResponserCard";
import VendorSignupForm from "./Vendor/Pages/VendorSignin";
import VendorLogin from "./Vendor/Pages/VendorLogin";

const App = () => {
  return (
    <div className="app">
      {/* <SignIn/> */}
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <MainPage />
            </div>
          }
        />
        <Route
          path="/vendor"
          element={
            <div>
              <MainPageVendor />
            </div>
          }
        />

        <Route
          path="/vendor/service-history"
          element={
            <div>
              <ServiceHistory />
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div>
              <SignIn />
            </div>
          }
        />
        <Route
          path="/Vendorsignup"
          element={
            <div>
              <VendorSignupForm />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div>
              <Login />
            </div>
          }
        />
        <Route
          path="/Vendorlogin"
          element={
            <div>
              <VendorLogin />
            </div>
          }
        />
        <Route
          path="/newRequest"
          element={
            <div>
              <ServiceRequestForm />
            </div>
          }
        />
        <Route
          path="/responser"
          element={
            <div>
              <ResponserCard />
            </div>
          }
        />
      </Routes>
    </div>
  );
};
export default App;
