import React, { useState } from 'react';
import axios from "axios"
export default function ProviderRegistration() {
  const [formData, setFormData] = useState({
    providerUserName: '',
    fullName: '',
    email: '',
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
    console.log('Form data submitted:', formData);
    try {
      const response =  await axios.post("http://localhost:8081/provider/provider-registration",formData)
      const data = await response.data
      console.log("data is",data) 
        
    } catch (error) {
        console.log(error)
        console.log(error.response.data)
    }
    // In a real app, you would add your API call here
  };

  return (
    <div>
      <h2>Register Provider</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="providerUserName">Provider User Name</label>
          <input
            type="text"
            id="providerUserName"
            name="providerUserName"
            value={formData.providerUserName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
