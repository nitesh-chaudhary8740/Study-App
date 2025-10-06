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

const UploadCourse = ({ onCancel, onStartUpload, onFinishUpload }) => {
  const [step, setStep] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [courseData, setCourseData] = useState({
    courseName: "",
    coursePrice: "",
    courseCategory: "",
    courseCoverImage: null,
    courseModules: [],
  });

  const [moduleData, setModuleData] = useState({
    moduleTitle: "",
    moduleDuration: "",
    moduleContent: "",
  });

  // ✅ Basic input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Category selection
  const handleCategorySelect = (category) => {
    setCourseData((prev) => ({ ...prev, courseCategory: category }));
    setIsDropdownOpen(false);
  };

  // ✅ Cover image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCourseData((prev) => ({ ...prev, courseCoverImage: file }));
  };

  // ✅ Add module to course
  const handleAddModule = () => {
    if (!moduleData.moduleTitle.trim()) return toast.error("Enter module title");

    setCourseData((prev) => ({
      ...prev,
      courseModules: [...prev.courseModules, moduleData],
    }));

    setModuleData({ moduleTitle: "", moduleDuration: "", moduleContent: "" });
    toast.success("Module added!");
  };

  // ✅ Publish course
  const handlePublish = async () => {
    try {
      onStartUpload();
      const formData = new FormData();
      Object.entries(courseData).forEach(([key, value]) => {
        if (key === "courseModules") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      await axios.post("http://localhost:8081/user/upload-course", formData, {
        withCredentials: true,
      });
      toast.success("Course published successfully!");
      onFinishUpload();
    } catch (error) {
      console.error(error);
      toast.error("Failed to publish course.");
      onFinishUpload();
    }
  };

  // ✅ Step navigation
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h1 className="upload-title">Upload Course (Step {step} of 3)</h1>

        {/* Step 1: Basic Details */}
        {step === 1 && (
          <div className="step">
            <input
              type="text"
              name="courseName"
              placeholder="Course Name"
              value={courseData.courseName}
              onChange={handleChange}
            />
            <input
              type="number"
              name="coursePrice"
              placeholder="Course Price"
              value={courseData.coursePrice}
              onChange={handleChange}
            />

            {/* Dropdown for Category */}
            <div className="custom-dropdown">
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
                className="btn btn-primary"
                onClick={nextStep}
                disabled={
                  !courseData.courseName ||
                  !courseData.coursePrice ||
                  !courseData.courseCategory
                }
              >
                Next →
              </button>
              <button className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Upload Cover Image */}
        {step === 2 && (
          <div className="step">
            <label className="file-label">Upload Course Cover Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />

            {courseData.courseCoverImage && (
              <img
                src={URL.createObjectURL(courseData.courseCoverImage)}
                alt="Preview"
                className="cover-preview"
              />
            )}

            <div className="button-group">
              <button className="btn btn-secondary" onClick={prevStep}>
                ← Back
              </button>
              <button
                className="btn btn-primary"
                onClick={nextStep}
                disabled={!courseData.courseCoverImage}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Add Modules */}
        {step === 3 && (
          <div className="step">
            <h3>Add Modules</h3>
            <input
              type="text"
              name="moduleTitle"
              placeholder="Module Title"
              value={moduleData.moduleTitle}
              onChange={(e) =>
                setModuleData({ ...moduleData, moduleTitle: e.target.value })
              }
            />
            <input
              type="number"
              name="moduleDuration"
              placeholder="Duration (minutes)"
              value={moduleData.moduleDuration}
              onChange={(e) =>
                setModuleData({ ...moduleData, moduleDuration: e.target.value })
              }
            />
            <textarea
              name="moduleContent"
              placeholder="Module Content / Description"
              value={moduleData.moduleContent}
              onChange={(e) =>
                setModuleData({ ...moduleData, moduleContent: e.target.value })
              }
            />
            <button className="btn btn-primary" onClick={handleAddModule}>
              + Add Module
            </button>

            {courseData.courseModules.length > 0 && (
              <ul className="module-list">
                {courseData.courseModules.map((mod, idx) => (
                  <li key={idx}>
                    <strong>{mod.moduleTitle}</strong> — {mod.moduleDuration} min
                  </li>
                ))}
              </ul>
            )}

            <div className="button-group">
              <button className="btn btn-secondary" onClick={prevStep}>
                ← Back
              </button>
              <button className="btn btn-success" onClick={handlePublish}>
                Publish Course 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCourse;
