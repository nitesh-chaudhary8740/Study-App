import React, {  useContext, useState } from "react";
import { StudyContext } from "./StudyContext.js";

import "./css/PublisherDashboard.css";
import axios from "axios";
import UploadCourse from "./UploadCourse";

function PublisherDashboard() {
  const values = useContext(StudyContext);

  const [mode, setMode] = useState("dashboard"); // "dashboard" | "upload" | "loading"

  const registerAsPublisher = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/user/publisher-register",
        {},
        { withCredentials: true }
      );
      const data = response.data.data;
      values.setCurrentUser(data);
    } catch (error) {
      console.log(error);
    }
  };
  


  if (!(values?.currentUser?.isPublisher)) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h1 className="dashboard-title">Become a course publisher!</h1>
          <button className="btn-logout" onClick={registerAsPublisher}>
            Register
          </button>
        </div>
      </div>
    );
  }

  // Mode: Loading
  if (mode === "loading") {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2 className="dashboard-title">Uploading...</h2>
          <div className="loading-bar"></div>
        </div>
      </div>
    );
  }

  // Mode: Upload Form
  if (mode === "upload") {
    return (
      <UploadCourse
        onCancel={() => setMode("dashboard")}
        onStartUpload={() => setMode("loading")}
        onFinishUpload={() => setMode("dashboard")}
      />
    );
  }

  // Mode: Dashboard
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Publisher Dashboard</h1>
        <button className="btn-logout" onClick={() => setMode("upload")}>
          Upload Course +
        </button>
        <div style={{ marginTop: "20px" }}>
          <h3>Your Published Courses</h3>
          <p>Course list will appear here...</p>
        </div>
      </div>
    </div>
  );
}
export default PublisherDashboard;
