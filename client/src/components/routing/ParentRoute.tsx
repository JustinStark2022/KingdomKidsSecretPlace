import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

const ParentRoute: React.FC<Props> = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && (!currentUser || currentUser.role !== "parent")) {
      setLocation("/login");
    }
  }, [isLoading, currentUser, setLocation]);

  if (isLoading || !currentUser || currentUser.role !== "parent") {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Checking access...</div>;
  }

  return <>{children}</>;
};

export default ParentRoute;