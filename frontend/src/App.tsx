import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SignUp from "./pages/auth/SignUp"
import Login from "./pages/auth/Login"
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "./components/common/Sidebar";
import ResetPassword from "./pages/auth/ResetPasswordPage";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Sidebar />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App
