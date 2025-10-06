import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/manage-course.css";
import { toast } from "react-toastify";

const ManageCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newModule, setNewModule] = useState({ moduleTitle: "", moduleDuration: "", moduleContent: "" });
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/course/${courseId}`, { withCredentials: true });
        setCourse(res.data.data);
      } catch (err) {
         console.log(err)
        toast.error("Failed to fetch course details");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // ✅ Upload or Replace Media
  const handleMediaUpload = async (moduleId, file) => {
    const formData = new FormData();
    formData.append("media", file);

    try {
      setUploading(true);
      await axios.post(
        `http://localhost:8081/course/${courseId}/module/${moduleId}/upload-media`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Media uploaded successfully");
      window.location.reload(); // quick refresh (you can optimize later)
    } catch (err) {
         console.log(err)
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Add new module
  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8081/course/${courseId}/module`,
        newModule,
        { withCredentials: true }
      );
      setCourse(res.data.data);
      setNewModule({ moduleTitle: "", moduleDuration: "", moduleContent: "" });
      toast.success("Module added");
    } catch (err) {
         console.log(err)
      toast.error("Failed to add module");
    }
  };

  // ✅ Delete module
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
        console.log(err)
      toast.error("Failed to delete module");
    }
  };

  if (loading) return <p className="loading-text">Loading course...</p>;

  return (
    <div className="manage-course-container">
      <h1>Manage Course: {course?.courseName}</h1>
      <button className="btn btn-secondary" onClick={() => navigate("/publisher-dashboard")}>
        ← Back to Dashboard
      </button>

      <div className="module-section">
        <h2>Modules</h2>
        {course?.courseModules?.length ? (
          <div className="module-list">
            {course.courseModules.map((mod) => (
              <div key={mod._id} className="module-card">
                <h3>{mod.moduleTitle}</h3>
                <p>Duration: {mod.moduleDuration} min</p>
                <p>{mod.moduleContent}</p>

                {mod.moduleMedia ? (
                  <p className="media-status">📎 Media uploaded</p>
                ) : (
                  <p className="media-status missing">No media yet</p>
                )}

                <div className="module-actions">
                  <label className="upload-label">
                    {uploading ? "Uploading..." : "Upload / Replace Media"}
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleMediaUpload(mod._id, e.target.files[0])}
                      accept="video/*,application/pdf,.doc,.docx"
                    />
                  </label>
                  <button onClick={() => handleDeleteModule(mod._id)} className="btn btn-danger">
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

      <form onSubmit={handleAddModule} className="add-module-form">
        <h3>Add New Module</h3>
        <input
          type="text"
          placeholder="Module Title"
          value={newModule.moduleTitle}
          onChange={(e) => setNewModule({ ...newModule, moduleTitle: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Duration (min)"
          value={newModule.moduleDuration}
          onChange={(e) => setNewModule({ ...newModule, moduleDuration: e.target.value })}
        />
        <textarea
          placeholder="Module Content / Description"
          value={newModule.moduleContent}
          onChange={(e) => setNewModule({ ...newModule, moduleContent: e.target.value })}
        />
        <button type="submit" className="btn btn-primary">Add Module</button>
      </form>
    </div>
  );
};

export default ManageCourse;
