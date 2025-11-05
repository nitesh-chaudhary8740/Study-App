import axios from 'axios';
import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify';

function ManageCourseCoverImage({course,setCourse,courseId}) {
    const [coverImageFile, setCoverImageFile] = useState(null); 
    const [coverImageName, setCoverImageName] = useState(""); 
    const [isSubmitting,setIsSubmitting] = useState(false)
    const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState(null); 
    const imageFileInputRef = useRef(null)
    const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
        if(coverImagePreviewUrl){
            URL.revokeObjectURL(coverImagePreviewUrl);
        }
        if (file) {
            setCoverImageFile(file);
            setCoverImageName(file.name);
            
            // 2. Create new preview URL (correct syntax)
            const previewURL = URL.createObjectURL(file);
            setCoverImagePreviewUrl(previewURL)
        } else {
            setCoverImageFile(null);
            setCoverImageName("");
            setCoverImagePreviewUrl(null);
        }
    };

    // Handler for uploading the cover image
    const handleUploadCoverImage = async () => {
        if (!coverImageFile ||isSubmitting) return;
        setIsSubmitting(true)
        try {
            const formdata = new FormData();
            formdata.append("coverImage", coverImageFile);
            const response = await axios.post(
                `http://localhost:8081/user/manage-course/update-image/${courseId}`,
                formdata,
                { withCredentials: true }
            );
            
            setCourse(response.data.data);
            setCoverImageName(""); 
            toast.success("Course cover image uploaded successfully");

        } catch (error) {
            console.error("error", error);
            const errorMessage = error.response?.data?.message || "Error uploading cover image";
            toast.error(errorMessage);
        } finally { 
            setCoverImageFile(null); // Clear file data
            setIsSubmitting(false)
            if (coverImagePreviewUrl) {
                 URL.revokeObjectURL(coverImagePreviewUrl);
            }
            setCoverImagePreviewUrl(null); // Clear preview URL state
            
            // Reset native input so the user can select the same file again
            // const input = document.getElementById('coverImageInput');
            // if(input) input.value = ''; 
            if(imageFileInputRef.current) imageFileInputRef.current.value=""
        }
    };
  return (
     <div className="course-image-section">
                <h2>Upload Course Image</h2>
                <div className="image-preview-wrapper">
                    
                    {/* Image Preview: Use local URL if available, otherwise use remote URL */}
                    {(coverImagePreviewUrl || course?.courseCoverImage) ? (
                        <img 
                            src={coverImagePreviewUrl || course?.courseCoverImage} 
                            alt={`${course.courseName} cover`} 
                            className="image-preview" 
                        />
                    ) : (
                        <span className="no-image-text">No Course Image Uploaded</span>
                    )}
                    
                    <div className="image-upload-controls">
                        
                        {/* File Selection Label/Input */}
                        <label htmlFor="coverImageInput" className="file-input-label">
                            {coverImageFile ? "Change File" : "Choose Image"}
                            <input 
                                type="file" 
                                id="coverImageInput"
                                ref={imageFileInputRef}
                                accept="image/*"
                                onChange={handleCoverImageChange} 
                                disabled={isSubmitting}
                            />
                        </label>
                        
                        {/* Cancel Button (Visible only when a file is selected) */}
                        {coverImageFile && !isSubmitting && (
                            <button 
                                onClick={() => {
                                    URL.revokeObjectURL(coverImagePreviewUrl); 
                                    setCoverImageFile(null);
                                    setCoverImagePreviewUrl(null);
                                    setCoverImageName("");
                                    // const input = document.getElementById('coverImageInput');
                                    // if(input) input.value = '';
                                    if(imageFileInputRef.current) imageFileInputRef.current.value=""
                                }}
                                className="btn-cancel-file"
                            >
                                Cancel Selection
                            </button>
                        )}
                        
                        {/* Upload Button */}
                        <button 
                            onClick={handleUploadCoverImage}
                            className="upload-button"
                            disabled={!coverImageFile || isSubmitting}
                        >
                            {isSubmitting ? 'Uploading...' : 'Upload Image'}
                        </button>
                    </div>

                    {/* Display selected file name */}
                    {coverImageName && (
                        <p className="file-preview-text">
                            Selected: <span className="file-name">{coverImageName}</span>
                        </p>
                    )}
                </div>
            </div>
  )
}

export default ManageCourseCoverImage
