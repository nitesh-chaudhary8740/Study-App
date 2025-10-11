import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./css/manage-course.css";

const ManageCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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

  // Upload new module
  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!newModule.moduleTitle || !newModule.moduleFile) {
      toast.error("Module title and file are required");
      return;
    }

    const formData = new FormData();
    formData.append("moduleTitle", newModule.moduleTitle);
    formData.append("moduleFile", newModule.moduleFile);

    try {
      setUploading(true);
      const res = await axios.post(
        `http://localhost:8081/user/manage-course/${courseId}/add-module`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setCourse(res.data.data);
      setNewModule({ moduleTitle: "", moduleFile: null });
      setFilePreview(null);
      toast.success("Module added successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to add module");
    } finally {
      setUploading(false);
    }
  };

  // Delete module
  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    try {
      const res = await axios.delete(
        `http://localhost:8081/course/${courseId}/module/${moduleId}`,
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
        {course?.courseModules?.length ? (
          <div className="module-list">
            {course.courseModules
              .sort((a, b) => a.moduleOrder - b.moduleOrder)
              .map((mod) => (
                <div key={mod._id} className="module-card">
                  <h3>{mod.moduleTitle}</h3>

                  {mod.moduleContent ? (
                    <p className="media-status">📎 Media uploaded</p>
                  ) : (
                    <p className="media-status missing">No media yet</p>
                  )}

                  <div className="module-actions">
                    <button
                      onClick={() => handleDeleteModule(mod._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p>No modules yet. Add your first module below.</p>
        )}
      </div>

      {/* --- Add Module Form --- */}
      <form onSubmit={handleAddModule} className="add-module-form">
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
        <button type="submit" className="btn btn-primary" disabled={uploading}>
          {uploading ? "Uploading..." : "Add Module"}
        </button>
      </form>
    </div>
  );
};

export default ManageCourse;
