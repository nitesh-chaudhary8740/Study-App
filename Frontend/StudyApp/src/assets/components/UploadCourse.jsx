import React, { useState } from "react";
import axios from "axios";
import "./upload-course.css";
import "./button.css";

const UploadCourse = ({ onCancel, onStartUpload, onFinishUpload }) => {
  const [courseData, setCourseData] = useState({
    courseName: "",
    coursePrice: "",
    courseCategory: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      onStartUpload();
      await axios.post("http://localhost:8081/admin/upload-course", courseData, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    } finally {
      onFinishUpload();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Upload Course</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="courseName"
              placeholder="Course Name"
              value={courseData.courseName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="coursePrice"
              placeholder="Course Price"
              value={courseData.coursePrice}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <select
              name="courseCategory"
              value={courseData.courseCategory}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option>IT & Software</option>
              <option>Business</option>
              <option>Marketing</option>
              <option>Personal Development</option>
              <option>Photo and Video Editing</option>
              <option>AI Courses</option>
            </select>
          </div>
          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              Upload
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadCourse;
