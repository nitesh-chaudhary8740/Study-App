import React, { useContext } from 'react'
import { StudyContext } from './StudyContext'
import { Navigate } from 'react-router-dom'


function ProtectedLoginRoute({children}) {
    const values = useContext(StudyContext)
    console.log(" login redirect current",values.currentUser)
    

    if(values.currentUser){
    return   <Navigate to='/dashboard' replace />
    }
  return children
}

export default ProtectedLoginRoute
