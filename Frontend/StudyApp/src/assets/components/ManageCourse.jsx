import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./css/manage-course.css";
import ModuleList from "./ModuleList";
import { UploadProgressBar } from "./UploadProgressBar";
import AddModuleForm from "./AddModuleForm";
import ManageCourseCoverImage from "./ManageCourseCoverImage";

const ManageCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    //course states
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true); 
    // Cover Image States
    useEffect(() => {
        const fetchCourse = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8081/user/manage-course/${courseId}`,
                { withCredentials: true }
            );
            const fetchedCourse = { ...res.data.data, courseModules: res.data.data.courseModules || [] };
            setCourse(fetchedCourse);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch course details");
        } finally {
            setLoading(false);
        }
    };
        fetchCourse();
    }, [courseId]);

    if (loading) return <p className="loading-text">Loading course...</p>;
    return (
        <div className="manage-course-container">
            <button
                className="btn btn-back"
                onClick={() => navigate("/publisher-dashboard")}
            >
                ← Back to Dashboard
            </button>
            <h1>Manage Course: {course?.courseName || "Course"}</h1>
          
        <ManageCourseCoverImage course={course} setCourse={setCourse} courseId={courseId}/>  {/* --- Course Image Section --- */}
         
        <ModuleList modules={course?.courseModules || []}  />   {/* --- Modules Section --- */}
          
        <AddModuleForm />{/* --- Add Module Form  --- */}
                
                    {/* <UploadProgressBar
                    course={course}
                        fetchCourse={fetchCourse}
                        file={uploadFile}
                        courseId={courseId}
                        moduleTitle={newModule.moduleTitle}
                        onUploadComplete={handleUploadComplete}
                        onUploadCancel={handleUploadCancel}
                    /> */}
                
            </div>
        
    );
};

export default ManageCourse;