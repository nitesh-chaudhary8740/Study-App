import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";


export default function UserLogin() {
  const navigate = useNavigate();
 
  const [formData, setFormData] = useState({
    email_or_userName: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Login data submitted:", formData);

    try {
      const response = await axios.post(
        "http://localhost:8081/user/login",
        formData,
        { withCredentials: true }
      );

      const data = response?.data;
      

      // redirect to dashboard with response data
      navigate("/dashboard", { state: data });
    } catch (error) {
      console.log("response error", error?.response?.data);
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">User Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label htmlFor="email_or_userName">Email or Username</label>
            <input
              type="text"
              id="email_or_userName"
              name="email_or_userName"
              value={formData.email_or_userName}
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

          <button type="submit" className="btn-primary">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
