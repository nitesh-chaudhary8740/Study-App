import React, { useState } from "react";
import axios from "axios";
import "./css/upload-course.css";
import "./css/button.css";
import { toast } from "react-toastify";

const categories = [
  "IT & Software",
  "Business",
  "Marketing",
  "Personal Development",
  "Photo and Video Editing",
  "AI Courses",
];

const UploadCourse = ({ onCancel, onStartUpload, onFinishUpload,fetchCourses }) => {
  const [courseData, setCourseData] = useState({
    courseName: "",
    coursePrice: "",
    courseCategory: "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle category select
  const handleCategorySelect = (category) => {
    setCourseData((prev) => ({ ...prev, courseCategory: category }));
    setIsDropdownOpen(false);
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      onStartUpload();
      await axios.post("http://localhost:8081/user/upload-course", courseData, {
        withCredentials: true,
      });
      toast.success("Course uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload course.");
    } finally {
     await fetchCourses();
      onFinishUpload();
    }
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
              required
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="coursePrice"
              placeholder="Course Price"
              value={courseData.coursePrice}
              onChange={handleChange}
              required
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
              <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Upload
            </button>
          
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadCourse;
