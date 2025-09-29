// import axios from "axios";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Auth.css"; // reuse the same auth styles

// const ProviderLogin = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     providerUserName_or_email: "",
//     password: "",
//   });

//   const inputOnChangeHandler = (event) => {
//     const { name, value } = event.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const onLoginFormSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:8081/provider/provider-login",
//         formData,
//         { withCredentials: true }
//       );
//       const data = response.data.data;
//       navigate("/provider-dashboard", { state: data });
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2 className="auth-title">Provider Login</h2>
//         <form onSubmit={onLoginFormSubmit} className="auth-form">
//           <div className="form-group">
//             <label htmlFor="providerUserName_or_email">
//               Username or Email
//             </label>
//             <input
//               required
//               type="text"
//               id="providerUserName_or_email"
//               name="providerUserName_or_email"
//               value={formData.providerUserName_or_email}
//               onChange={inputOnChangeHandler}
//               placeholder="Enter your username or email"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               required
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={inputOnChangeHandler}
//               placeholder="Enter your password"
//             />
//           </div>

//           <button type="submit" className="btn-primary">
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProviderLogin;
