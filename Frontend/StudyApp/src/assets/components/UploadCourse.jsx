import React, { useState } from "react";
import axios from "axios";
import "./css/upload-course.css";
import "./css/button.css";

const categories = [
  "IT & Software",
  "Business",
  "Marketing",
  "Personal Development",
  "Photo and Video Editing",
  "AI Courses",
];

const UploadCourse = ({ onCancel, onStartUpload, onFinishUpload }) => {
  const [courseData, setCourseData] = useState({
    courseName: "",
    coursePrice: "",
    courseCategory: "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const handleCategorySelect = (category) => {
    setCourseData((prev) => ({ ...prev, courseCategory: category }));
    setIsDropdownOpen(false);
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

          {/* Custom Dropdown */}
          <div className="form-group custom-dropdown">
            <div
              className="dropdown-selected"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {courseData.courseCategory || "Select Category"}
              <span className="arrow">{isDropdownOpen ? "▲" : "▼"}</span>
            </div>
            {isDropdownOpen && (
              <ul className="dropdown-list">
                {categories.map((cat, index) => (
                  <li
                    key={index}
                    onClick={() => handleCategorySelect(cat)}
                    className={`dropdown-item ${
                      courseData.courseCategory === cat ? "active" : ""
                    }`}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
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
