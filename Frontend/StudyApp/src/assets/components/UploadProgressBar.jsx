import "./css/upload-progress-bar.css";
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { formatBytes } from "./util.functions.js";

// Helper function to format bytes into readable MB/GB


export const UploadProgressBar = ({course,fetchCourse, file, courseId, moduleTitle, onUploadComplete, onUploadCancel }) => {
    const [uploadStatus, setUploadStatus] = useState({
        progress: 0, 
        bytesUploaded: 0, 
        totalSize: file.size, 
        isDone: false
    });
    const controllerRef = useRef(null);
    const eventStreamRef = useRef(null)

    const startSSEConnection = (uploadId) => {
        const sseRoute = `http://localhost:8081/user/manage-course/${courseId}/sse/upload-status/${uploadId}`;
        const eventSource = new EventSource(sseRoute);
        eventStreamRef.current = eventSource;
        
        eventSource.onerror = (error) => {
            console.error("Event stream closed due to error:", error);
            eventSource.close();
            onUploadCancel();
        }
        
        eventSource.onmessage = (event) => { 
            try {
                const parsedData = JSON.parse(event.data);
                
                // CRITICAL FIX: Update the full status object (handles 'progress' typo fix)
                setUploadStatus(prev => ({
                    ...prev,
                    ...parsedData,
                    totalSize: prev.totalSize // Preserve client-side totalSize until server sends final total
                }));
                
                if (parsedData.isDone) {
                    toast.success("Module added successfully!");
                    eventSource.close();
                    fetchCourse()
                    onUploadComplete(parsedData.data);
                }
            } catch (e) {
                console.error("Error parsing SSE JSON or processing data:", e, event.data);
                eventSource.close();
                onUploadCancel();
            }
        };
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("moduleTitle", moduleTitle);
        formData.append("moduleFile", file);
        formData.append("moduleOrder",course.courseModules.length||0)

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
                    'axios-retry': { retries: 0 }, 
                    timeout: 300000, 
                }
            );
            
            const uploadId = res.data.data;
            startSSEConnection(uploadId);
            
            // CRITICAL FIX: Removed premature onUploadComplete call.
        } catch (err) {
            if (err.name === "CanceledError" || (axios.isCancel(err))) {
                toast.info("Upload canceled by user.");
            } else {
                console.error("Upload failed:", err);
                const message = err.response ? err.response.data.message : 'Server connection lost.';
                toast.error(`Upload failed: ${message}`);
            }
            onUploadCancel(); 
        }
    };

    const handleCancel = () => {
        if (controllerRef.current) controllerRef.current.abort();
        if (eventStreamRef.current) eventStreamRef.current.close();
        onUploadCancel();
    };

    useEffect(() => {
        if (!controllerRef.current) {
            handleUpload();
        }
        
        return () => {
             if (eventStreamRef.current) eventStreamRef.current.close();
        };
    }, []);

    const currentProgress = parseFloat(uploadStatus.progress) || 0;
    const uploadedMB = formatBytes(uploadStatus.bytesUploaded || 0, 2);
    const totalMB = formatBytes(uploadStatus.totalSize || file.size, 2);

    return (
        <div className="upload-container">
            <h4>Uploading: {moduleTitle}</h4>
            
            {/* Display Upload Status (Done/Total Size) */}
            <div className="file-info">
                Uploaded: 
                <span className="file-size-status">
                    {uploadedMB} / {totalMB}
                </span>
            </div>
            
            <div className="progress-wrapper">
                <div 
                    className="progress-bar" 
                    style={{ width: `${currentProgress}%` }}
                >
                    {/* Display Percentage on the right side */}
                    <div className="progress-percent">{Math.floor(currentProgress)}%</div>
                </div>
            </div>
            
            <button 
                className="btn btn-danger" 
                onClick={handleCancel}
                disabled={uploadStatus.isDone}
            >
                {uploadStatus.isDone ? "Complete" : "Cancel Upload"}
            </button>
        </div>
    );
};

