import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./css/manage-course.css";
import ModuleList from "./ModuleList";
import UploadProgressBar from "./UploadProgressBar";

const ManageCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null); // file to upload

  const [newModule, setNewModule] = useState({
    moduleTitle: "",
    moduleFile: null,
  });
  const [filePreview, setFilePreview] = useState(null);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8081/user/manage-course/${courseId}`,
          { withCredentials: true }
        );
        setCourse(res.data.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch course details");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Delete module
  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    try {
      const res = await axios.delete(
        `http://localhost:8081/user/manage-course/${courseId}/delete-module/${moduleId}`,
        { withCredentials: true }
      );
      setCourse(res.data.data);
      toast.success("Module deleted");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete module");
    }
  };

  if (loading) return <p className="loading-text">Loading course...</p>;

  return (
    <div className="manage-course-container">
      <button
        className="btn btn-secondary"
        onClick={() => navigate("/publisher-dashboard")}
      >
        ← Back to Dashboard
      </button>
      <h1>Manage Course: {course?.courseName}</h1>

      {/* --- Modules Section --- */}
      <div className="module-section">
        <h2>Modules</h2>
        <ModuleList modules={course?.courseModules} onDeleteModule={handleDeleteModule} />
      </div>

      {/* --- Add Module Form --- */}
      {!uploading ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newModule.moduleTitle || !newModule.moduleFile) {
              toast.error("Module title and file are required");
              return;
            }
            setUploadFile(newModule.moduleFile);
            setUploading(true);
          }}
          className="add-module-form"
        >
          <h3>Add New Module</h3>
          <input
            type="text"
            placeholder="Module Title"
            value={newModule.moduleTitle}
            onChange={(e) =>
              setNewModule({ ...newModule, moduleTitle: e.target.value })
            }
            required
          />
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files[0]) {
                setNewModule({ ...newModule, moduleFile: e.target.files[0] });
                setFilePreview(e.target.files[0].name);
              }
            }}
            accept="video/*,application/pdf,.doc,.docx"
            required
          />
          {filePreview && <p>Selected file: {filePreview}</p>}
          <button type="submit" className="btn btn-primary">
            Add Module
          </button>
        </form>
      ) : (
        // Show Upload Progress Bar when uploading
        <UploadProgressBar
          file={uploadFile}
          courseId={courseId}
          moduleTitle={newModule.moduleTitle}
          onUploadComplete={(updatedCourse) => {
            setCourse(updatedCourse);
            setNewModule({ moduleTitle: "", moduleFile: null });
            setFilePreview(null);
            setUploading(false);
          }}
          onUploadCancel={() => setUploading(false)}
        />
      )}
    </div>
  );
};

export default ManageCourse;
