import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SignUp from "./pages/signup/SignUp"
import Login from "./pages/login/Login"
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
