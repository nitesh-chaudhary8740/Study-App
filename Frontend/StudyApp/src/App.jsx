import {BrowserRouter as Router,Routes,Route,Link} from "react-router-dom"
import UserRegister from "./assets/components/UserRegister"
import UserLogin from "./assets/components/UserLogin"

import UserDashBoard from "./assets/components/UserDashBoard"
import UploadCourse from "./assets/components/UploadCourse"
import Navbar from "./assets/components/Navbar"
import StudyAppProvider from "./assets/components/StudyAppProvider"
import PublisherDashboard from "./assets/components/PublisherDashboard"
import ProtectedLoginRoute from "./assets/components/ProtectedLoginRoute"

function App() {
 
  return (
    <Router>
      <>
      <StudyAppProvider>

        <Navbar/>
        <Routes>
          <Route path="/register" element={<UserRegister />} />
          <Route path="/login" element={<ProtectedLoginRoute>
            <UserLogin/>
          </ProtectedLoginRoute>} />
          <Route path="/dashboard" element={<UserDashBoard/>} />
          <Route path="/publisher-dashboard" element={<PublisherDashboard/>} />
          
        </Routes>
      </StudyAppProvider>
      </>
    </Router>
  )
}

export default App