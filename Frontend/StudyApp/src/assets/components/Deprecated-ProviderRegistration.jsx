// import React, { useState } from "react";
// import axios from "axios";
// import "./Auth.css"; // ✅ shared CSS for auth pages
// import { Link } from "react-router-dom";

// export default function ProviderRegistration() {
//   const [formData, setFormData] = useState({
//     providerUserName: "",
//     fullName: "",
//     email: "",
//     password: "",
//   });

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     console.log("Form data submitted:", formData);
//     try {
//       const response = await axios.post(
//         "http://localhost:8081/provider/provider-registration",
//         formData
//       );
//       const data = response.data;
//       console.log("data is", data);
//     } catch (error) {
//       console.log(error);
//       console.log(error.response?.data);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h2 className="auth-title">Register as Provider</h2>
//         <form onSubmit={handleSubmit} className="auth-form">
//           <div className="form-group">
//             <label htmlFor="fullName">Full Name</label>
//             <input
//               type="text"
//               id="fullName"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="providerUserName">Provider Username</label>
//             <input
//               type="text"
//               id="providerUserName"
//               name="providerUserName"
//               value={formData.providerUserName}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="email">Email Address</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button type="submit" className="btn-primary">
//             Register
//           </button>
//            <Link to="/provider-login" className="link">
//               Already have account
//             </Link>
//         </form>
//       </div>
//     </div>
//   );
// }
