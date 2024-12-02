import React ,{ useEffect,useState} from 'react';
import { TextField,IconButton,Grid2 } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import ServiceProvider from '../ServiceProvider/ServiceProvider';

const AllSP = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    useEffect(() => {
        if (searchQuery) {
          setFilteredData(
            data.filter((defect) =>
              defect.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
          );
        } else {
          setFilteredData(data);
        }
      }, [searchQuery, data]);
    
      const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
      };
    
  return (
    <div>
        <div style={{ marginTop: '40px',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <TextField
          label="Search Service Providers"
          variant="outlined"
          size='small'
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <IconButton type="submit" aria-label="search">
        <SearchIcon style={{ fill: "#2E3D49" }} />
      </IconButton>
      </div>
      <Grid2 container spacing={3} sx={{ flexGrow: 1 }}>
        <Grid2 size={{ xs: 12, md: 6,lg:4 }} >
          <ServiceProvider/>  
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6,lg:4 }}>
          <ServiceProvider/>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6,lg:4 }}>
           <ServiceProvider/>
        </Grid2>
        <Grid2 size={{ xs:12, md: 6 ,lg:4}} >
           <ServiceProvider/>
        </Grid2>
</Grid2>
    </div>
  )
}

export default AllSP;
