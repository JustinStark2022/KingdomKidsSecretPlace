import React, { useEffect } from "react";
import ParentDashboard from "@/components/dashboard/ParentDashboard";
import ChildDashboard from "@/components/dashboard/ChildDashboard";
import useAuth from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const Dashboard: React.FC = () => {
  const { currentUser, isLoading, isError, fetchUser } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isError) navigate("/login");
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30 dark:opacity-30"
          style={{
            backgroundImage: "url('/images/dashpbg2.png')",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative z-10 p-6 space-y-6">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-40 mt-2" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="relative z-10 p-6">
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="mt-2">
              There was a problem loading your dashboard. Please try again.
            </AlertDescription>
            <Button className="mt-4" onClick={fetchUser}>
              Try Again
            </Button>
          </Alert>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="relative z-10 space-y-6 p-6  rounded-lg max-w-md mx-auto mt-8 bg-card">
          <h2 className="text-2xl font-bold mb-2">
            <span className="text-primary">Welcome</span> to Kingdom Kids!
          </h2>
          <p className="text-muted-foreground mb-4">Sign in to continue.</p>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/login")} className="w-full">
              Sign In
            </Button>
            <Button variant="outline" onClick={() => navigate("/signup")} className="w-full">
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-50 dark:opacity-85"
        style={{
          backgroundImage: "url('/images/dashpbg2.png')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      />
      <div className="relative z-10">
        {currentUser.isParent ? (
          <ParentDashboard />
        ) : (
          <ChildDashboard childId={currentUser.id} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
