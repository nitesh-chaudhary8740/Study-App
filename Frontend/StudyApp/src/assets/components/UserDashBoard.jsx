import React, { useContext } from "react";
import axios from "axios";
import "./css/Dashboard.css";
import { StudyContext } from "./StudyContext";

const UserDashBoard = () => {

  const values = useContext(StudyContext);
 
  if (values.isLoading) {
    return (
      <div className="dashboard-loading">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Welcome, {values.currentUser.fullName}!</h1>
        <p className="dashboard-subtitle">Your dashboard is ready.</p>

        <div className="dashboard-info">
          <div className="info-item">
            <p className="info-label">Username:</p>
            <p className="info-value">{values.currentUser.userName}</p>
          </div>
          <div className="info-item">
            <p className="info-label">Email:</p>
            <p className="info-value">{values.currentUser.email}</p>
          </div>
        </div>

        <button
          className="btn-normal"
          onClick={async () => {
            const response = await axios.post(
              "http://localhost:8081/user/logout",
              {},
              { withCredentials: true }
            );
            const data = await response.data;
            console.log("user logout", data);
       
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDashBoard;
