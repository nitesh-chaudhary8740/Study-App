import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./css/manage-course.css";
import ModuleList from "./ModuleList";
    import {UploadProgressBar} from "./UploadProgressBar";

const ManageCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [courseImg, setCourseImg] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadFile, setUploadFile] = useState(null); // file to upload
    const [isSubmitting, setIsSubmitting] = useState(false); // State to prevent double click

    const [newModule, setNewModule] = useState({
        moduleTitle: "",
        moduleFile: null,
    });
    const [filePreview, setFilePreview] = useState(null);

    // Fetch course data
    const fetchCourse = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8081/user/manage-course/${courseId}`,
                    { withCredentials: true }
                );
                const fetchedCourse = { ...res.data.data, courseModules: res.data.data.courseModules || [] };
                setCourse(fetchedCourse); 
            } catch (err) {
                console.log(err);
                toast.error("Failed to fetch course details");
            } finally {
                setLoading(false);
            }
        };
    useEffect(() => {
        fetchCourse();
    }, []);

    // Delete module (NOTE: Using window.confirm for now, though a custom modal is better)
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

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        // Prevent submission if already processing
        if (isSubmitting) return;

        if (!newModule.moduleTitle || !newModule.moduleFile) {
            toast.error("Module title and file are required");
            return;
        }

        // 1. Immediately block future clicks (Fix for double-request)
        setIsSubmitting(true);
        
        // 2. Start the upload process (renders UploadProgressBar)
        setUploadFile(newModule.moduleFile);
        setUploading(true);
    }

    // Handlers for UploadProgressBar completion/cancellation
    const handleUploadComplete = (updatedCourse) => {
        setCourse(updatedCourse);
        setNewModule({ moduleTitle: "", moduleFile: null });
        setFilePreview(null);
        setUploading(false);
        setIsSubmitting(false); // Reset submitting state
    };
    const handleUploadCoverImage = async ()=>{
        try {
            const formdata = new FormData();
            formdata.append("coverImage",courseImg)
            console.log(courseImg ,typeof courseImg)
            const response = await axios.post(`http://localhost:8081/user/manage-course/update-image/${courseId}`,formdata,{withCredentials:true})
            // console.log(response)
            setCourse(response.data.data)
            toast.success("course cover image uploaded successfully")
        } catch (error) {
           console.log("error",error) 
           toast.error("error is uploading coverimage")
        }
    }
    const handleUploadCancel = () => {
        setUploading(false);
        setIsSubmitting(false); // Reset submitting state
    };


    if (loading) return <p>Loading course...</p>;

    return (
        <div className="manage-course-container">
            <button
                className="btn btn-back"
                onClick={() => navigate("/publisher-dashboard")}
            >
                ← Back to Dashboard
            </button>
            <h1>Manage Course: {course?.courseName || "Loading..."}</h1>
            <div className="course-image-section">
                {
                    course.courseCoverImage?
                    <img src={course.courseCoverImage}></img>:
                    <span>Course image has not uploaded</span>
                }
                {
                    <h2>
                        Upload Course Image
                        <input type="file" onChange={(e)=>{
                        setCourseImg(e.target.files[0])
                        }} />
                        <button onClick={handleUploadCoverImage}>Upload Image</button>
                    </h2>
                }
            </div>
            {/* --- Modules Section --- */}
            <div className="module-section">
                <h2>Modules</h2>
                <ModuleList modules={course?.courseModules || []} onDeleteModule={handleDeleteModule} />
            </div>

            {/* --- Add Module Form or Progress Bar --- */}
            <div className="add-module-form-wrapper">
                <h3>Add New Module</h3>
                {!uploading ? (
                    <form
                        onSubmit={handleFormSubmit}
                        className="module-form"
                    >
                        <input
                            type="text"
                            placeholder="Module Title"
                            value={newModule.moduleTitle}
                            onChange={(e) =>
                                setNewModule({ ...newModule, moduleTitle: e.target.value })
                            }
                            required
                            disabled={isSubmitting}
                            className="text-input"
                        />
                        <div className="file-input-group">
                            <label className="file-label">
                                <span className="sr-only">Choose File</span>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        if (e.target.files[0]) {
                                            setNewModule({ ...newModule, moduleFile: e.target.files[0] });
                                            setFilePreview(e.target.files[0].name);
                                        } else {
                                            setFilePreview(null);
                                            setNewModule({ ...newModule, moduleFile: null });
                                        }
                                    }}
                                    accept="video/*,application/pdf,.doc,.docx"
                                    required
                                    disabled={isSubmitting}
                                    className="file-input"
                                />
                            </label>
                        </div>
                        
                        {filePreview && <p className="file-preview-text">Selected file: <span className="file-name">{filePreview}</span></p>}
                        
                        <button 
                            type="submit" 
                            className="btn btn-submit"
                            disabled={isSubmitting || !newModule.moduleFile} 
                        >
                            {isSubmitting ? 'Processing...' : 'Add Module'}
                        </button>
                    </form>
                ) : (
                    // Show Upload Progress Bar when uploading
                    <UploadProgressBar
                        fetchCourse={fetchCourse}
                        file={uploadFile}
                        courseId={courseId}
                        moduleTitle={newModule.moduleTitle}
                        onUploadComplete={handleUploadComplete}
                        onUploadCancel={handleUploadCancel}
                    />
                )}
            </div>
        </div>
    );
};

export default ManageCourse;
