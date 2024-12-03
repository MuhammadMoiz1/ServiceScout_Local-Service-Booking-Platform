import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import "./ServiceHistory.css";
import api from "../../../apiRequests";

const ServiceHistory = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const pendingResponse = await api.get("/PendingLogs/Vendor");
        console.log(pendingResponse);
        console.log("Response Headers", pendingResponse.headers);
        const formattedPendingRequests = pendingResponse.data.map((item) => ({
          id: item.requestId,
          userName: item.username,
          service: item.serviceName,
          description: item.description,
          serviceTime: "N/A",
          area: item.area,
          postedOn: item.postedOn,
          price: `$${item.amount}`,
        }));
        setPendingRequests(formattedPendingRequests);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };

    const fetchCompletedOrders = async () => {
      try {
        const completedResponse = await api.get("/ServiceOrders/VendorOrders");
        const formattedCompletedOrders = completedResponse.data.map((item) => ({
          id: item.orderId,
          userName: item.userName,
          service: item.serviceName,
          description: item.description,
          serviceTime: "N/A",
          area: item.area,
          postedOn: item.postedOn,
          price: `$${item.price}`,
          status: item.status,
        }));
        setCompletedOrders(formattedCompletedOrders);
      } catch (error) {
        console.error("Error fetching completed orders:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchPendingRequests(), fetchCompletedOrders()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
                    Posted on: {new Date(request.postedOn).toLocaleDateString()}
                  </span>
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
                    Posted on: {new Date(order.postedOn).toLocaleDateString()}
                  </span>
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
