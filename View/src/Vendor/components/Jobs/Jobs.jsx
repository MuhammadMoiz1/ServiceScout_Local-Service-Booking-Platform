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

  // Open interest dialog
  const handleInterested = (request) => {
    setSelectedRequest(request);
    setVendorPrice(request.price.toString()); // Initialize with original price
    setOpenDialog(true);
  };

  // Close dialog
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

    const vendorId = 1; // Mocked for now

    const requestData = {
      RequestId: selectedRequest.id,
      UserId: selectedRequest.userId, // From selectedRequest
      VendorId: vendorId, // Mocked for now
      Amount: parseFloat(vendorPrice), // Ensure vendorPrice is a number
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
      // Only fetch when Recent tab is active
      fetchRecentRequests();
    }
  }, [value]);

  const directRequests = [
    {
      username: "Emily Chen",
      description: "Need urgent plumbing services for kitchen sink",
      area: "San Francisco",
      service: "Plumbing",
      price: "$180",
      serviceTime: "2 hours",
    },
    {
      username: "Michael Rodriguez",
      description: "Electrical wiring repair needed",
      area: "Seattle",
      service: "Electrical",
      price: "$250",
      serviceTime: "3 hours",
    },
  ];

  const favorites = [
    {
      username: "Bob Johnson",
      description: "Looking for a landscaper to redesign the backyard.",
      area: "Miami",
      service: "Landscaping",
      price: "$500",
      serviceTime: "5 hours",
    },
    {
      username: "Alice Brown",
      description: "Need a cleaner for a deep house cleaning.",
      area: "San Francisco",
      service: "Cleaning",
      price: "$120",
      serviceTime: "4 hours",
    },
  ];

  const nearby = [
    {
      username: "Mike Wilson",
      description: "Looking for a painter to refresh the house exterior.",
      area: "Chicago",
      service: "Painting",
      price: "$350",
      serviceTime: "6 hours",
    },
    {
      username: "Lisa White",
      description: "Need a carpenter to fix the kitchen cabinets.",
      area: "Seattle",
      service: "Carpentry",
      price: "$250",
      serviceTime: "3 hours",
    },
  ];

  // Render loading state
  const renderLoading = () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <CircularProgress />
    </div>
  );

  // Render error state
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
          {favorites.map((item, index) => (
            <Card key={index} className="card">
              <CardContent className="cardContent">
                <Typography className="cardHeader">{item.username}</Typography>
                <Typography className="cardDetail">
                  Description: {item.description}
                </Typography>
                <Typography className="cardDetail">
                  Area: {item.area}
                </Typography>
                <Typography className="cardDetail">
                  Service: {item.service}
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
                </div>
              </CardContent>
            </Card>
          ))}
        </TabPanel>

        <TabPanel value={value} index={2} className="tabPanel">
          {nearby.map((item, index) => (
            <Card key={index} className="card">
              <CardContent className="cardContent">
                <Typography className="cardHeader">{item.username}</Typography>
                <Typography className="cardDetail">
                  Description: {item.description}
                </Typography>
                <Typography className="cardDetail">
                  Area: {item.area}
                </Typography>
                <Typography className="cardDetail">
                  Service: {item.service}
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
                </div>
              </CardContent>
            </Card>
          ))}
        </TabPanel>

        <TabPanel value={value} index={3} className="tabPanel">
          {directRequests.map((item, index) => (
            <Card key={index} className="card">
              <CardContent className="cardContent">
                <Typography className="cardHeader">{item.username}</Typography>
                <Typography className="cardDetail">
                  Description: {item.description}
                </Typography>
                <Typography className="cardDetail">
                  Area: {item.area}
                </Typography>
                <Typography className="cardDetail">
                  Service: {item.service}
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
                    <button className="accept-btn">Accept</button>
                    <button className="reject-btn">Reject</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
