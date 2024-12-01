import "./App.css";
import React, { useState, useEffect } from "react";
import SignIn from "./User/pages/SignIn";
import MainPage from "./User/pages/MainPage/MainPage";
import MainPageVendor from "./Vendor/Pages/MainPage/MainPageVendor";
import { Route, Routes } from "react-router-dom";

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
          path="/signup"
          element={
            <div>
              <SignIn />
            </div>
          }
        />
      </Routes>
    </div>
  );
};
export default App;