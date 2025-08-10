import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Rating, Button, Box } from "@mui/material";
import { styled } from "@mui/system";
import api from '../../apiRequests';

// Styled Card for modern visual appeal
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  margin: "20px auto",
  background: "linear-gradient(135deg, #f56048, #f57000)",
  color: "#fff",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  overflow: "hidden",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.03)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  background: "#ffffff",
  color: "#f56048",
  fontWeight: "bold",
  "&:hover": {
    background: "#E3E4E8",
  },
}));

const VendorRatingCard = (props) => {
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(false);
  const [error, setError] = useState("");


  useEffect(()=>{
    console.log(props.data);
  })
  const handleSubmitRating = async () => {
    if (rating < 1) {
      setError("Please select a rating before submitting.");
      return;
    }

    try {
      // Send the rating to the server
      await api.post("/ServiceOrders/rate", {
        requestId: props.data.requestId,
        vendorId: props.data.vendorId,
        rating: rating,
      });
      

      setIsRated(true);
      setError("");

      // Notify the parent component about the rating submission
      if (onRatingSubmitted) onRatingSubmitted(order.Id);
    } catch (err) {
      console.error("Error submitting rating:", err.response?.data || err.message);
      setError("Failed to submit rating. Please try again.");
    }
  };

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {props.data?.vendorName}

        </Typography>
        <Typography variant="subtitle1" component="div">

          {props.data?.serviceName}
        </Typography>
        <Box mt={2}>
          <Typography variant="body1" gutterBottom>
            Rate the Service:
          </Typography>
          <Rating
            name={`vendor-rating-1`}
            // ${order.Id}
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            size="large"
          />
        </Box>
        {error && (
          <Typography variant="body2" color="error" mt={1}>
            {error}
          </Typography>
        )}
        {isRated ? (
          <Typography variant="body2" mt={2} color="success.main">
            Thank you for rating!
          </Typography>
        ) : (
          <StyledButton onClick={handleSubmitRating}>Submit Rating</StyledButton>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default VendorRatingCard;
