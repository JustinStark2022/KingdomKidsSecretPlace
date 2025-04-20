import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { apiRequest } from "@/lib/queryClient";

// ✅ Set base URL for backend API
axios.defaults.baseURL = "http://localhost:5000";

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

  // ✅ Fetch user if token exists on mount
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
        console.log("✅ User loaded from token:", res.data);
        setCurrentUser(res.data);
      })
      .catch((err) => {
        console.warn("⚠️ Invalid or expired token:", err);
        setCurrentUser(null);
        localStorage.removeItem("token");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ✅ Login and store JWT token
  const login = async (credentials: Credentials): Promise<LoginResponse> => {
    try {
      const res = await axios.post("/api/auth/login", credentials);
      const { user, token } = res.data;

      console.log("✅ Login response:", res.data);

      if (token) {
        localStorage.setItem("token", token);
        console.log("✅ Token stored in localStorage");
      } else {
        console.warn("❌ Login response missing token");
      }

      setCurrentUser(user);
      return { success: true, user, token };
    } catch (err) {
      console.error("❌ Login error:", err);
      return { success: false, error: err };
    }
  };

  // ✅ Signup logic using apiRequest
  const signup = async (credentials: Credentials) => {
    try {
      const res = await apiRequest("POST", "/api/auth/signup", credentials);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  // ✅ Revalidate user manually
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
      console.error("❌ fetchUser error:", err);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Clear all session data
  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    console.log("👋 Logged out");
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
