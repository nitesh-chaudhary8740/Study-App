import axios from 'axios';
import React, { useState } from 'react';

// This component is designed to be completely unstyled, so you can add your own.
// We're using inline styles here to override any global stylesheets from the preview environment.
export default function UserLogin() {
  const [formData, setFormData] = useState({
    email_or_userName: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Login data submitted:', formData);
    try {
      const response = await   axios.post("http://localhost:8081/user/login",formData);
const data = await response.data
    console.log('response data:', data);
    } catch (error) {
      console.log("response error",error.response.data)
      console.log(error)
    }
    // In a real app, you would add your API call here
  };

  return (
    <div >
      <h2>Log In</h2>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <div>
          <label htmlFor="email" style={{
            marginBottom: '0.25rem',
          }}>Email Address</label>
          <input
            type="email_or_userName"
            id="email_or_userName"
            name="email_or_userName"
            value={formData.email}
            onChange={handleChange}
            required
           
          />
        </div>

        <div >
          <label htmlFor="password" style={{
            marginBottom: '0.25rem',
          }}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required         
          />
        </div>
        <button style={{width:"20vh"}} type="submit" >
          Log In
        </button>
      </form>
    </div>
  );
}
