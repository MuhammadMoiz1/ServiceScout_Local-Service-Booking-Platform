import React, { useState, useEffect } from "react";
import api from "../../../apiRequests";

const PendingRatings = () => {
  const [pendingRatings, setPendingRatings] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchPendingRatings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/ServiceRequests/PendingRatings");
      setPendingRatings(response.data);
    } catch (error) {
      console.error("Error fetching pending ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (requestId, vendorId) => {
    const rating = ratings[requestId];
    if (!rating || rating < 1 || rating > 5) {
      alert("Please enter a valid rating between 1 and 5.");
      return;
    }

    try {
      await api.post("/ServiceOrders/rate", {
        RequestId: requestId,
        VendorId: vendorId,
        Rating: rating,
      });
      alert("Rating submitted successfully!");
      fetchPendingRatings(); // Refresh the pending ratings list
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Try again.");
    }
  };

  const handleRatingChange = (requestId, value) => {
    setRatings({ ...ratings, [requestId]: value });
  };

  useEffect(() => {
    fetchPendingRatings();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pending Ratings</h2>
      {loading ? (
        <p>Loading pending ratings...</p>
      ) : pendingRatings.length === 0 ? (
        <p>No pending ratings found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Service
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Description
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Vendor
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Requested Time
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Price
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Rating
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {pendingRatings.map((rating) => (
              <tr key={rating.Id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {rating.ServiceName}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {rating.Description}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {rating.Username}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {new Date(rating.RequestedTime).toLocaleString()}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  ${rating.Price}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={ratings[rating.Id] || ""}
                    onChange={(e) =>
                      handleRatingChange(rating.Id, e.target.value)
                    }
                    placeholder="Enter rating"
                  />
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <button
                    onClick={() => submitRating(rating.Id, rating.UserId)}
                  >
                    Submit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingRatings;
