import React, {  useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./css/upload-progress-bar.css";
import { useState } from "react";
import { useEffect } from "react";

// =============================================================
const UploadProgressBar = ({ file, courseId, moduleTitle, onUploadComplete, onUploadCancel }) => {
    const [progress, setProgress] = useState(0); 
    const controllerRef = useRef(null);

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("moduleTitle", moduleTitle);
        formData.append("moduleFile", file);

        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            const res = await axios.post(
                `http://localhost:8081/user/manage-course/${courseId}/add-module`,
                formData,
                {
                    signal: controller.signal,
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                    
                    // CRITICAL FIX: Explicitly disable retries 
                    'axios-retry': { retries: 0 }, 
                    timeout: 300000, // 5 minute timeout

                   
                }
            );
            
            toast.success("Module added successfully!");
            onUploadComplete(res.data.data); 

        } catch (err) {
            if (err.name === "CanceledError" || (axios.isCancel(err))) {
                toast.info("Upload canceled by user.");
            } 
            else {
                console.error("Upload failed (Client-side error log):", err);
                if (err.response) {
                    toast.error(`Upload failed: ${err.response.data.message || 'Server error.'}`);
                } 
                else {
                    toast.error("Upload failed! Server connection lost.");
                }
            }
            onUploadCancel(); // Reset the UI
        }
    };

    const handleCancel = () => {
        if (controllerRef.current) controllerRef.current.abort();
    };

    // Start upload automatically when component mounts
    useEffect(() => {
      if(controllerRef.current) return;
        handleUpload();
    }, []);

    return (
        <div className="upload-container">
            <h4>Uploading: {moduleTitle}</h4>
            <div className="file-info">
                File Size: <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
            
            <div className="progress-wrapper">
                <div 
                    className="progress-bar" 
                    style={{ width: `${progress}%` }}
                >
                    <div className="progress-percent">{progress}%</div>
                </div>
            </div>
            
            <button 
                className="btn btn-danger" 
                onClick={handleCancel}
            >
                Cancel Upload
            </button>
        </div>
    );
};

export default UploadProgressBar;
