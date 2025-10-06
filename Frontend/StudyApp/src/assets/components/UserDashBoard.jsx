import React, { useContext } from "react";

import "./css/Dashboard.css";
import { StudyContext } from "./StudyContext";

const UserDashBoard = () => {

  const values = useContext(StudyContext);
 console.log("redirected")
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

       
      </div>
    </div>
  );
};

export default UserDashBoard;
