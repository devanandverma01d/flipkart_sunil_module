import React, { useEffect, useState } from 'react';
import { TextField,InputLabel,FormControl, Select, MenuItem, Button } from '@mui/material';
import { useRouter } from 'next/Navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// This is initial states
const initialFormData = {
    account: '',
    pincode: '',
    productLink: '',
    affliatedLink:'',
    address: '',
    locality:'',
    customerName: '',
    customerMobile: '',
    cardNumber:'',
    name:'',
    bank:'',
    cc:'',
};
const Account = () => {
  const router = useRouter()  
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReset = () => {
    window.location.reload();
  };
  const handlePurchage=(e)=>{
    e.preventDefault()
    router.push('/purchase')
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    if(!formData.account || !formData.pincode || !formData.productLink || !formData.affliatedLink || !formData.address || !formData.locality || !formData.customerName || !formData.cvv || !formData.month || !formData.year ){
        toast.error("Pleasee fill all fields");
        return;
    }
    console.log(formData);
    
  };
  const handleLogout=(e)=>{
    e.preventDefault()
    localStorage.clear()
    router.push('/')
  }



  useEffect(()=>{
    fetch(``)
  })

  return (
    <div className='container-fluid' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'gray' }}>
        <form style={{backgroundColor:"lightgray", padding:'20px'}}>
            <div>
            <TextField
              id="outlined-basic"
              label="Product Link"
              variant="outlined"
              sx={{ m: 1, width: '100ch' }}
              type="text"
              name="productLink"
              value={formData.productLink}
              onChange={handleInputChange}
            />
            </div>
            <div>
            <TextField
              id="outlined-basic"
              label="Affliated Link"
              variant="outlined"
              sx={{ m: 1, width: '100ch' }}
              type="text"
              name="affliatedLink"
              value={formData.affliatedLink}
              onChange={handleInputChange}
            />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormControl variant="outlined" sx={{ m: 1, flex: 1, marginLeft: '10px' }}>
                    <InputLabel htmlFor="account">Account</InputLabel>
                    <Select
                        id="account"
                        name="account"
                        value={formData.account}
                        onChange={handleInputChange}
                        label="Account"
                    >
                        <MenuItem value="account1">Account 1</MenuItem>
                        <MenuItem value="account2">Account 2</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ m: 1, flex: 1, marginRight: '10px' }}>
                    <InputLabel htmlFor="pincode">Pincode</InputLabel>
                    <Select
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        label="Pincode"
                    >
                        <MenuItem value="pincode1">Pincode 1</MenuItem>
                        <MenuItem value="pincode2">Pincode 2</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormControl variant="outlined" sx={{ m: 1, flex: 1, marginLeft: '10px' }}>
                    <InputLabel htmlFor="address">Address</InputLabel>
                    <Select
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        label="Address"
                    >
                        <MenuItem value="address1">Address 1</MenuItem>
                        <MenuItem value="address2">Address 2</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ m: 1, flex: 1, marginRight: '10px' }}>
                    <InputLabel htmlFor="locality">Locality</InputLabel>
                    <Select
                        id="locality"
                        name="locality"
                        value={formData.locality}
                        onChange={handleInputChange}
                        label="Locality"
                    >
                        <MenuItem value="locality1">Locality 1</MenuItem>
                        <MenuItem value="locality2">Locality 2</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormControl variant="outlined" sx={{ m: 1, flex: 1, marginRight: '10px' }}>
                    <InputLabel htmlFor="customerName">Customer Name</InputLabel>
                    <Select
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        label="Customer Name"
                    >
                        <MenuItem value="devanand">Devanand Verma</MenuItem>
                        <MenuItem value="rohit">Rohit Mali</MenuItem>
                        <MenuItem value="pankaj">Pankaj Rathore</MenuItem>
                    </Select>
                </FormControl>
            <FormControl variant="outlined" sx={{ m: 1, flex: 1, marginLeft: '10px' }}>
                <InputLabel htmlFor="customerMobile">Customer Mobile No.</InputLabel>
                <Select
                    id="customerMobile"
                    name="customerMobile"
                    value={formData.customerMobile}
                    onChange={handleInputChange}
                    label="Customer Mobile No."
                >
                    <MenuItem value="9074528630">9074528630</MenuItem>
                    <MenuItem value="7697634314">7697634314</MenuItem>
                    <MenuItem value="8827969885">8827969885</MenuItem>
                </Select>
            </FormControl>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormControl variant="outlined" sx={{ m: 1, flex: 1, marginLeft: '10px' }}>
                <InputLabel htmlFor="name">CC Name</InputLabel>
                <Select
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    label="CC Name"
                >
                    <MenuItem value="anil">Anil</MenuItem>
                    <MenuItem value="sunil">Sunil</MenuItem>
                </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ m: 1, flex: 1, marginLeft: '10px' }}>
                <InputLabel htmlFor="cc">CC Number</InputLabel>
                <Select
                    id="cc"
                    name="cc"
                    value={formData.cc}
                    onChange={handleInputChange}
                    label="CC Number"
                >
                    <MenuItem value="4242424242">4242424242</MenuItem>
                    <MenuItem value="52525252525">52525252</MenuItem>
                </Select>
            </FormControl>
            
            <FormControl variant="outlined" sx={{ m: 1, flex: 1, marginLeft: '10px' }}>
                <InputLabel htmlFor="bank">CC Bank</InputLabel>
                <Select
                    id="bank"
                    name="bank"
                    value={formData.bank}
                    onChange={handleInputChange}
                    label="CC Bank"
                >
                    <MenuItem value="SBI">SBI</MenuItem>
                    <MenuItem value="PNB">PNB</MenuItem>
                </Select>
            </FormControl>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"right",width:'850px',marginTop:"20px"}}>
                <Button type="submit" variant="contained" onClick={handleLogout}>Logout</Button>
                <Button type="submit" variant="contained" onClick={handlePurchage} style={{marginLeft:"10px"}}>Purchased History</Button>
                <Button type="submit" variant="contained" onClick={handleReset} style={{marginLeft:"10px"}}>RESET</Button>
                <Button type="submit" variant="contained" onClick={handleSubmit} style={{marginLeft:"10px"}}>GO</Button>
            </div>
            <ToastContainer />
        </form>
    </div>
  );
};

export default Account;
    