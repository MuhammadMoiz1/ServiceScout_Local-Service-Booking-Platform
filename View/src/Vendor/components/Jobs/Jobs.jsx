import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PhoneIcon from "@mui/icons-material/Phone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import { Card, CardContent, Typography } from "@mui/material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import "./Jobs.css"; // Import the external CSS file

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // List data (for demonstration purposes)
  const recents = [
    {
      username: "John Doe",
      description: "Looking for a plumber for some repairs in the bathroom.",
      area: "New York",
      service: "Plumbing",
      price: "$150",
      serviceTime: "2 hours",
    },
    {
      username: "Jane Smith",
      description: "Need an electrician for some wiring work.",
      area: "Los Angeles",
      service: "Electrical",
      price: "$200",
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
        </Tabs>

        <TabPanel value={value} index={0} className="tabPanel">
          {recents.map((item, index) => (
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
      </div>
    </div>
  );
}
