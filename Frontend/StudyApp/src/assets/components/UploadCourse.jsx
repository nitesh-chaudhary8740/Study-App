import axios from 'axios'
import React from 'react'
import { useState } from 'react'

const UploadCourse = () => {

    const [createdCourse,setCreatedCourse] = useState(null)
    const[courseData,setCourseData] = useState({
        courseName:"",
        coursePrice:"",
        courseProvider:""

    })
const handOnSubmit = async(event)=>{
    event.preventDefault()
    const response = await axios.post("http://localhost:8081/admin/upload-course",courseData)
    console.log(response)
    const data = response.data.data;
    console.log(data)
    setCreatedCourse(data)
}

  const inputHandleChange = (event)=>{
    const {name,value} = event.target
    setCourseData(prev =>({
        ...prev,
        [name]:value,
    }))
  }
  if(createdCourse){
    return (
        <div>
            <h1>your course successFully created</h1>
            <span><h2>Course Code: </h2>{createdCourse.courseCode}</span>
            <span><h2>Course Name: </h2>{createdCourse.courseName}</span>
            <span><h2>Course price: </h2>{createdCourse.coursePrice}</span>
            <span><h2>Course provider: </h2>{createdCourse.courseProvider}</span>
        </div>
    )
  }
  return (
    <div>
        <div>
            <h1>courseName:{courseData.courseName}</h1>
            <h1>coursePrice:{courseData.coursePrice}</h1>
            <h1>courseProvider:{courseData.courseProvider}</h1>
        </div>
      <form onSubmit={handOnSubmit}>
        <input type="text" placeholder='courseName' name='courseName' value={courseData.courseName} onChange={inputHandleChange} />
        <input type="text" placeholder='coursePrice' name='coursePrice' value={courseData.coursePrice}  onChange={inputHandleChange}/>
        <input type="text" placeholder='courseProvider' name='courseProvider' value={courseData.courseProvider} onChange={inputHandleChange}/>
        <input type="submit" value="upload course" />
      </form>
    </div>
  )
}

export default UploadCourse
