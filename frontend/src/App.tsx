import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SignUp from "./pages/auth/SignUp"
import Login from "./pages/auth/Login"
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
