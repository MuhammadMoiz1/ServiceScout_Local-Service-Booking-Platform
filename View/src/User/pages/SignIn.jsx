import React, { useState } from "react";
import { TextField, Button,Box, Typography, Paper,styled,Snackbar,Alert,MenuItem} from "@mui/material";
import logo from '../../assets/logo.png';
import { useNavigate } from "react-router-dom";
import axios from 'axios';


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
  const karachiTowns = [
    { id: 1, name: "Korangi" },
    { id: 2, name: "Gulshan-e-Iqbal" },
    { id: 3, name: "Saddar" },
    { id: 4, name: "Karachi Saddar" },
    { id: 5, name: "Lyari" },
    { id: 6, name: "Korangi" },
    { id: 7, name: "Kemari" },
    { id: 8, name: "Malir" },
    { id: 9, name: "Bahria Town" },
    { id: 10, name: "Faisal Colony" },
  ];

function SignIn() {
  const navigate=useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    cnic: "",
    password: "",
    confirmPassword: "",
    area:"",
  });


  const [errors, setErrors] = useState({
    name: "",
    email: "",
    contact: "",
    cnic: "",
    password: "",
    confirmPassword: "",
    area:"",
  });
  const [open, setOpen] = React.useState(false);
  const [errmessage,setErrmessage]=useState(''); 
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
 

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.contact.trim() || !/^\d{10,15}$/.test(formData.contact))
      newErrors.contact = "Contact number must be 10-15 digits";
    if (!formData.cnic.trim() || !/^\d{13}$/.test(formData.cnic))
      newErrors.cnic = "CNIC must be exactly 13 digits";
    if (!formData.password.trim() || formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit =async (e) => {
    e.preventDefault(); 
    const data=
      {
        name: formData['name'],
        area: formData['area'],
        cnicNumber: formData.cnic,
        email: formData.email,
        password: formData.password,
        contactInfo: formData.contact
      }
    console.log(data)
    try {
      const response = await axios.post('http://localhost:5150/api/Auth/register', data); // Replace with your API URL
      console.log('Response:', response.data);
      navigate("/user/login", { state: { successMessage: "Account created successfully! Please log in." } });
    } catch (error) {
      console.error('Error submitting form:', error.response || error.message);
      setErrmessage(error.response.data);
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
        minHeight:'80vh'
      }}
    >
      
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity='error'
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
      Start your journey!
      </Typography>
      <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: '2.8vh' ,alignItems:'center'}}
        >
            <Field
              label="Full Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
              required
            />
          
            <Field
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
              required
            />
            <Field
              label="Contact Number"
              name="contact"
              type="tel"
              fullWidth
              value={formData.contact}
              onChange={handleChange}
              error={!!errors.contact}
              helperText={errors.contact}
              variant="outlined"
              required
            />
            <Field
              label="CNIC Number"
              name="cnic"
              fullWidth
              value={formData.cnic}
              onChange={handleChange}
              error={!!errors.cnic}
              helperText={errors.cnic}
              variant="outlined"
              required
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
              required
            />
            <Field
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              variant="outlined"
              required
            />
             <Field
          select
          label="Area"
          name="area"
          fullWidth
          value={formData.area}
          onChange={handleChange}
          error={!!errors.area}
          helperText={errors.area}
          variant="outlined"
          required
        >
          {karachiTowns.map((town) => (
            <MenuItem key={town.id} value={town.name}>
              {town.name}
            </MenuItem>
          ))}
        </Field>

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
              sign up
            </Button>
           <Typography>Already have an account? 
            <Button
            sx={{textTransform:'none'}}
            onClick={()=>navigate('/login')}
            >
              Click Here </Button>
            </Typography>
          </Box>
    </Paper>
  );
}

export default SignIn;
