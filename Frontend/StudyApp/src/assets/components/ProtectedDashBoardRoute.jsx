import React, { useContext } from 'react'
import { StudyContext } from './StudyContext'
import { Navigate } from 'react-router-dom';

function ProtectedDashBoardRoute({children}) {
    const values = useContext(StudyContext);
    if(!(values.currentUser)){
        <Navigate to='/login' replace/>
        return
    }
  return children;
}

export default ProtectedDashBoardRoute
