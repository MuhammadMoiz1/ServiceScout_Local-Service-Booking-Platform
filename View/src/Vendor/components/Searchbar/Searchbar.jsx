import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./Searchbar.css";

const SearchBar = () => {
  return (
    <div className="search-bar-container">
      <TextField
        placeholder="Search for Jobs"
        label="Search"
        variant="outlined"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default SearchBar;
