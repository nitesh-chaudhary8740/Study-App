import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useCallback } from 'react';

// Use Tailwind CSS classes for styling
const UserDashBoard = () => {
    // The useLocation hook allows us to access the state passed from the navigate function.
    const location = useLocation();
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null);
    const fetchCurrentUserInSession =useCallback (async()=>{
        try {
            const response = await axios.get("http://localhost:8081/user/current-user",{withCredentials:true});
            const data = await response.data;
            console.log(data)
            setUserData(data.data)
        } catch (error) {
            console.log("error",error)
            navigate("/login")
        }
    },[navigate])
    useEffect(() => {
        // Access the data from the location state.
        // It's a good practice to check if the state exists to prevent errors.
        console.log(location.state)
        if (location.state && location.state.data && location.state.data.user) {
            setUserData(location.state.data.user);
        }
        else{
           fetchCurrentUserInSession() 
        }

    }, [location,fetchCurrentUserInSession]);

    if (!userData) {
        return (
            <div >
                <p>Loading user data...</p>
            </div>
        );
    }

    // This component will not render if userData is null
    return (
        <div >
            <div >
                <h1 >Welcome, {userData.fullName}!</h1>
                <p >Your dashboard is ready.</p>
                
                <div >
                    <div>
                        <p >Username:</p>
                        <p >{userData.userName}</p>
                    </div>
                    <div>
                        <p >Email:</p>
                        <p>{userData.email}</p>
                    </div>
                </div>
            </div>
            <button onClick={async()=>{
               const response =  await  axios.post("http://localhost:8081/user/logout", {},{withCredentials:true})
               const data = await response.data
               console.log("user logout",data)
               navigate("/")
            }} >logout</button>
        </div>
    );
};

export default UserDashBoard;
