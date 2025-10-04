import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { StudyContext } from "./StudyContext";
import { useNavigate } from "react-router-dom";

export function StudyAppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch current user once when the app starts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:8081/user/current-user", {
          withCredentials: true,
        });
        setCurrentUser(data.data);
      } catch (error) {
        console.log("Not logged in or session expired:", error);
        setCurrentUser(null);
        navigate('/login')
        console.log("wordked")
        // Optionally navigate("/login") — but better let components handle redirects
      } finally {
        setIsLoading(false);
      }
    };
    if(!currentUser){
      fetchCurrentUser();
    }
  }, [navigate,currentUser]);

  const value = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      isLoading,
      setIsLoading
    }),
    [currentUser, isLoading]
  );

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export default StudyAppProvider;
