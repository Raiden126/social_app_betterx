import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { JSX } from "react";

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { loading, isAuthenticated } = useAuthCheck();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-5xl">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
