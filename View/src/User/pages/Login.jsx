import React, { useState } from "react";
import { TextField, Button,Box, Typography, Paper,styled} from "@mui/material";
import logo from '../../assets/logo.png';
import { useNavigate } from "react-router-dom";


const Field = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: '13px', 
     
      '&.Mui-focused fieldset': {
        borderColor: '#2196F3', 
      },
      '& .MuiInputBase-input': {
        padding: '9.5px 12px', 
      },
    },
    '& .MuiInputLabel-root': {
    fontSize: '0.9rem', 
    alignProperty: 'center',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#2196F3', 
    },
  }));


function Login() {
    
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log(`${position.coords.latitude},${position.coords.longitude}`)
          setFormData((prev) => ({
            ...prev,
            ['area']:`${position.coords.latitude},${position.coords.longitude}`
          }));
        },
        (err) => {
          setErrors((prev) => ({
            ...prev,
            ['area']: err.message,
          }))  
        }
      );
    } else {
        setErrors({
            ...prev,
            ['area']: 'Geolocation is not supported by this browser.',
          })   
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Submitted:", formData);
      alert("Form submitted successfully!");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 450,
        mx: "auto",
        mt: 5,
        px:4,
        pb:4,
        pt:3,
        borderRadius: 3,
        backgroundColor: "white",
        marginBottom:'20px',
        minHeight:'50vh'
      }}
    >
      <div style={{display:"flex",alignItems:'center',justifyContent:'center'}}>
        <img src={logo} alt="logo" style={{
          width:'90px'
        }}/>
      </div>
      <Typography variant="h5" align="center" gutterBottom sx={{ color: "#2196F3",fontWeight:700,marginBottom:'2vh' }}>
      Welcome Back Login Now!
      </Typography>
      <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: '2.8vh' ,alignItems:'center'}}
        >
            <Field
              label="Enter Email"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
            />
          
            <Field
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              variant="outlined"
            />
    

            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="primary"
              sx={{
                borderRadius: '12px',
                padding: '3px 5px',
                width:'120px',
                backgroundColor: '#2196F3',
                color: '#fff',
                fontWeight: 'bold',
                transition: 'background-color 0.3s, transform 0.3s',
                '&:hover': {
                  backgroundColor: '#1976D2',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Log In
            </Button>
           <Typography>Don't have an account? 
            <Button
            sx={{textTransform:'none'}}
            onClick={()=>navigate('/signup')}
            >
              Register Now</Button>
            </Typography>
          </Box>
    </Paper>
  );
}

export default Login;
