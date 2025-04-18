// client/src/hooks/useAuth.ts
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { apiRequest } from "@/lib/queryClient";

interface Credentials {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: any;
  token?: string;
  error?: unknown;
}

export const useAuth = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user on mount using stored token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch(() => {
        setCurrentUser(null);
        localStorage.removeItem("token"); // remove stale token
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ✅ Login and store JWT
  const login = async (credentials: Credentials): Promise<LoginResponse> => {
    try {
      const res = await axios.post("/api/auth/login", credentials);
      const { user, token } = res.data;

      if (token) {
        localStorage.setItem("token", token);
      }

      setCurrentUser(user);
      return { success: true, user, token };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  // ✅ Sign up user (if registration enabled)
  const signup = async (credentials: Credentials) => {
    try {
      const res = await apiRequest("POST", "/api/auth/signup", credentials);
      const data = await res.json();
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  // ✅ Manually fetch authenticated user
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        setCurrentUser(res.data);
      } else {
        setCurrentUser(null);
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Optional logout function
  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  return {
    currentUser,
    login,
    signup,
    fetchUser,
    logout,
    isLoading: loading,
    isAuthenticated: !!currentUser,
    isParent: currentUser?.role === "parent",
    isChild: currentUser?.role === "child",
    isError: !loading && !currentUser,
  };
};

export default useAuth;
