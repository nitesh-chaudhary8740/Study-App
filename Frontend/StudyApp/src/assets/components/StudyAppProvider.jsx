import React, { useMemo, useState, useEffect, useRef } from "react";
import axios from "axios";
import { StudyContext } from "./StudyContext";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export function StudyAppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFetching = useRef(false); // 🚫 prevents concurrent requests
  

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (isFetching.current) return; // 👈 skip if already fetching
      isFetching.current = true;

      try {
        const response = await axios.get("http://localhost:8081/user/current-user", {
          withCredentials: true,
        });
        console.log("user fetched",response)
        console.log("user fetched",response.data)
        setCurrentUser(response.data.data);
        toast.success("user fetched successfully")
        return <Navigate to="/dashboard" replace/>
        
      } catch (err) {
        console.log("Session invalid:", err);
        setCurrentUser(null);
      } finally {
        isFetching.current = false;
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      isLoading,
      setIsLoading,
    }),
    [currentUser, isLoading]
  );

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export default StudyAppProvider;
