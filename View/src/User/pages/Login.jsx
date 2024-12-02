import React, { useEffect, useState } from "react";
import { TextField, Button,Box, Typography, Paper,styled,Snackbar,Alert} from "@mui/material";
import logo from '../../assets/logo.png';
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";


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

  const [open, setOpen] = React.useState(false);
  const [errmessage,setErrmessage]=useState('');  
  const [intense,setIntense]=useState('');
  const navigate=useNavigate();
  const location = useLocation();
  useEffect(()=>{
    if(location.state){
    setErrmessage(location.state?.successMessage);
    setIntense('success');
    setOpen(true);
    }
  },[])
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
}

  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });


  const [errors, setErrors] = useState({
    Email: "",
    Password: "",
  });
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:5150/api/Auth/login", formData);
  
        localStorage.setItem("token", response.data.token);
  
        console.log("Login Successful:", response.data);
        navigate('/');
      } catch (err) {
        console.error("Login Failed:", err.response?.data || err.message);
        // setError(err.response?.data || "Login failed. Please try again.");
        setErrmessage(err.response.data);
        setIntense('error');
        setOpen(true);
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
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={intense}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errmessage}
        </Alert>
      </Snackbar>
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
              name="Email"
              type="email"
              fullWidth
              value={formData.Email}
              onChange={handleChange}
              error={!!errors.Email}
              helperText={errors.Email}
              variant="outlined"
            />
          
            <Field
              label="Password"
              name="Password"
              type="password"
              fullWidth
              value={formData.Password}
              onChange={handleChange}
              error={!!errors.Password}
              helperText={errors.Password}
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
