// src/lib/protected-route.tsx
import React, { useEffect, useState } from "react";
import { Route, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";


interface ProtectedRouteProps {
  path: string;
  component: React.FC;
  requireParent?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  path,
  component: Component,
  requireParent = false,
}) => {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if (requireParent && user.role !== "parent") {
        navigate("/child-dashboard");
      } else if (!requireParent && user.role === "parent" && path.startsWith("/child")) {
        navigate("/dashboard");
      } else {
        setShouldRender(true); // ✅ safe to render after auth checks
      }
    }
  }, [user, isLoading, navigate, requireParent, path]);

  if (isLoading || !shouldRender) {
    return null;
  }

  return <Route path={path} component={Component} />;
};

// Remove invalid global onError handler. Handle errors per-query or in a QueryBoundary.
// Example: Remove the following block entirely.
// queryClient.setDefaultOptions({
//   queries: {
//     onError: (error: any) => {
//       if (error.message && error.message.includes("401")) {
//         window.location.href = "/auth";
//       }
//     },
//   },
// });

// After successful login:

// (Login and logout example code removed as it does not belong in this file)
