import {BrowserRouter as Router,Routes,Route,Link} from "react-router-dom"
import UserRegister from "./assets/components/UserRegister"
import UserLogin from "./assets/components/UserLogin"

import UserDashBoard from "./assets/components/UserDashBoard"

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
        </Routes>
      </>
    </Router>
  )
}

export default App