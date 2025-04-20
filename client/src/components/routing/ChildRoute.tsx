import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

const ChildRoute: React.FC<Props> = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && (!currentUser || currentUser.role !== "child")) {
      setLocation("/login");
    }
  }, [isLoading, currentUser, setLocation]);

  if (isLoading || !currentUser || currentUser.role !== "child") {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Checking access...</div>;
  }

  return <>{children}</>;
};

export default ChildRoute;