import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./css/Auth.css";

import { StudyContext } from "./StudyContext";
import { toast } from "react-toastify";
// import { toast } from "react-toastify";

export default function UserLogin() {
  
  const navigate = useNavigate();
  const values = useContext(StudyContext)

  const [formData, setFormData] = useState({
    email_or_userName: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
  //  toast.success("tried")
    event.preventDefault();
    console.log("Login data submitted:", formData);

    try {
      const response = await axios.post(
        "http://localhost:8081/user/login",
        formData,
        { withCredentials: true }
      );

      const data = response?.data;
      console.log("my data",data)
      values.setIsLoading(false)
      values.setCurrentUser(data.data)
 
      navigate("/dashboard");
    } catch (error) {
      toast.error(`${error}`)
      console.log("response error", error?.response?.data);
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">User Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email / Username */}
          <div className="form-group">
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

          {/* Password with toggle */}
          <div className="form-group password-field">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn-primary">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
