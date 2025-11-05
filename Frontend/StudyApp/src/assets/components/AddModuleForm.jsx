import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { inputOnChange } from "./util.functions";

function AddModuleForm({setCourse,courseId}) {
    const [newModule, setNewModule] = useState({
            moduleTitle: "",
            moduleDescription:"",
        });  

     const handleFormSubmit = async(e) => {
        e.preventDefault();
        if (!newModule.moduleTitle) {
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8081/user/manage-course/add-module/${courseId}`)
            console.log(response.data.data)
            setCourse(response.data.data)
            setNewModule({
            moduleTitle: "",
            moduleDescription:"",
        })
        } catch (error) {
            console.log("error",error)
            toast.error("error in adding module",error)
        }
    }
  return (
    <div className="add-module-form-wrapper">
    <h3>Add New Module</h3>
     <form onSubmit={handleFormSubmit} className="module-form">
      <input
        type="text"
        name="moduleTitle"
        placeholder="Module Title"
        value={newModule.moduleTitle}
        onChange={inputOnChange(setNewModule)}
        required
        className="text-input"
      />
      <textarea
        type="text"
        name="moduleDescription"
        placeholder="Module Description"
        value={newModule.moduleDescription}
        onChange={inputOnChange(setNewModule)}
        required
        className="text-input"
      />
      <button
        type="submit"
        className="btn btn-submit"
      >
        ADD
      </button>
    </form>
   </div>
  );
}

export default AddModuleForm;
