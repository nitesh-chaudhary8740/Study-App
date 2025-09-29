import React, {  useEffect, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import { StudyContext } from "./StudyContext";

const UserDashBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();
   const values = useContext(StudyContext);
  // const [values.currentUser, values.setCurrentUser] = useState(null);

  const fetchCurrentUserInSession = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/user/current-user",
        { withCredentials: true }
      );
      const data = await response.data;
      console.log(data);
      values.setCurrentUser(data.data);
    } catch (error) {
      console.log("error", error);
      navigate("/login");
    }
  }, [navigate,values]);

  useEffect(() => {
    if (location.state && location.state.data && location.state.data.user) {
      values.setCurrentUser(location.state.data.user);
    } else {
      fetchCurrentUserInSession();
    }
  }, [location, fetchCurrentUserInSession,values]);

  if (!values.currentUser) {
    return (
      <div className="dashboard-loading">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Welcome, {values.currentUser.fullName}!</h1>
        <p className="dashboard-subtitle">Your dashboard is ready.</p>

        <div className="dashboard-info">
          <div className="info-item">
            <p className="info-label">Username:</p>
            <p className="info-value">{values.currentUser.userName}</p>
          </div>
          <div className="info-item">
            <p className="info-label">Email:</p>
            <p className="info-value">{values.currentUser.email}</p>
          </div>
        </div>

        <button
          className="btn-logout"
          onClick={async () => {
            const response = await axios.post(
              "http://localhost:8081/user/logout",
              {},
              { withCredentials: true }
            );
            const data = await response.data;
            console.log("user logout", data);
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDashBoard;
