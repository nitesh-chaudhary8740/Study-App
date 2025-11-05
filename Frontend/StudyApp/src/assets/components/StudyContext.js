import { createContext } from "react";

 
 export const StudyContext = createContext({
    currentUser:null,
    setCurrentUser:()=>{},
    isLoading:true,
    setIsLoading:()=>{},
    // course:null,
    // setCourse:()=>{}

})