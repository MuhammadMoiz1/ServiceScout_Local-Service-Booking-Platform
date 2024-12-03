import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import PhoneIcon from "@mui/icons-material/Phone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import SendIcon from "@mui/icons-material/Send";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import api from "../../../apiRequests";
import "./Jobs.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{
        position: "absolute",
        width: "100%",
        opacity: value === index ? 1 : 0,
        transition: "opacity 0.3s ease",
        pointerEvents: value === index ? "auto" : "none",
      }}
      {...other}
    >
      {children}
    </div>
  );
}

export default function IconLabelTabs() {
  const [value, setValue] = React.useState(0);
  const [recents, setRecents] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [vendorPrice, setVendorPrice] = React.useState("");

  const [favorites, setFavorites] = React.useState([]);
  const [isFavoritesLoading, setIsFavoritesLoading] = React.useState(true);
  const [favoritesError, setFavoritesError] = React.useState(null);

  const [nearby, setNearby] = React.useState([]);
  const [isNearbyLoading, setIsNearbyLoading] = React.useState(true);
  const [nearbyError, setNearbyError] = React.useState(null);

  const [directRequests, setDirect] = React.useState([]);
  const [isDirectLoading, setIsDirectLoading] = React.useState(true);
  const [DirectError, setDirectError] = React.useState(null);

  const handleInterested = (request) => {
    setSelectedRequest(request);
    setVendorPrice(request.price.toString());
    setOpenDialog(true);
  };

  const handleSave = async (item) => {
    try {
      const response = await api.post("/SavedServices", {
        serviceRequestId: item.id,
      });

      enqueueSnackbar("Service saved successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.response?.data || "Failed to save service", {
        variant: "error",
      });
    }
  };

  const handleRemoveSavedService = async (serviceRequestId) => {
    try {
      await api.delete(`/SavedServices/${serviceRequestId}`);

      setFavorites(favorites.filter((item) => item.id !== serviceRequestId));

      enqueueSnackbar("Service removed successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to remove saved service", { variant: "error" });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
    setVendorPrice("");
  };

  const handleConfirmInterest = async () => {
    if (!selectedRequest) {
      console.error("No selected request found.");
      return;
    }

    const requestData = {
      RequestId: selectedRequest.id,
      UserId: selectedRequest.userId,
      VendorId: 1,
      Amount: parseFloat(vendorPrice),
    };

    try {
      const response = await api.post("/PendingLogs", requestData);

      if (response.status === 201) {
        console.log("Interest logged successfully:", response.data);
        handleCloseDialog();
      } else {
        console.error("Failed to log interest:", response);
      }
    } catch (error) {
      console.error("Error posting interest:", error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAccept = async (requestId, vendorId) => {
    try {
      const acceptResponse = await api.put("/ServiceRequests/accept", {
        Id: requestId,
        IsCompleted: true,
      });
      console.log("Request accepted:", acceptResponse);

      const serviceOrderResponse = await api.post("/ServiceOrders", {
        RequestId: requestId,
        VendorId: vendorId,
        Status: "Accepted",
      });
      console.log("Service order created:", serviceOrderResponse);

      const incrementResponse = await api.patch(
        `/ServiceVendors/${vendorId}/IncrementOrders`
      );
      console.log("Vendor order count updated:", incrementResponse);

      const deleteResponse = await api.delete(
        `/PendingLogs/Request/${requestId}/Vendor/${vendorId}`
      );
      console.log("Pending log deleted:", deleteResponse);
    } catch (err) {
      console.error("Error handling accept:", err);
    }
  };

  const handleReject = async (requestId, vendorId) => {
    try {
      const response = await api.delete(
        `/ServiceRequests/Reject/${requestId}/${vendorId}`
      );
      console.log("Request rejected:", response);
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  React.useEffect(() => {
    const fetchRecentRequests = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/ServiceRequests/pending");
        setRecents(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching recent requests:", err);
        setError(err);
        setIsLoading(false);
      }
    };

    if (value === 0) {
      fetchRecentRequests();
    }
  }, [value]);

  React.useEffect(() => {
    const fetchSavedServices = async () => {
      try {
        setIsFavoritesLoading(true);
        const response = await api.get("/SavedServices");
        setFavorites(response.data);
        setIsFavoritesLoading(false);
      } catch (err) {
        console.error("Error fetching saved services:", err);
        setFavoritesError(err);
        setIsFavoritesLoading(false);
      }
    };

    if (value === 1) {
      fetchSavedServices();
    }
  }, [value]);

  React.useEffect(() => {
    const fetchNearbyRequests = async () => {
      try {
        setIsNearbyLoading(true);
        const response = await api.get("/ServiceRequests/nearby");
        console.log(response);
        setNearby(response.data);
        setIsNearbyLoading(false);
      } catch (err) {
        console.error("Error fetching nearby requests:", err);
        setNearbyError(err);
        setIsNearbyLoading(false);
      }
    };

    if (value === 2) {
      fetchNearbyRequests();
    }
  }, [value]);

  React.useEffect(() => {
    const fetchDirectRequests = async () => {
      try {
        setIsDirectLoading(true);
        const response = await api.get("/PendingLogs/Vendor-direct");
        console.log(response);
        setDirect(response.data);
        setIsDirectLoading(false);
      } catch (err) {
        console.error("Error fetching nearby requests:", err);
        setDirectError(err);
        setIsDirectLoading(false);
      }
    };

    if (value === 3) {
      fetchDirectRequests();
    }
  }, [value]);

  const renderLoading = () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <CircularProgress />
    </div>
  );

  const renderError = () => (
    <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
      Error loading service requests. Please try again later.
    </div>
  );

  return (
    <div style={{ position: "relative" }}>
      <div>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="icon label tabs example"
          className="tabs"
          centered
        >
          <Tab
            icon={<AccessTimeFilledIcon />}
            label="RECENTS"
            className="tab"
          />
          <Tab icon={<FavoriteIcon />} label="FAVORITES" className="tab" />
          <Tab icon={<PersonPinIcon />} label="NEARBY" className="tab" />
          <Tab icon={<SendIcon />} label="DIRECT REQUESTS" className="tab" />
        </Tabs>

        <TabPanel value={value} index={0} className="tabPanel">
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <CircularProgress />
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
              Error loading service requests. Please try again later.
            </div>
          ) : (
            recents.map((item, index) => (
              <Card key={item.id} className="card">
                <CardContent className="cardContent">
                  <Typography className="cardHeader">
                    {item.username || "Unknown User"}
                  </Typography>
                  <Typography className="cardDetail">
                    Description: {item.description}
                  </Typography>
                  <Typography className="cardDetail">
                    Area: {item.area}
                  </Typography>
                  <Typography className="cardDetail">
                    Service: {item.serviceName || "Unspecified Service"}
                  </Typography>
                  <Typography className="cardPrice">
                    Price: ${item.price.toFixed(2)}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleSave(item)}
                      style={{ marginRight: "10px" }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleInterested(item)}
                    >
                      Interested
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabPanel>

        <TabPanel value={value} index={1} className="tabPanel">
          {isFavoritesLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <CircularProgress />
            </div>
          ) : favoritesError ? (
            <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
              Error loading saved services. Please try again later.
            </div>
          ) : favorites.length === 0 ? (
            <Typography
              variant="body1"
              style={{
                textAlign: "center",
                padding: "20px",
                color: "gray",
              }}
            >
              No saved services found
            </Typography>
          ) : (
            favorites.map((item, index) => (
              <Card key={item.id} className="card">
                <CardContent className="cardContent">
                  <Typography className="cardHeader">
                    {item.username}
                  </Typography>
                  <Typography className="cardDetail">
                    Description: {item.description}
                  </Typography>
                  <Typography className="cardDetail">
                    Area: {item.area}
                  </Typography>
                  <Typography className="cardDetail">
                    Service: {item.serviceName}
                  </Typography>
                  <Typography className="cardPrice">
                    Price: ${item.price.toFixed(2)}
                  </Typography>
                  <div className="cardFooter">
                    <Typography variant="body2">
                      Posted: {new Date(item.postedOn).toLocaleDateString()}
                    </Typography>
                    <Button
                      color="secondary"
                      onClick={() => handleRemoveSavedService(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabPanel>

        <TabPanel value={value} index={2} className="tabPanel">
          {isNearbyLoading ? (
            renderLoading()
          ) : nearbyError ? (
            renderError()
          ) : nearby.length === 0 ? (
            <Typography
              variant="body1"
              style={{ textAlign: "center", padding: "20px", color: "gray" }}
            >
              No nearby services found
            </Typography>
          ) : (
            nearby.map((item) => (
              <Card key={item.id} className="card">
                <CardContent className="cardContent">
                  <Typography className="cardHeader">
                    {item.username}
                  </Typography>
                  <Typography className="cardDetail">
                    Description: {item.description}
                  </Typography>
                  <Typography className="cardDetail">
                    Area: {item.area}
                  </Typography>
                  <Typography className="cardDetail">
                    Service: {item.serviceName}
                  </Typography>
                  <Typography className="cardPrice">
                    Price: ${item.price.toFixed(2)}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleInterested(item)}
                    >
                      Interested
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabPanel>

        <TabPanel value={value} index={3} className="tabPanel">
          {isDirectLoading ? (
            renderLoading()
          ) : DirectError ? (
            renderError()
          ) : directRequests.length === 0 ? (
            <Typography
              variant="body1"
              style={{ textAlign: "center", padding: "20px", color: "gray" }}
            >
              No direct requests rightnow
            </Typography>
          ) : (
            directRequests.map((item, index) => (
              <Card key={index} className="card">
                <CardContent className="cardContent">
                  <Typography className="cardHeader">
                    {item.username}
                  </Typography>
                  <Typography className="cardDetail">
                    Description: {item.description}
                  </Typography>
                  <Typography className="cardDetail">
                    Area: {item.area}
                  </Typography>
                  <Typography className="cardDetail">
                    Service: {item.serviceName}
                  </Typography>
                  <Typography className="cardPrice">
                    Price: {item.price}
                  </Typography>
                  <Typography className="cardServiceTime">
                    Service Time: {item.serviceTime}
                  </Typography>
                  <div className="cardFooter">
                    <Typography variant="body2">
                      Posted: {new Date().toLocaleDateString()}
                    </Typography>
                    <div>
                      <button
                        className="accept-btn"
                        onClick={() =>
                          handleAccept(item.requestId, item.vendorId)
                        }
                      >
                        Accept
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() =>
                          handleReject(item.requestId, item.vendorId)
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabPanel>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="interest-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="interest-dialog-title">Confirm Interest</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Original Price: ${selectedRequest?.price.toFixed(2)}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Your Proposed Price"
            type="number"
            fullWidth
            variant="outlined"
            value={vendorPrice}
            onChange={(e) => setVendorPrice(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmInterest}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
