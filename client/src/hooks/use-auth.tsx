// src/hooks/use-auth.tsx
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { User } from "../types/user";
import { getMe, testAuthApi } from "../api/user";

console.log(testAuthApi()); // Debug: Should print "API is connected"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [location, navigate] = useLocation();

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const me = await getMe();
      setUser(me);
      setIsError(false);

      // ✅ Redirect if user is on /auth after successful login
      if (location === "/auth") {
        if (me.role === "parent") {
          navigate("/dashboard");
        } else {
          navigate("/child-dashboard");
        }
      }
    } catch (error) {
      console.warn("Auth fetchUser failed:", error);
      setIsError(true);
      setUser(null);

      // ⛔️ Prevent redirect loop if already on auth page
      if (location !== "/auth") {
        navigate("/auth");
      }
    } finally {
      setIsLoading(false);
    }
  }, [location, navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = () => {
    fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/auth");
    });
  };

  return {
    user,
    isLoading,
    isError,
    fetchUser,
    logout,
    setUser,
  };
}
