import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SignUp from "./pages/auth/SignUp"
import Login from "./pages/auth/Login"
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import { Toaster } from "@/components/ui/toaster";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App
