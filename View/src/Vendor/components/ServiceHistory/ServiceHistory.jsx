import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./ServiceHistory.css";

const ServiceHistory = () => {
  // Sample data (in real scenario, this would come from backend)
  const pendingRequests = [
    {
      id: 1,
      userName: "John Doe",
      service: "Plumbing",
      description: "Fixing bathroom sink leak",
      serviceTime: "2 hours",
      area: "New York",
      postedOn: "2024-02-15",
      price: "$120",
    },
    {
      id: 2,
      userName: "Emma Watson",
      service: "Electrical",
      description: "Replacing faulty circuit breaker",
      serviceTime: "3 hours",
      area: "Chicago",
      postedOn: "2024-02-16",
      price: "$180",
    },
  ];

  const completedOrders = [
    {
      id: 3,
      userName: "Mike Smith",
      service: "Painting",
      description: "Living room wall painting",
      serviceTime: "5 hours",
      area: "Los Angeles",
      postedOn: "2024-01-25",
      price: "$350",
    },
    {
      id: 4,
      userName: "Sarah Johnson",
      service: "Cleaning",
      description: "Deep house cleaning",
      serviceTime: "4 hours",
      area: "San Francisco",
      postedOn: "2024-02-01",
      price: "$200",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="service-history-container">
        <div className="history-section pending-requests">
          <h2>Pending Requests</h2>
          {pendingRequests.map((request) => (
            <div key={request.id} className="history-card">
              <div className="card-header">
                <h3>{request.userName}</h3>
                <span className="service-tag pending">{request.service}</span>
              </div>
              <div className="card-body">
                <p className="description">{request.description}</p>
                <div className="card-details">
                  <div className="detail-item">
                    <span className="label">Area:</span>
                    <span className="value">{request.area}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Service Time:</span>
                    <span className="value">{request.serviceTime}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Price:</span>
                    <span className="value price">{request.price}</span>
                  </div>
                </div>
                <div className="card-footer">
                  <span className="posted-date">
                    Posted on: {request.postedOn}
                  </span>
                  <button className="action-button">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="history-section completed-orders">
          <h2>Completed Orders</h2>
          {completedOrders.map((order) => (
            <div key={order.id} className="history-card">
              <div className="card-header">
                <h3>{order.userName}</h3>
                <span className="service-tag completed">{order.service}</span>
              </div>
              <div className="card-body">
                <p className="description">{order.description}</p>
                <div className="card-details">
                  <div className="detail-item">
                    <span className="label">Area:</span>
                    <span className="value">{order.area}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Service Time:</span>
                    <span className="value">{order.serviceTime}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Price:</span>
                    <span className="value price">{order.price}</span>
                  </div>
                </div>
                <div className="card-footer">
                  <span className="posted-date">
                    Posted on: {order.postedOn}
                  </span>
                  <button className="action-button">View Receipt</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ServiceHistory;
