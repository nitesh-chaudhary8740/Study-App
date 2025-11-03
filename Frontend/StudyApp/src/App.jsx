import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserRegister from "./assets/components/UserRegister";
import UserLogin from "./assets/components/UserLogin";
import UserDashBoard from "./assets/components/UserDashBoard";
import UploadCourse from "./assets/components/UploadCourse";
import Navbar from "./assets/components/Navbar";
import StudyAppProvider from "./assets/components/StudyAppProvider";
import PublisherDashboard from "./assets/components/PublisherDashboard";
import ProtectedLoginRoute from "./assets/components/ProtectedLoginRoute";
import ProtectedDashBoardRoute from "./assets/components/ProtectedDashBoardRoute";
import Home from "./assets/components/Home";
import ManageCourse from "./assets/components/ManageCourse";


function App() {
  
  return (
    <Router>
      <StudyAppProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<UserRegister />} />
          <Route
            path="/login"
            element={
              <ProtectedLoginRoute>
                <UserLogin />
              </ProtectedLoginRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedDashBoardRoute>
                <UserDashBoard />
              </ProtectedDashBoardRoute>
            }
          />
          <Route
  path="/publisher-dashboard/manage/:courseId"
  element={
  
      <ManageCourse />
  
  }
/>

          <Route path="/publisher-dashboard" element={<PublisherDashboard />} />
        </Routes>

        {/* 🔔 Toast Notification Container */}
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </StudyAppProvider>
    </Router>
  );
}

export default App;
