import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import { Toaster } from "@/components/ui/toaster";
// import Sidebar from "./components/common/Sidebar";
import ResetPassword from "./pages/auth/ResetPasswordPage";
import PrivateRoute from './components/common/PrivateRoute';
import PublicRoute from './components/common/PublicRoute';
import Cookies from 'js-cookie';
import NotFound from "./pages/NotFound";
import HomePage from "./pages/home/HomePage";

function App() {
  const accessToken = Cookies.get('accessToken'); // Read token

  return (
    <>
      <Router key={accessToken ? "authenticated" : "unauthenticated"}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
