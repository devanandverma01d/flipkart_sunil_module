import React, { useState } from 'react';
import { TextField,Button } from '@mui/material';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialFormData = {
  email:'',
  password:'',
};

const SignIn = () => {
  //states for all fields
  const [formData, setFormData] = useState(initialFormData);
  const router = useRouter();
  //Handle change function
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // OnSubmit function
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }else{
      toast.success("Login Succesful!");
  }
    console.log(formData);
    localStorage.setItem("email",formData.email)
    localStorage.setItem("password",formData.password)
    router.push('/account')
  };
  // Return Statement
  return (
    <div className='container-fluid' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'gray' }}>
      <form onSubmit={handleSubmit} style={{backgroundColor:"lightgray", padding:'20px',width:'700px',borderRadius:'20px 50px 20px 50px'}}>
        <h1 className='text-center'>Sign In Form</h1>
        <hr />
          <div className='text-center'>
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              sx={{ m: 1, width: '50ch' }}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              sx={{ m: 1, width: '50ch' }}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className='text-center' style={{padding:'20px',marginTop:'20px'}}>
            <Button type="submit" variant="contained">Sign In</Button>
          </div>
      </form>
        <ToastContainer />
    </div>
  );
};

export default SignIn;
    