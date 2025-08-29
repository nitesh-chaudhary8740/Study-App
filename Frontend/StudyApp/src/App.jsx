import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import UserRegister from "./assets/components/UserRegister"
import UserLogin from "./assets/components/UserLogin"
function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/register" element = {<UserRegister/>}/>
          <Route path="/login" element = {<UserLogin/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
