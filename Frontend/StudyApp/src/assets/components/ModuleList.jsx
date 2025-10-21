// ModuleList.jsx
import React from "react";
import "./css/button.css"

const ModuleList = ({ modules, onDeleteModule }) => {
  if (!modules || !modules.length) return <p>No modules yet.</p>;

  return (
    <div className="module-list">
      {modules
        .sort((a, b) => a.moduleOrder - b.moduleOrder)
        .map((mod) => (
          <div key={mod._id} className="module-card">
            <h3>{mod.moduleTitle}</h3>
            <p>Duration: {mod.moduleDuration} min</p>

            {mod.moduleFile ? (
              mod.moduleFileType === "video" ? (
                <video
                  src={mod.moduleFile}
                  controls
                  style={{ maxWidth: "50%", marginTop: "8px" }}
                />
              ) : (
                <p className="media-status">
                  📎{" "}
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
                onClick={() => onDeleteModule(mod._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ModuleList;
