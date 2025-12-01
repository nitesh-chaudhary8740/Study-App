import React, { useState } from 'react';
import { Pencil, FileText, Trash, ChevronDown, ChevronUp, Plus, Replace } from "lucide-react";
import "./css/ModuleList.css";
import { inputOnChange } from './util.functions';
// NOTE: Assuming API and onUpdateModule are passed down from a parent component.

// --- ModuleItem Component ---
const ModuleItem = ({ mod, onDeleteModule, onUpdateModule }) => {
    // State for UI toggles
    const [isEditing, setIsEditing] = useState(false);
    const [selectedModule,setSelectedMoudle] = useState(null)
    const [isExpanded, setIsExpanded] = useState(false);
    const [editData, setEditData] = useState({
        moduleTitle:"",
        moduleDescription:""
    });
    
    

    return (
        <div key={mod._id} className={`module-card ${isExpanded ? 'expanded' : ''} ${isEditing ? 'editing' : ''}`}>
            
            {/* MODULE TOP SECTION (Title and Action Icons) */}
            <div className="module-top-cont flex-bw">
                <span className="module-top-left flex-bw">
                    <span className="module-order-title flex">
                        {mod.moduleOrder + 1}.
                        <FileText size={20} strokeWidth={1} className="module-icon" />
                        
                        {/* Title Field/Text */}
                        {isEditing ? (
                            <input 
                                type="text"
                                name="moduleTitle"
                                value={editData.moduleTitle}
                                onChange={inputOnChange(setEditData)}
                                className="module-title-input"
                            />
                        ) : (
                            <span className="module-title-text">{editData.moduleTitle}</span>
                        )}
                    </span>
                </span>
            
                {/* BUTTONS (Disabled when editing) */}
                <span className="module-top-section-buttons">
                    <span className="flex">
                        {/* PENCIL: Disabled when isEditing is true */}
                        <button 
                            className="icon-btn edit-btn" 
                            onClick={() => setIsEditing(true)} 
                            title="Edit Module"
                            disabled={isEditing}
                        >
                            <Pencil size={18} strokeWidth={3} />
                        </button>
                        {/* TRASH: Disabled when isEditing is true */}
                        <button 
                            className="icon-btn delete-btn" 
                            onClick={() => onDeleteModule(mod._id)} 
                            title="Delete Module"
                            disabled={isEditing}
                        >
                            <Trash size={20} strokeWidth={3} />
                        </button>
                    </span> 
                    {/* CHEVRON: Disabled when isEditing is true */}
                    <button 
                        className="icon-btn expand-btn" 
                        onClick={() => setIsExpanded(!isExpanded)} 
                        title="Toggle Details"
                        disabled={isEditing}
                    >
                        {/* <D size={20} strokeWidth={2} /> */}
                    </button>
                </span>
            </div>
            
            {/* EXPANDABLE/EDITABLE CONTENT SECTION */}
            {/* When editing, only the Title and Description are rendered inside the card, 
                and the File section is explicitly hidden, as requested. */}
            {(isExpanded || isEditing) && (
                <>
                    {/* FILE/UPLOAD SECTION: HIDDEN when isEditing is true */}
                    {!isEditing && ( 
                        <div className="module-file-section flex-bw">
                            <span className="module-add flex">
                                <span className="file-status-label">File:</span> 
                                
                                {/* DURATION (Conditional) */}
                                {mod.moduleFile && <span className="module-duration">{editData.moduleDuration}</span>}

                                {/* FILE NAME / UPLOAD BUTTON */}
                                {mod.moduleFile ? (
                                    <span className="file-name-display">{  "file name"}</span>
                                ) : (
                                    <label htmlFor={`file-upload-${mod._id}`} className="upload-label flex" title="Add File">
                                        <Plus size={16} strokeWidth={2} />
                                        Add File
                                    </label>
                                )}

                                {/* HIDDEN INPUT */}
                                <input 
                                    id={`file-upload-${mod._id}`} 
                                    type="file" 
                                    // onChange={handleFileChange}
                                    className="hidden-input-file" 
                                    disabled={!isEditing}
                                />
                            </span>
                            
                            {/* FILE ACTIONS (Conditional) */}
                            {mod.moduleFile && (
                                <span className="file-action-buttons flex">
                                    <label htmlFor={`file-upload-${mod._id}`} className="icon-btn file-replace-btn flex" title="Replace File">
                                        Replace <Replace size={16} strokeWidth={2} />
                                    </label>
                                    <button className="icon-btn file-delete-btn flex"  title="Delete File">
                                        Delete <Trash size={16} strokeWidth={2} />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}

                    {/* DESCRIPTION SECTION (Always visible when expanded or editing) */}
                    <div className="module-description">
                        <strong>Description: </strong>
                        {isEditing ? (
                            <textarea
                                name="moduleDescription"
                                value={editData.moduleDescription}
                                // onChange={handleInputChange}
                                className="module-description-textarea"
                            />
                        ) : (
                            <span>{editData.moduleDescription}</span>
                        )}
                    </div>
                </>
            )}

            {/* EDITING ACTION BUTTONS (Only visible when isEditing is true) */}
            {isEditing && (
                <div className="editing-actions flex-end">
                    <button className="btn btn-cancel" >Cancel</button>
                    <button className="btn btn-save" >Save Changes</button>
                </div>
            )}
        </div>
    );
};

// --- Main ModuleList Component ---
const ModuleList = ({ modules, onDeleteModule, onUpdateModule }) => {
    if (!modules || !modules.length) return <p className="no-modules">No modules yet. Start adding some! 📚</p>;

    return (
        <div className="module-list"> 
            {modules
                .sort((a, b) => a.moduleOrder - b.moduleOrder)
                .map((mod) => (
                    <ModuleItem 
                        key={mod._id} 
                        mod={mod} 
                        onDeleteModule={onDeleteModule} 
                        onUpdateModule={onUpdateModule}
                    />
                ))}
        </div>
    );
};

export default ModuleList;