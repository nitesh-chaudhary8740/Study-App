// import axios from "axios";
// import React, { useContext, useEffect, } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./Dashboard.css"; // 
// import { StudyContext } from "./StudyContext";

// const ProviderDashBoard = () => {
//   // const [values.currentProvider, setvalues.currentProvider] = useState(null);
//   const values = useContext(StudyContext)
//   const location = useLocation();
//   const navigate = useNavigate();

//   const fetchCurrentProviderInSession = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:8081/provider/current-provider",
//         { withCredentials: true }
//       );
//       const data = response.data.data;

//       // setvalues.currentProvider(data);
//       values.setCurrentProvider(data)
//     } catch (error) {
//       console.error(error);
//       navigate("/");
//     }
//   };

//   useEffect(() => {
//     if (location.state) {
//       values.setCurrentProvider(location.state);
//     } else {
//       fetchCurrentProviderInSession();
//     }
//   }, [values.setCurrentProvider,location]
// );

//   const providerLogout = async () => {
//     try {
//       await axios.get("http://localhost:8081/provider/provider-logout", {
//         withCredentials: true,
//       });
//       values.setCurrentProvider(null);
//       navigate("/");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     if (!values.currentProvider) {
//       const timer = setTimeout(() => {
//         navigate("/");
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [values.currentProvider, navigate]);

//   if (!values.currentProvider) {
//     return (
//       <div className="dashboard-loading">
//         <p>Loading Provider Dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-card">
//         <h1 className="dashboard-title">
//           Welcome, {values.currentProvider.fullName} 
//         </h1>
//         <p className="dashboard-subtitle">
//           You are logged in as a <strong>Course Provider</strong>
//         </p>

//         <div className="dashboard-info">
//           <div className="info-row">
//             <span className="info-label">Username:</span>
//             <span className="info-value">{values.currentProvider.providerUserName}</span>
//           </div>
//           <div className="info-row">
//             <span className="info-label">Email:</span>
//             <span className="info-value">{values.currentProvider.email}</span>
//           </div>
//         </div>

//         <button onClick={providerLogout} className="btn-primary logout-btn">
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProviderDashBoard;
