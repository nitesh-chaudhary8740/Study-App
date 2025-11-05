import React, { useContext, useEffect, useState } from "react";
import { StudyContext } from "./StudyContext.js";
import "./css/PublisherDashboard.css";
import axios from "axios";
import UploadCourse from "./UploadCourse";
import { Navigate } from "react-router-dom";
import PublishedCoursesList from "./PublishCoursesList.jsx";
// import PublishedCoursesList from "./PublishedCoursesList";

function PublisherDashboard() {
  const values = useContext(StudyContext);
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [mode, setMode] = useState("dashboard"); // "dashboard" | "upload" | "loading"

  // ✅ Fetch publisher's courses
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/user/fetch-courses",
          { withCredentials: true }
        );
        console.log(response.data.data);
        setPublishedCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
  useEffect(() => {
  
    if (values?.currentUser?.isPublisher) {
      fetchCourses();
    }
  }, [values.currentUser]);

  // ✅ Register as publisher
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

  // ✅ Redirect if not logged in
  if (!values?.currentUser) {
    return <Navigate to="/" replace />;
  }

  // ✅ If not publisher, show registration option
  if (!values?.currentUser?.isPublisher) {
    return (
      <div className="publisher-dashboard-container">
        <div className="publisher-dashboard-card">
          <h1 className="publisher-dashboard-title">
            Become a course publisher!
          </h1>
          <p className="publisher-dashboard-subtitle">
            Start creating and managing your own courses today.
          </p>
          <button className="btn-primary" onClick={registerAsPublisher}>
            Register as Publisher
          </button>
        </div>
      </div>
    );
  }

  // ✅ Loading mode
  if (mode === "loading") {
    return (
      <div className="publisher-dashboard-container">
        <div className="publisher-dashboard-card">
          <h2 className="publisher-dashboard-title">Uploading...</h2>
          <div className="publisher-loading-bar"></div>
        </div>
      </div>
    );
  }

  // ✅ Upload mode
  if (mode === "upload") {
    return (
      <UploadCourse
      fetchCourses ={fetchCourses}
        onCancel={() => setMode("dashboard")}
        onStartUpload={() => setMode("loading")}
        onFinishUpload={() => setMode("dashboard")}
      />
    );
  }

  // ✅ Main dashboard
  return (
    <div className="publisher-dashboard-container">
      <div className="publisher-dashboard-card">
        <h1 className="publisher-dashboard-title">Publisher Dashboard</h1>

        <button className="btn-primary" onClick={() => setMode("upload")}>
          Upload Course +
        </button>

        <PublishedCoursesList
          courses={publishedCourses}
          fetchCourses={fetchCourses}
        />
      </div>
    </div>
  );
}

export default PublisherDashboard;
