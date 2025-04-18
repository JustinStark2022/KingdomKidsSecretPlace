// client/src/components/routing/ProtectedRoute.tsx
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoading, currentUser } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      setLocation("/login");
    }
  }, [isLoading, currentUser, setLocation]);

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Authenticating...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
