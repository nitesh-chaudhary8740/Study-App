import axios from "axios";
import { toast } from "react-toastify";

const ModuleList = ({ modules, setCourse,courseId }) => {
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
            console.error(err);
            toast.error("Failed to delete module");
        }
    };
    if (!modules || !modules.length) return <p>No modules yet.</p>;

    return (
        <div className="module-section">
                        <h2>Modules</h2>
        <div className="module-list"> 
            {modules
                .sort((a, b) => a.moduleOrder - b.moduleOrder)
                .map((mod) => (
                    <div key={mod._id} className="module-card">
                        <h3>{mod.moduleTitle}</h3>
                        <p>Duration: {mod.moduleDuration} min</p>
                        <p>Duration: {mod.moduleOrder} min</p>

                        {mod.moduleFile ? (

                            mod.moduleFileType === "video" ? (
                                <button className="video-file-preview-buttons">video</button>
                                // <video
                                //     src={mod.moduleFile}
                                //     controls
                                //     style={{ maxWidth: "100%", height: "auto" }}
                                // />
                            ) : (
                                <p className="media-status">
                                    <span className="mr-2">📎</span>
                                    <a href={mod.moduleFile} target="_blank" rel="noreferrer">
                                        View / Download File
                                    </a>
                                </p>
                            )
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
        </div>
    );
};


export default ModuleList;
