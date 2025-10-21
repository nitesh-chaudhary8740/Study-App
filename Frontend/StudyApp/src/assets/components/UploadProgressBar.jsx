import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./css/upload-progress-bar.css";

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
      await axios.post(
        `http://localhost:8081/user/manage-course/${courseId}/add-module`,
        formData,
        {
          signal: controller.signal,
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {

            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          },
        }
      ).then(res => onUploadComplete(res.data.data));
    } catch (err) {
      if (err.name === "CanceledError") {
        toast.info("Upload canceled!");
        onUploadCancel();
      } else {
        console.error(err);
        toast.error("Upload failed!");
        onUploadCancel();
      }
    }
  };

  const handleCancel = () => {
    if (controllerRef.current) controllerRef.current.abort();
  };

  // Start upload automatically when component mounts
  React.useEffect(() => {
    handleUpload();
  }, []);

  return (
    <div className="upload-container">
      <div className="file-size">{`${(file.size / (1024 * 1024)).toFixed(2)} MB`}</div>
      <div className="progress-wrapper">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        <div className="progress-percent">{progress}%</div>
      </div>
      <button className="btn btn-danger" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
};

export default UploadProgressBar;
