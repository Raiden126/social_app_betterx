import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { JSX } from "react";
import { authService } from "@/services/authService";
import { Loader2 } from "lucide-react";

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authService.getProfile();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-5xl">
        <Loader2 className="animate-spin" />
    </div>
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
