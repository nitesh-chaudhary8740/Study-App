import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./css/PublisherDashboard.css";

function PublishedCoursesList({ courses, onCourseDeleted }) {
  const navigate = useNavigate();

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`http://localhost:8081/course/${courseId}`, {
        withCredentials: true,
      });
      toast.success("Course deleted successfully!");
      onCourseDeleted && onCourseDeleted(courseId);
    } catch (error) {
      toast.error("Failed to delete course.");
      console.error(error);
    }
  };

  const handleManage = (courseId) => {
    navigate(`/publisher-dashboard/manage/${courseId}`);
  };

  return (
    <div className="published-courses-section">
      <h3>Your Published Courses</h3>

      {courses?.length > 0 ? (
        <div className="published-course-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              {/* --- Course Image --- */}
              <img
                src={
                  course.courseCoverImage ||
                  "https://via.placeholder.com/300x140?text=Course+Image"
                }
                alt={course.courseName}
                className="course-card-image"
              />

              {/* --- Course Info --- */}
              <div className="course-card-content">
                <h4 className="course-card-title">{course.courseName}</h4>
                <p className="course-card-desc">
                  {course.courseCategory || "No category"}
                </p>

                <div className="course-card-meta">
                  <span className="price">${course.coursePrice || "Free"}</span>
                  <span className="students">
                    👩‍🎓 {course.totalPurchases || 0} students
                  </span>
                </div>

                {/* --- Action Buttons --- */}
                <div className="course-card-actions">
                  <button
                    className="btn-manage"
                    onClick={() => handleManage(course._id)}
                  >
                    Manage
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No courses published yet.</p>
      )}
    </div>
  );
}

export default PublishedCoursesList;
