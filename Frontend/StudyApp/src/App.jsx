import {BrowserRouter as Router,Routes,Route,Link} from "react-router-dom"
import UserRegister from "./assets/components/UserRegister"
import UserLogin from "./assets/components/UserLogin"

import UserDashBoard from "./assets/components/UserDashBoard"
import UploadCourse from "./assets/components/UploadCourse"
import Navbar from "./assets/components/Navbar"
import StudyAppProvider from "./assets/components/StudyAppProvider"

function App() {
 
  return (
    <Router>
      <>
      <StudyAppProvider>

        <Navbar/>
        <Routes>
          <Route path="/register" element={<UserRegister />} />
          <Route path="/login" element={<UserLogin  />} />
          <Route path="/dashboard" element={<UserDashBoard/>} />
          <Route path="/upload-course" element={<UploadCourse/>} />
          
        </Routes>
      </StudyAppProvider>
      </>
    </Router>
  )
}

export default App