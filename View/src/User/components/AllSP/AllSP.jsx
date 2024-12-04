import React ,{ useEffect,useState} from 'react';
import { TextField,IconButton,Grid2 } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import ServiceProvider from '../ServiceProvider/ServiceProvider';
import api from '../../../apiRequests';

const AllSP = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    useEffect(()=>{
      const fetchServices = async () => {
        try {
          const res = await api.get("/serviceVendors");
          setData(res.data);
        } catch (err) {
          console.log(`Error fetching services: ${err}`);
        }
      };
      fetchServices();
    });
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

        {filteredData.map((data)=>(
          <Grid2 size={{ xs: 12, md: 6,lg:4 }} >
          <ServiceProvider data={data}/>  
           </Grid2>
        )
         )}
        
        
</Grid2>
    </div>
  )
}

export default AllSP;
