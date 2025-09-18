import {BrowserRouter as Router,Routes,Route,Link} from "react-router-dom"
import UserRegister from "./assets/components/UserRegister"
import UserLogin from "./assets/components/UserLogin"

import UserDashBoard from "./assets/components/UserDashBoard"
import UploadCourse from "./assets/components/UploadCourse"
import ProviderRegistration from "./assets/components/ProviderRegistration"

function App() {
 
  return (
    <Router>
      <>
        <Link to="/register"> Register </Link>
        <Link to="/login"> login </Link>
        <Routes>
          <Route path="/register" element={<UserRegister />} />
          <Route path="/login" element={<UserLogin  />} />
          <Route path="/dashboard" element={<UserDashBoard/>} />
          <Route path="/upload-course" element={<UploadCourse/>} />
          <Route path="/provider-registration" element={<ProviderRegistration/>} />
          
        </Routes>
      </>
    </Router>
  )
}

export default App