import React, {  useMemo, useState } from 'react'
import { StudyContext } from './StudyContext';

export function StudyAppProvider({children}) {
    const [currentUser,setCurrentUser] =useState(null);
    
    const value = useMemo(()=>({currentUser,setCurrentUser,}),[currentUser])
  return (
   <StudyContext.Provider value={value}>
    {children}
   </StudyContext.Provider>
  )
}

export default StudyAppProvider
